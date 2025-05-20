import * as Scry from 'scryfall-sdk';

// Set user agent for Scryfall API
Scry.setAgent('Pool Party App', '1.0.0');

export const searchCards = async (req, res) => {
    try {
        const { query, set } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }

        let searchQuery = query.trim();

        // Add set filter if provided
        if (set && set.trim() !== '') {
            searchQuery = `${searchQuery} set:${set.toLowerCase()}`;
        }

        // Use the Scryfall SDK to search for cards with autocomplete
        // This provides fuzzy matching capabilities
        console.log(`Searching for: ${searchQuery}`);
        const cards = await Scry.Cards.search(searchQuery, {
            unique: 'cards',
            order: 'name',
            limit: 15, // Limit results to prevent overwhelming responses
        }).waitForAll();

        // Transform results to match our application's format
        const formattedResults = cards.map(card => {
            // Handle cards with multiple faces (like double-faced cards)
            const imageUris = card.image_uris || (card.card_faces && card.card_faces[0].image_uris);

            return {
                name: card.name,
                set_name: card.set.toUpperCase(),
                collection_number: card.collector_number,
                large_img: imageUris?.large || '',
                normal_img: imageUris?.normal || '',
                small_img: imageUris?.small || '',
                cmc: card.cmc || 0,
                color: card.colors || [],
                color_identity: card.color_identity || [],
                rarity: card.rarity,
                type_line: card.type_line || '',
                oracle_text:
                    card.oracle_text || (card.card_faces && card.card_faces[0].oracle_text) || '',
                mana_cost:
                    card.mana_cost || (card.card_faces && card.card_faces[0].mana_cost) || '',
            };
        });

        res.status(200).json({
            success: true,
            data: formattedResults,
        });
    } catch (error) {
        console.error('Error searching cards:', error);

        // Scryfall API might return specific error types we can handle
        if (error.type === 'ambiguous') {
            return res.status(200).json({
                success: true,
                message: 'Multiple matches found, please be more specific.',
                data: error.cards || [],
            });
        }

        // Handle not found gracefully
        if (error.code === 'not_found') {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No cards found matching your search.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error searching for cards',
            error: error.message,
        });
    }
};
