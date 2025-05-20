/**
 * Card lookup system for efficient local lookups of card data
 * Uses preloaded set data from JSON files
 */

// Storage for loaded card sets
const cardSets = {};
const nameToCollector = {};
let isInitialized = false;
let availableSets = [];

/**
 * Initialize the card database by loading set data
 * @param {Array} setsToLoad Array of set codes to load (e.g., ['TDM', 'FDN'])
 * @returns {Promise<boolean>} Success indicator
 */
export const initializeCardDatabase = async setsToLoad => {
    if (isInitialized) {
        return true;
    }

    try {
        // Load the sets index first to see what's available
        const indexResponse = await fetch('/data/sets/index.json');
        if (!indexResponse.ok) {
            throw new Error('Failed to load sets index');
        }

        const indexData = await indexResponse.json();
        availableSets = Object.keys(indexData);
        console.log(`Available sets: ${availableSets.join(', ')}`);

        // If no specific sets requested, load all available sets
        const setsToProcess = setsToLoad || availableSets;

        // Load each requested set
        for (const setCode of setsToProcess) {
            if (!availableSets.includes(setCode.toUpperCase())) {
                console.warn(`Set ${setCode} not found in available sets`);
                continue;
            }

            await loadSetData(setCode);
        }

        isInitialized = true;
        console.log('Card database initialized with sets:', Object.keys(cardSets));
        return true;
    } catch (error) {
        console.error('Failed to initialize card database:', error);
        return false;
    }
};

/**
 * Load data for a specific set
 * @param {string} setCode The set code to load
 * @returns {Promise<boolean>} Success indicator
 */
export const loadSetData = async setCode => {
    const normalizedCode = setCode.toUpperCase();

    // Skip if already loaded
    if (cardSets[normalizedCode]) {
        return true;
    }

    try {
        console.log(`Loading set data for ${normalizedCode}...`);
        const response = await fetch(`/data/sets/${normalizedCode.toLowerCase()}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load set data for ${normalizedCode}`);
        }

        const setData = await response.json();

        // Store the card data indexed by collector number
        cardSets[normalizedCode] = setData.cards;

        // Store the name-to-collector number mappings
        nameToCollector[normalizedCode] = setData.nameIndex;

        console.log(`Loaded ${Object.keys(setData.cards).length} cards for set ${normalizedCode}`);
        return true;
    } catch (error) {
        console.error(`Error loading set ${normalizedCode}:`, error);
        return false;
    }
};

/**
 * Get a list of available card sets
 * @returns {Array} Array of available set codes
 */
export const getAvailableSets = () => {
    return [...availableSets];
};

/**
 * Check if a set is loaded
 * @param {string} setCode The set code to check
 * @returns {boolean} Whether the set is loaded
 */
export const isSetLoaded = setCode => {
    return !!cardSets[setCode.toUpperCase()];
};

/**
 * Get card data by card name and set
 * @param {string} cardName The name of the card
 * @param {string} setCode The set code (e.g., "TDM")
 * @returns {Object|null} The card data or null if not found
 */
export const getCardByName = (cardName, setCode) => {
    const normalizedCode = setCode.toUpperCase();

    if (!isInitialized) {
        console.warn('Card database not initialized');
        return null;
    }

    if (!cardSets[normalizedCode]) {
        console.warn(`Set ${normalizedCode} not loaded in card database`);
        return null;
    }

    // Try exact match first
    const exactCollectorNum = nameToCollector[normalizedCode][cardName.toLowerCase()];
    if (exactCollectorNum && cardSets[normalizedCode][exactCollectorNum]) {
        return { ...cardSets[normalizedCode][exactCollectorNum] };
    }

    // Try fuzzy match if exact match fails
    const cardNameLower = cardName.toLowerCase();
    for (const name in nameToCollector[normalizedCode]) {
        if (name.includes(cardNameLower) || cardNameLower.includes(name)) {
            const collectorNum = nameToCollector[normalizedCode][name];
            return { ...cardSets[normalizedCode][collectorNum] };
        }
    }

    console.warn(`Card "${cardName}" not found in set ${normalizedCode}`);
    return null;
};

/**
 * Get card data by collector number
 * @param {string} setCode The set code (e.g., "TDM")
 * @param {string} collectorNumber The collector number
 * @returns {Object|null} The card data or null if not found
 */
export const getCardByCollector = (setCode, collectorNumber) => {
    const normalizedCode = setCode.toUpperCase();

    if (!isInitialized) {
        console.warn('Card database not initialized');
        return null;
    }

    if (!cardSets[normalizedCode] || !cardSets[normalizedCode][collectorNumber]) {
        console.warn(`Card ${normalizedCode}:${collectorNumber} not found in card database`);
        return null;
    }

    return { ...cardSets[normalizedCode][collectorNumber] };
};

