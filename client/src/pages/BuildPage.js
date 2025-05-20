import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import PoolBuilder from '../PoolBuilder';
import { api } from '../services/api';
import Layout from '../Layout';
import './BuildPage.css'; // We'll create this file for styling

function BuildPage() {
  const { id } = useParams(); // Get pool ID from URL if it exists
  const navigate = useNavigate();
  
  const [sideboardCards, setSideboardCards] = useState([]);
  const [mainboardCards, setMainboardCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [set, setSet] = useState('TDM');
  const [user, setUser] = useState('Guest'); // Replace with actual user auth

  // For the ID search functionality
  const [searchId, setSearchId] = useState('');
  
  // For listing recent pools
  const [recentPools, setRecentPools] = useState([]);
  const [loadingPools, setLoadingPools] = useState(false);

  useEffect(() => {
    // If there's an ID in the URL, load that pool
    if (id) {
      loadPool(id);
    } else {
      // If no ID, fetch recent pools
      fetchRecentPools();
    }
  }, [id]);

  const fetchRecentPools = async () => {
    try {
      setLoadingPools(true);
      const response = await api.getPools();
      
      if (response.success) {
        setRecentPools(response.data);
      } else {
        setError("Failed to load recent pools");
      }
    } catch (err) {
      console.error("Error fetching recent pools:", err);
      setError("Error loading recent pools");
    } finally {
      setLoadingPools(false);
    }
  };

  const loadPool = async (poolId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getPoolById(poolId);
      
      if (response.success) {
        setMainboardCards(response.data.mainboard);
        setSideboardCards(response.data.sideboard);
        setSet(response.data.set);
      } else {
        setError(response.message || 'Failed to load pool');
      }
    } catch (err) {
      console.error(`Error loading pool ${poolId}:`, err);
      setError('Failed to load pool. Check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/build/${searchId.trim()}`);
    }
  };

  const savePool = async () => {
    try {
      setLoading(true);
      setError(null);
      const poolData = {
        mainboard: mainboardCards,
        sideboard: sideboardCards,
        set: set,
        user: user,
      };

      let response;
      if (id) {
        // Update existing pool
        response = await api.updatePool(id, poolData);
      } else {
        // Create new pool
        response = await api.createPool(poolData);
        if (response.success) {
          // Navigate to the pool's unique URL
          navigate(`/build/${response.data._id}`);
        }
      }

      if (!response.success) {
        setError(response.message || 'Failed to save pool');
      }
    } catch (err) {
      console.error('Error saving pool:', err);
      setError('Failed to save pool');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    
    let movingCard;
    // find moving card
    if (source.droppableId === "sideboard") {
      movingCard = sideboardCards[source.index];
    } else if (source.droppableId === "mainboard") {
      movingCard = mainboardCards[source.index];
    }

    // moving within
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "sideboard") {
        let newSideboard = Array.from(sideboardCards);
        newSideboard.splice(source.index, 1);
        newSideboard.splice(destination.index, 0, movingCard);
        setSideboardCards(newSideboard);
      } else if (source.droppableId === "mainboard") {
        let newMainboard = Array.from(mainboardCards);
        newMainboard.splice(source.index, 1);
        newMainboard.splice(destination.index, 0, movingCard);
        setMainboardCards(newMainboard);
      }
    } 
    // moving to diff
    else {
      // side to main
      if (source.droppableId === "sideboard") {
        let newSideboard = Array.from(sideboardCards);
        newSideboard.splice(source.index, 1);
        setSideboardCards(newSideboard);

        let newMainboard = Array.from(mainboardCards);
        newMainboard.splice(destination.index, 0, movingCard);
        setMainboardCards(newMainboard);
      } 
      // main to side
      else {
        let newMainboard = Array.from(mainboardCards);
        newMainboard.splice(source.index, 1);
        setMainboardCards(newMainboard);

        let newSideboard = Array.from(sideboardCards);
        newSideboard.splice(destination.index, 0, movingCard);
        setSideboardCards(newSideboard);
      }
    }
  };

  // For new pool creation
  const startNewPool = () => {
    setSideboardCards([]);
    setMainboardCards([]);
    setError(null);
    // Stay on the same page but clear the state
  };

  if (loading && id && !mainboardCards.length) {
    return (
      <Layout>
        <div className="build-page">
          <h1>Loading pool...</h1>
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  // Show pool builder if ID is provided or if pool is being created
  if (id || mainboardCards.length > 0 || sideboardCards.length > 0) {
    return (
      <Layout>
        <div className="build-page">
          <h1>{id ? 'Edit Pool' : 'Create New Pool'}</h1>
          
          <div className="pool-controls">
            <div className="control-group">
              <label>
                Set:
                <select value={set} onChange={(e) => setSet(e.target.value)}>
                  <option value="TDM">TDM</option>
                  <option value="FDN">FDN</option>
                </select>
              </label>
            </div>
            
            <div className="button-group">
              <button onClick={savePool} disabled={loading} className="primary-button">
                {loading ? 'Saving...' : 'Save Pool'}
              </button>
              
              <button onClick={startNewPool} className="secondary-button">
                Start New Pool
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <PoolBuilder sideboard={sideboardCards} mainboard={mainboardCards} />
          </DragDropContext>
        </div>
      </Layout>
    );
  }

  // Show pool selection if no ID is provided
  return (
    <Layout>
      <div className="build-page">
        <h1>Build Pool</h1>
        
        <div className="pool-search-section">
          <h2>Find a Pool</h2>
          <form onSubmit={handleSearch} className="id-search-form">
            <input 
              type="text" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Pool ID"
              className="id-search-input"
            />
            <button type="submit" className="search-button" disabled={!searchId.trim()}>
              Find Pool
            </button>
          </form>
        </div>
        
        <div className="create-new-section">
          <h2>Create New Pool</h2>
          <p>Start building a new pool from scratch</p>
          <button onClick={startNewPool} className="primary-button">
            Create New Pool
          </button>
        </div>
        
        <div className="recent-pools-section">
          <h2>Recent Pools</h2>
          {loadingPools ? (
            <div className="loading-message">Loading recent pools...</div>
          ) : recentPools.length > 0 ? (
            <div className="pools-grid">
              {recentPools.map(pool => (
                <div key={pool._id} className="pool-card">
                  <div className="pool-card-header">
                    <h3>{pool.set} Pool</h3>
                    <span className="pool-user">by {pool.user}</span>
                  </div>
                  <div className="pool-card-stats">
                    <div className="stat">
                      <span className="stat-value">{pool.mainboard.length}</span>
                      <span className="stat-label">Main</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{pool.sideboard.length}</span>
                      <span className="stat-label">Side</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">
                        {new Date(pool.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="stat-label">Updated</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/build/${pool._id}`)}
                    className="view-pool-button"
                  >
                    View/Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-pools-message">No recent pools found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default BuildPage;