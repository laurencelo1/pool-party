const API_BASE_URL = 'http://localhost:3000';

export const api = {
    // Get all pools
    getPools: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/pool`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching pools:', error);
            throw error;
        }
    },

    // Get a single pool by ID
    getPoolById: async poolId => {
        try {
            const response = await fetch(`${API_BASE_URL}/pool/${poolId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching pool ${poolId}:`, error);
            throw error;
        }
    },

    // Create a new pool
    createPool: async poolData => {
        console.log(`Sending request to: ${API_BASE_URL}/pool`);
        try {
            const response = await fetch(`${API_BASE_URL}/pool`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(poolData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating pool:', error);
            throw error;
        }
    },

    // Update an existing pool
    updatePool: async (poolId, poolData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pool/${poolId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(poolData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error updating pool ${poolId}:`, error);
            throw error;
        }
    },

    // Delete a pool
    deletePool: async poolId => {
        try {
            const response = await fetch(`${API_BASE_URL}/pool/${poolId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error deleting pool ${poolId}:`, error);
            throw error;
        }
    },

    // Get all cards from a set
    getSetCards: async setCode => {
        try {
            const response = await fetch(`${API_BASE_URL}/set/${setCode}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching cards for set ${setCode}:`, error);
            throw error;
        }
    },

    // Search for cards
    searchCards: async (query, set = '') => {
        try {
            // Build query string with optional set parameter
            let queryString = `?query=${encodeURIComponent(query)}`;
            if (set) {
                queryString += `&set=${encodeURIComponent(set)}`;
            }

            const response = await fetch(`${API_BASE_URL}/search${queryString}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching for cards:', error);
            throw error;
        }
    },
};