/**
 * Get all cards from a set
 * @param {string} setCode The set code (e.g., "TDM")
 * @returns {Array} Array of all cards in the set
 */
export const getAllCardsInSet = setCode => {
    const normalizedCode = setCode.toUpperCase();

    if (!isInitialized) {
        console.warn('Card database not initialized');
        return [];
    }

    if (!cardSets[normalizedCode]) {
        console.warn(`Set ${normalizedCode} not loaded in card database`);
        return [];
    }

    return Object.values(cardSets[normalizedCode]);
};

/**
 * Encode a pool for efficient storage
 * @param {Array} cardList Array of card objects
 * @returns {Object} Encoded pool with set and collector numbers
 */
export const encodePool = cardList => {
    const encodedPool = {
        cardCounts: {},
    };

    cardList.forEach(card => {
        const key = `${card.set_name}:${card.collection_number}`;
        encodedPool.cardCounts[key] = (encodedPool.cardCounts[key] || 0) + 1;
    });

    return encodedPool;
};

/**
 * Decode a pool from efficient storage to full card objects
 * @param {Object} encodedPool Encoded pool with set and collector numbers
 * @returns {Array} Array of full card objects
 */
export const decodePool = encodedPool => {
    const decodedCards = [];

    if (!isInitialized) {
        console.warn('Card database not initialized');
        return [];
    }

    Object.entries(encodedPool.cardCounts).forEach(([key, count]) => {
        const [setCode, collectorNumber] = key.split(':');
        const cardData = getCardByCollector(setCode, collectorNumber);

        if (cardData) {
            for (let i = 0; i < count; i++) {
                decodedCards.push({ ...cardData });
            }
        }
    });

    return decodedCards;
};

/**
 * Create a placeholder card when a card is not found
 * @param {string} cardName Name of the card
 * @param {string} setCode Set code
 * @returns {Object} Placeholder card object
 */
export const createPlaceholderCard = (cardName, setCode) => {
    return {
        name: cardName,
        set_name: setCode.toUpperCase(),
        collection_number: `unknown-${Math.random().toString(36).substr(2, 9)}`,
        large_img: `/placeholders/${setCode.toLowerCase()}.jpg`, // Generic set placeholder
        cmc: 0,
        color: [],
        rarity: 'unknown',
        type_line: 'Unknown Card',
        oracle_text: '',
        found: false,
    };
};

/**
 * Get card statistics for a pool
 * @param {Array} cardList Array of card objects
 * @returns {Object} Statistics about the pool
 */
export const getPoolStats = cardList => {
    const stats = {
        totalCards: cardList.length,
        byColor: {
            W: 0,
            U: 0,
            B: 0,
            R: 0,
            G: 0,
            multicolor: 0,
            colorless: 0,
        },
        byRarity: {
            common: 0,
            uncommon: 0,
            rare: 0,
            mythic: 0,
            special: 0,
        },
        byType: {},
        averageCmc: 0,
        uniqueCards: new Set(),
    };

    let totalCmc = 0;

    cardList.forEach(card => {
        // Count by color
        if (!card.color || card.color.length === 0) {
            stats.byColor.colorless++;
        } else if (card.color.length > 1) {
            stats.byColor.multicolor++;
        } else {
            const color = card.color[0];
            if (stats.byColor[color] !== undefined) {
                stats.byColor[color]++;
            }
        }

        // Count by rarity
        if (card.rarity && stats.byRarity[card.rarity.toLowerCase()] !== undefined) {
            stats.byRarity[card.rarity.toLowerCase()]++;
        }

        // Count by type
        if (card.type_line) {
            // Extract primary type (Creature, Instant, etc.)
            const primaryType = card.type_line.split('—')[0].trim().split(' ').pop();
            stats.byType[primaryType] = (stats.byType[primaryType] || 0) + 1;
        }

        // Add to CMC total
        totalCmc += card.cmc || 0;

        // Track unique cards
        stats.uniqueCards.add(`${card.set_name}:${card.collection_number}`);
    });

    // Calculate average CMC
    stats.averageCmc = cardList.length > 0 ? totalCmc / cardList.length : 0;

    // Convert unique cards set to count
    stats.uniqueCardCount = stats.uniqueCards.size;
    delete stats.uniqueCards;

    return stats;
};

export default {
    initializeCardDatabase,
    loadSetData,
    getAvailableSets,
    isSetLoaded,
    getCardByName,
    getCardByCollector,
    getAllCardsInSet,
    encodePool,
    decodePool,
    createPlaceholderCard,
    getPoolStats,
};
