import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';
import './SetsPage.css';

import tdmImage from '../assets/TDM.jpg';
import fdnImage from '../assets/FDN.jpg';

function SetsPage() {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const availableSets = [
            {
                code: 'TDM',
                name: 'Tarkir Dragonstorm',
                description: 'Return to the world of Tarkir with dragons and powerful khans.',
                releaseDate: 'May 2024',
                cardCount: 280,
                image: tdmImage,
            },
            {
                code: 'FDN',
                name: 'Foundations',
                description: 'The base set that establishes the core mechanics and world.',
                releaseDate: 'February 2024',
                cardCount: 265,
                image: fdnImage,
            },
        ];

        setSets(availableSets);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="sets-page">
                    <h1>Loading Sets...</h1>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="sets-page">
                    <h1>Error</h1>
                    <p className="error-message">{error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="sets-page">
                <h1>Card Sets</h1>
                <p>Browse through all available card sets</p>

                <div className="sets-grid">
                    {sets.map(set => (
                        <div className="set-card" key={set.code}>
                            <div className="set-image-container">
                                <img
                                    src={set.image}
                                    alt={`${set.name} (${set.code})`}
                                    className="set-image"
                                />
                            </div>
                            <div className="set-info">
                                <h2>
                                    {set.name} <span className="set-code">({set.code})</span>
                                </h2>
                                <p className="set-description">{set.description}</p>
                                <div className="set-details">
                                    <span>Released: {set.releaseDate}</span>
                                    <span>{set.cardCount} cards</span>
                                </div>
                                <Link to={`/set/${set.code}`} className="view-set-button">
                                    Browse Cards
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default SetsPage;
