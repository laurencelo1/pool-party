import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import Layout from '../Layout';
import './HomePage.css';

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
                <p className="tagline">Build, save, and share your card pools</p>

                <nav className="quick-nav">
                    <ul>
                        <li>
                            <Link to="/upload" className="quick-nav-button">
                                Upload
                            </Link>
                        </li>
                        <li>
                            <Link to="/build" className="quick-nav-button">
                                Build
                            </Link>
                        </li>
                        <li>
                            <Link to="/daily" className="quick-nav-button">
                                Pool of the Day
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="featured-section">
                    <h2>Featured Sets</h2>
                    <div className="featured-sets">
                        <div className="set-card">
                            <Link to="/set/TDM" className="set-button">
                                TDM
                            </Link>
                            <div className="set-info">
                                <h3>Tarkir Dragonstorm</h3>
                                <p>
                                    Return to the world of Tarkir with dragons and powerful khans.
                                </p>
                            </div>
                        </div>

                        <div className="set-card">
                            <Link to="/set/FDN" className="set-button">
                                FDN
                            </Link>
                            <div className="set-info">
                                <h3>Foundations</h3>
                                <p>The base set that establishes the core mechanics and world.</p>
                            </div>
                        </div>
                    </div>

                    <div className="view-all-link">
                        <Link to="/sets">View All Sets</Link>
                    </div>
                </div>

                <h2>Recent Pools</h2>
                {loading ? (
                    <p>Loading pools...</p>
                ) : (
                    <div className="pool-list">
                        {pools.length > 0 ? (
                            pools.map(pool => (
                                <div key={pool._id} className="pool-item">
                                    <h3>Pool by {pool.user}</h3>
                                    <p>Set: {pool.set}</p>
                                    <p>Cards: {pool.mainboard.length + pool.sideboard.length}</p>
                                    <Link to={`/build/${pool._id}`} className="view-pool-link">
                                        View/Edit
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>No pools found. Be the first to create one!</p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default HomePage;
