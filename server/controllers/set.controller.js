import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSetCards = async (req, res) => {
    const { setCode } = req.params;

    // Only allow lowercase set codes for security
    const normalizedSetCode = setCode.toLowerCase();

    try {
        // Construct path to the set data file
        const dataDir = path.join(__dirname, '..', '..', 'client', 'public', 'data', 'sets');
        const filePath = path.join(dataDir, `${normalizedSetCode}.json`);

        // Read the file
        const fileData = await fs.readFile(filePath, 'utf8');
        const setData = JSON.parse(fileData);

        // Return the cards data
        res.status(200).json({
            success: true,
            data: {
                setCode: setData.setCode,
                name: setData.name,
                cardCount: setData.cardCount,
                cards: Object.values(setData.cards),
            },
        });
    } catch (error) {
        console.error(`Error fetching set data for ${setCode}:`, error);

        // Check if it's a file not found error
        if (error.code === 'ENOENT') {
            return res.status(404).json({
                success: false,
                message: `Set ${setCode} not found`,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching set data',
        });
    }
};
