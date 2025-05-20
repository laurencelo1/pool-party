import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../Layout';
import cardLookup from '../utils/cardLookup';
import './SetPage.css';

function SetPage() {
    const { setCode } = useParams();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSetCards = async () => {
            try {
                setLoading(true);

                // Initialize card database for the requested set
                await cardLookup.initializeCardDatabase([setCode]);

                // Get all cards in the set
                const cardsFromSet = cardLookup.getAllCardsInSet(setCode);

                if (cardsFromSet.length === 0) {
                    setError(`No cards found for set ${setCode}`);
                } else {
                    setCards(cardsFromSet);
                }
            } catch (err) {
                console.error(`Error loading cards for set ${setCode}:`, err);
                setError(`Failed to load cards for set ${setCode}`);
            } finally {
                setLoading(false);
            }
        };

        loadSetCards();
    }, [setCode]);

    if (loading) {
        return (
            <Layout>
                <div className="set-page">
                    <h1>Loading {setCode} cards...</h1>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="set-page">
                    <h1>Error</h1>
                    <p className="error-message">{error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="set-page">
                <h1>{setCode} Card Gallery</h1>
                <p>Showing {cards.length} cards from the set</p>

                <div className="card-gallery">
                    {cards.map(card => (
                        <div className="card-item" key={card.collection_number}>
                            <img
                                src={card.normal_img}
                                alt={card.name}
                                className="card-image"
                                loading="lazy"
                            />
                            <div className="card-info">
                                <h3>{card.name}</h3>
                                <p>
                                    #{card.collection_number} • {card.rarity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default SetPage;
