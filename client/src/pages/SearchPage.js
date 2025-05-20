import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../Layout';
import { api } from '../services/api';
import './SearchPage.css';

function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialSet = searchParams.get('set') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedSet, setSelectedSet] = useState(initialSet);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    // Available sets
    const availableSets = [
        { code: '', name: 'All Sets' },
        { code: 'TDM', name: 'TDM - Tarkir Dragonstorm' },
        { code: 'FDN', name: 'FDN - Foundations' },
        // Add more sets as needed
    ];

    // Effect to handle URL parameters and perform search on initial load
    useEffect(() => {
        console.log('URL params:', { query: initialQuery, set: initialSet });

        if (initialQuery) {
            // Only search if there's a query
            performSearch(initialQuery, initialSet);
        }
    }, [initialQuery, initialSet]);

    const handleSearchChange = e => {
        setSearchQuery(e.target.value);
    };

    const handleSetChange = e => {
        setSelectedSet(e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setError('Please enter a search term');
            return;
        }

        // Update URL parameters
        const params = new URLSearchParams();
        params.set('q', searchQuery);
        if (selectedSet) {
            params.set('set', selectedSet);
        }
        setSearchParams(params);

        performSearch(searchQuery, selectedSet);
    };

    const performSearch = async (query, set) => {
        if (!query || query.trim() === '') {
            setError('Please enter a search term');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setMessage('');

            console.log('Searching for:', { query, set });

            const response = await api.searchCards(query, set);
            console.log('Search response:', response);

            if (response.success) {
                setResults(response.data || []);

                if (response.message) {
                    setMessage(response.message);
                }

                if ((response.data?.length === 0 || !response.data) && !response.message) {
                    setMessage('No cards found matching your search.');
                }
            } else {
                setError(response.message || 'Search failed');
            }
        } catch (err) {
            console.error('Error during search:', err);
            setError('An error occurred while searching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="search-page">
                <h1>Card Search</h1>

                <form className="search-form" onSubmit={handleSubmit}>
                    <div className="search-inputs">
                        <input
                            type="text"
                            placeholder="Search for a card..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />

                        <select
                            value={selectedSet}
                            onChange={handleSetChange}
                            className="set-selector"
                        >
                            {availableSets.map(set => (
                                <option key={set.code} value={set.code}>
                                    {set.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="search-button"
                            disabled={loading || !searchQuery.trim()}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                </form>

                <div className="search-results">
                    {message && <p className="result-message">{message}</p>}

                    {results && results.length > 0 ? (
                        <div className="results-grid">
                            {results.map((card, index) => (
                                <div
                                    className="card-result"
                                    key={`${card.set_name}-${card.collection_number}-${index}`}
                                >
                                    <img
                                        src={card.normal_img}
                                        alt={card.name}
                                        className="card-image"
                                        loading="lazy"
                                    />
                                    <div className="card-details">
                                        <h3>{card.name}</h3>
                                        <p>
                                            {card.set_name} • #{card.collection_number}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : loading ? null : (
                        <p className="no-results">
                            {initialQuery
                                ? 'No results found. Try a different search term.'
                                : 'Enter a search term to find cards. For Michael: Try "storm" in FDN to test the search with a set.'}
                        </p>
                    )}

                    {loading && (
                        <div className="loading-indicator">
                            <p>Searching...</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default SearchPage;
