// client/src/pages/BuildPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import PoolBuilder from '../PoolBuilder';
import { api } from '../services/api';
import Layout from '../Layout';

function BuildPage() {
  const { id } = useParams(); // Get pool ID from URL if it exists
  const navigate = useNavigate();
  
  const [sideboardCards, setSideboardCards] = useState([]);
  const [mainboardCards, setMainboardCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [set, setSet] = useState('TDM');
  const [user, setUser] = useState('Guest'); // Replace with actual user auth

  useEffect(() => {
    // If there's an ID in the URL, load that pool
    if (id) {
      loadPool(id);
    }
  }, [id]);

  const loadPool = async (poolId) => {
    try {
      setLoading(true);
      const response = await api.getPoolById(poolId);
      
      if (response.success) {
        setMainboardCards(response.data.mainboard);
        setSideboardCards(response.data.sideboard);
        setSet(response.data.set);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load pool');
    } finally {
      setLoading(false);
    }
  };

  const savePool = async () => {
    try {
      setLoading(true);
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
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to save pool');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result) => {
    // Your existing drag and drop logic
    // ...
  };

  if (loading && !mainboardCards.length) {
    return <div>Loading pool...</div>;
  }

  return (
    <Layout>
    <div>
      <h1>Build Pool</h1>
      
      <div className="pool-controls">
        <label>
          Set:
          <select value={set} onChange={(e) => setSet(e.target.value)}>
            <option value="TDM">TDM</option>
            <option value="FDN">FDN</option>
          </select>
        </label>
        
        <button onClick={savePool} disabled={loading}>
          {loading ? 'Saving...' : 'Save Pool'}
        </button>
        
        {error && <div className="error">{error}</div>}
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <PoolBuilder sideboard={sideboardCards} mainboard={mainboardCards} />
      </DragDropContext>
    </div>
    </Layout>
  );
}

export default BuildPage;