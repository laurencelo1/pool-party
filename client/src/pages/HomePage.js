import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

function HomePage() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await api.getPools();
        if (response.success) {
          setPools(response.data);
        }
      } catch (error) {
        console.error('Error fetching pools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  return (
    <Layout>
    <div>
      <h1>Pool Party</h1>
      <nav>
        <ul>
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/build">Build</Link></li>
          <li><Link to="/daily">Pool of the Day</Link></li>
        </ul>
      </nav>
      
      <div className="featured-section">
        <h2>Featured Set</h2>
        <div className="featured-set">
          <Link to="/set/TDM" className="set-button">
            Browse TDM Cards
          </Link>
          <p>View all cards from the TDM set in our gallery view.</p>
        </div>
      </div>
      
      <h2>Recent Pools</h2>
      {loading ? (
        <p>Loading pools...</p>
      ) : (
        <div className="pool-list">
          {pools.map(pool => (
            <div key={pool._id} className="pool-item">
              <h3>Pool by {pool.user}</h3>
              <p>Set: {pool.set}</p>
              <p>Cards: {pool.mainboard.length + pool.sideboard.length}</p>
              <Link to={`/build/${pool._id}`}>View/Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
    </Layout>
  );
}

export default HomePage;