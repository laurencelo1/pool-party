import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';
import './DailyPool.css';

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
                    throw new Error(
                        `Failed to fetch daily pool: ${response.status} ${response.statusText}`
                    );
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

    const formatDate = dateString => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading">Loading daily pool...</div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="error-container">
                    <div className="error">Error: {error}</div>
                    <Link to="/" className="home-link">
                        Go to homepage
                    </Link>
                </div>
            </Layout>
        );
    }

    if (!dailyPool) {
        return (
            <Layout>
                <div className="no-daily-pool">
                    <h2>No Daily Pool Available</h2>
                    <p>There is no daily pool set for today.</p>
                    <p>
                        Anyone can set a daily pool by sending a POST request to /daily with a pool
                        ID.
                    </p>
                    <Link to="/" className="home-link">
                        Go to homepage
                    </Link>
                </div>
            </Layout>
        );
    }

    // Assuming the pool contains mainboard and sideboard arrays
    const { pool } = dailyPool;

    return (
        <Layout>
            <div className="daily-pool-container">
                <div className="daily-pool-header">
                    <h1>Daily Pool - {formatDate(dailyPool.dailyPool.date)}</h1>
                    <p>Pool Set: {pool.set}</p>
                    <p>Submitted by: {pool.user}</p>
                </div>

                <div className="daily-pool-actions">
                    <Link to={`/build/${pool._id}`} className="view-pool-link">
                        View Full Pool Details
                    </Link>
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
            </div>
        </Layout>
    );
};

export default DailyPool;
