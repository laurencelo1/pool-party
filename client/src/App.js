import React, { useOptimistic } from 'react';
import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import PoolBuilder from './PoolBuilder';
import { api } from './services/api';
import 'App.css';

const SIDE = [
    {
        name: 'Sire of Seven Deaths',
        large_img:
            'https://cards.scryfall.io/large/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490',
        cmc: 7,
        color: [],
        collection_number: '1',
        set_name: 'FDN',
    },
    {
        name: 'Camera Launcher',
        large_img:
            'https://cards.scryfall.io/large/front/9/6/968651db-92fb-46cd-acda-9e097668b7c9.jpg?1738356791',
        cmc: 3,
        color: [],
        collection_number: '232',
        set_name: 'DFT',
    },
    {
        name: 'Sire of Seven Deaths',
        large_img:
            'https://cards.scryfall.io/large/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490',
        cmc: 7,
        color: [],
        collection_number: '1',
        set_name: 'FDN',
    },
    {
        name: 'Camera Launcher',
        large_img:
            'https://cards.scryfall.io/large/front/9/6/968651db-92fb-46cd-acda-9e097668b7c9.jpg?1738356791',
        cmc: 3,
        color: [],
        collection_number: '232',
        set_name: 'DFT',
    },
];

const MAIN = [
    {
        name: 'Abhorrent Oculus',
        large_img:
            'https://cards.scryfall.io/large/front/d/2/d2705b43-a94a-44c0-8740-82e0b296820c.jpg?1726286015',
        cmc: 3,
        color: ['U'],
        collection_number: '42',
        set_name: 'DSK',
    },
    {
        name: 'Fear of Isolation',
        large_img:
            'https://cards.scryfall.io/large/front/6/9/69aa6054-8c59-4bbc-a283-adb453639786.jpg?1726286073',
        cmc: 2,
        color: ['U'],
        collection_number: '58',
        set_name: 'DSK',
    },
];

export default function App() {
    const [sideboardCards, setSideboardCards] = useState(SIDE);
    const [mainboardCards, setMainboardCards] = useState(MAIN);
    const [poolId, setPoolId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load a pool by ID
    const loadPool = async id => {
        try {
            setLoading(true);
            const response = await api.getPoolById(id);

            if (response.success) {
                setMainboardCards(response.data.mainboard);
                setSideboardCards(response.data.sideboard);
                setPoolId(id);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to load pool');
        } finally {
            setLoading(false);
        }
    };

    // Save current pool
    const savePool = async () => {
        try {
            setLoading(true);
            const poolData = {
                mainboard: mainboardCards,
                sideboard: sideboardCards,
                set: 'FDN', // Example set code
                user: 'example_user', // Replace with actual user
            };

            let response;
            if (poolId) {
                // Update existing pool
                response = await api.updatePool(poolId, poolData);
            } else {
                // Create new pool
                response = await api.createPool(poolData);
                if (response.success) {
                    setPoolId(response.data._id);
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

    const onDragEnd = result => {
        console.log(result);
        const { source, destination } = result;

        if (!destination) {
            console.log('destination is null!');
            return;
        }
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            console.log('drag drop in place!');
            return;
        }

        let movingCard;
        // find moving card
        if (source.droppableId === 'sideboard') {
            movingCard = sideboardCards[source.index];
        } else if (source.droppableId === 'mainboard') {
            movingCard = mainboardCards[source.index];
        }

        // moving within
        if (source.droppableId === destination.droppableId) {
            if (source.droppableId === 'sideboard') {
                let newSideboard = Array.from(sideboardCards);
                newSideboard.splice(source.index, 1);
                newSideboard.splice(destination.index, 0, movingCard);
                setSideboardCards(newSideboard);
            } else if (source.droppableId === 'mainboard') {
                let newMainboard = Array.from(mainboardCards);
                newMainboard.splice(source.index, 1);
                newMainboard.splice(destination.index, 0, movingCard);
                setMainboardCards(newMainboard);
            }
        }
        // moving to diff
        else {
            // side to main
            if (source.droppableId === 'sideboard') {
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

    return (
        <div className="app">
            <div className="actions">
                <button onClick={savePool} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Pool'}
                </button>
                {error && <div className="error">{error}</div>}
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <PoolBuilder sideboard={sideboardCards} mainboard={mainboardCards} />
            </DragDropContext>
        </div>
    );
}
