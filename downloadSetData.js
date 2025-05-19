import * as Scry from 'scryfall-sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

Scry.setAgent("Pool Party App", "1.0.0");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setCode = process.argv[2];
if (!setCode) {
  console.error('Please provide a set code, e.g., node downloadSetData.js TDM');
  process.exit(1);
}

const outputDir = path.join(__dirname, 'client', 'public', 'data', 'sets');

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch (err) {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

const outputFile = path.join(outputDir, `${setCode.toLowerCase()}.json`);

const initialCardStructure = {
  name: null,
  set_name: null,
  collection_number: null,
  large_img: null,
  normal_img: null,
  small_img: null,
  cmc: null,
  color: null,
  color_identity: null,
  rarity: null,
  type_line: null,
  oracle_text: null,
  mana_cost: null
};

/**
 * fetch all cards from a set using Scryfall SDK
 * @param {string} setCode The set code (e.g., "TDM")
 * @returns {Promise<Array>} Array of card objects
 */
async function fetchSetCards(setCode) {
  console.log(`Fetching cards for set ${setCode}...`);
  
  try {
    // Using the SDK's bySet function which handles pagination internally
    const cards = await Scry.Cards.search(`set:${setCode.toLowerCase()}`)
      .waitForAll();
    
    console.log(`Successfully fetched ${cards.length} cards from set ${setCode}`);
    return cards;
  } catch (error) {
    console.error('Error fetching cards from Scryfall:', error);
    process.exit(1);
  }
}

/**
 * Process Scryfall card data into our preferred format
 * @param {Array} cards Array of Scryfall card objects
 * @param {string} setCode The set code
 * @returns {Object} Processed card data in our format
 */
function processCardData(cards, setCode) {
  console.log(`Processing ${cards.length} cards...`);
  
  const processedData = {
    setCode: setCode.toUpperCase(),
    name: cards.length > 0 && cards[0].set_name ? cards[0].set_name : setCode,
    cardCount: cards.length,
    lastUpdated: new Date().toISOString(),
    cards: {},
    nameIndex: {}
  };
  
  // Process each card
  cards.forEach(card => {
    // handle double-faced cards
    const imageUris = card.image_uris || (card.card_faces && card.card_faces[0].image_uris);
    
    if (!imageUris) {
      console.warn(`Warning: No image URIs found for card: ${card.name}`);
    }
    
    // Extract the data we need
    const processedCard = {
      ...initialCardStructure,
      name: card.name,
      set_name: setCode.toUpperCase(),
      collection_number: card.collector_number,
      large_img: imageUris?.large || '',
      normal_img: imageUris?.normal || '',
      small_img: imageUris?.small || '',
      cmc: card.cmc || 0,
      color: card.colors || [],
      color_identity: card.color_identity || [],
      rarity: card.rarity,
      type_line: card.type_line || '',
      oracle_text: card.oracle_text || (card.card_faces && card.card_faces[0].oracle_text) || '',
      mana_cost: card.mana_cost || (card.card_faces && card.card_faces[0].mana_cost) || ''
    };
    
    processedData.cards[card.collector_number] = processedCard;
    
    processedData.nameIndex[card.name.toLowerCase()] = card.collector_number;
  });
  
  return processedData;
}

/**
 * Create or update the sets index file
 * @param {string} setsIndexFile Path to the index file
 * @param {string} setCode Set code
 * @param {Object} processedData Processed card data
 */
async function updateSetsIndex(setsIndexFile, setCode, processedData) {
  let setsIndex = {};
  
  try {
    try {
      const indexData = await fs.readFile(setsIndexFile, 'utf8');
      setsIndex = JSON.parse(indexData);
    } catch (error) {
      console.log('Creating new sets index file');
    }
    
    setsIndex[setCode.toUpperCase()] = {
      name: processedData.name,
      cardCount: processedData.cardCount,
      lastUpdated: processedData.lastUpdated
    };
    
    await fs.writeFile(setsIndexFile, JSON.stringify(setsIndex, null, 2));
    console.log(`Updated sets index at ${setsIndexFile}`);
    
  } catch (error) {
    console.error('Error updating sets index:', error);
  }
}

async function main() {
  try {
    console.log(`Starting download of set data for ${setCode}...`);
    
    await ensureDirectoryExists(outputDir);
    
    const cards = await fetchSetCards(setCode);
    
    const processedData = processCardData(cards, setCode);
    console.log(`Processed data for ${processedData.name} (${setCode})`);
    
    await fs.writeFile(outputFile, JSON.stringify(processedData, null, 2));
    console.log(`Data saved to ${outputFile}`);
    
    // index file to track supported sets
    const setsIndexFile = path.join(outputDir, 'index.json');
    await updateSetsIndex(setsIndexFile, setCode, processedData);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();