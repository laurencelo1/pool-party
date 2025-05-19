import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DailyPool = () => {
  const [dailyPool, setDailyPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDailyPool = async () => {
      try {
        setLoading(true);
        
        // Make sure the URL is correct - note the potential /api prefix if you're using it
        const response = await fetch('http://localhost:3000/daily');
        
        // Check for non-OK responses and handle them explicitly
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not OK:', response.status, errorText);
          throw new Error(`Failed to fetch daily pool: ${response.status} ${response.statusText}`);
        }
        
        // Now parse the JSON
        const data = await response.json();
        
        // Check the structure of your response
        if (!data.success) {
          throw new Error(data.message || 'Unknown error fetching daily pool');
        }
        
        setDailyPool(data.data);
      } catch (err) {
        console.error('Error fetching daily pool:', err);
        setError(err.message || 'Failed to fetch daily pool');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDailyPool();
  }, []);
  
  
  if (loading) {
    return <div className="loading">Loading daily pool...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
        <Link to="/" className="home-link">Go to homepage</Link>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return <div className="loading">Loading daily pool...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
        <Link to="/" className="home-link">Go to homepage</Link>
      </div>
    );
  }
  
  if (!dailyPool) {
    return (
      <div className="no-daily-pool">
        <h2>No Daily Pool Available</h2>
        <p>There is no daily pool set for today.</p>
        <p>Anyone can set a daily pool by sending a POST request to /daily with a pool ID.</p>
        <Link to="/" className="home-link">Go to homepage</Link>
      </div>
    );
  }
  
  // Assuming the pool contains mainboard and sideboard arrays
  const { pool } = dailyPool;
  
  return (
    <div className="daily-pool-container">
      <div className="daily-pool-header">
        <h1>Daily Pool - {formatDate(dailyPool.dailyPool.date)}</h1>
        <p>Pool Set: {pool.set}</p>
        <p>Submitted by: {pool.user}</p>
      </div>
      
      <div className="pool-contents">
        <div className="mainboard">
          <h3>Mainboard ({pool.mainboard.length} cards)</h3>
          <ul className="card-list">
            {pool.mainboard.map((card, index) => (
              <li key={`main-${index}`} className="card-item">
                {typeof card === 'string' ? card : card.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="sideboard">
          <h3>Sideboard ({pool.sideboard.length} cards)</h3>
          <ul className="card-list">
            {pool.sideboard.map((card, index) => (
              <li key={`side-${index}`} className="card-item">
                {typeof card === 'string' ? card : card.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="daily-pool-actions">
        <Link to={`/pools/${pool._id}`} className="view-pool-link">
          View Full Pool Details
        </Link>
      </div>
      
      <div className="set-daily-info">
        <h3>Set a New Daily Pool</h3>
        <p>Anyone can set a new daily pool by sending a POST request to:</p>
        <code>/daily</code>
        <p>with the following JSON body:</p>
        <pre>{`{ "poolId": "pool_id_here" }`}</pre>
        <p>Example using curl:</p>
        <pre>{`curl -X POST http://localhost:3000/daily \\
  -H "Content-Type: application/json" \\
  -d '{"poolId": "pool_id_here"}'`}</pre>
      </div>
      
      <style jsx>{`
        .daily-pool-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .daily-pool-header {
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .daily-pool-header h1 {
          margin-bottom: 10px;
          color: #0066cc;
        }
        
        .pool-contents {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .mainboard, .sideboard {
          flex: 1;
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .card-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .card-item {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .card-item:last-child {
          border-bottom: none;
        }
        
        .daily-pool-actions {
          margin-bottom: 30px;
          text-align: center;
        }
        
        .view-pool-link {
          display: inline-block;
          padding: 10px 20px;
          background-color: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 3px;
          font-weight: bold;
        }
        
        .view-pool-link:hover {
          background-color: #0099ff;
        }
        
        .set-daily-info {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
          margin-top: 30px;
        }
        
        .set-daily-info h3 {
          margin-bottom: 10px;
          color: #0066cc;
        }
        
        .set-daily-info pre, .set-daily-info code {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 3px;
          overflow-x: auto;
          margin: 10px 0;
          font-family: monospace;
        }
        
        .error-container, .no-daily-pool {
          text-align: center;
          padding: 30px;
        }
        
        .home-link {
          display: inline-block;
          margin-top: 15px;
          padding: 8px 15px;
          background-color: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 3px;
        }
        
        .home-link:hover {
          background-color: #0099ff;
        }
      `}</style>
    </div>
  );
};

export default DailyPool;