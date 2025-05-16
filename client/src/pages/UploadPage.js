import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Layout from '../Layout';

function UploadPage() {
  const navigate = useNavigate();
  const [poolText, setPoolText] = useState('');
  const [setCode, setSetCode] = useState('TDM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parser function for "1 Card Name" format
  const parsePoolText = (text, defaultSet) => {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const cards = [];

    lines.forEach(line => {
      const regex = /^(\d+)\s+(.+)$/;
      const match = line.trim().match(regex);

      if (match) {
        const [, quantityStr, cardName] = match;
        const quantity = parseInt(quantityStr, 10);
        
        for (let i = 0; i < quantity; i++) {
          cards.push({
            name: cardName.trim(),
            set_name: defaultSet,
            collection_number: `unknown-${Math.random().toString(36).substr(2, 9)}`,
            large_img: `https://cards.scryfall.io/large/front/placeholder.jpg`,
            cmc: 0,
            color: [],
          });
        }
      } else {
        // If no quantity specified, assume quantity of 1
        const cardName = line.trim();
        if (cardName) {
          cards.push({
            name: cardName,
            set_name: defaultSet,
            collection_number: `unknown-${Math.random().toString(36).substr(2, 9)}`,
            large_img: `https://cards.scryfall.io/large/front/placeholder.jpg`,
            cmc: 0,
            color: [],
          });
        }
      }
    });

    return cards;
  };

  const handleSubmit = async (e) => {
    console.log("submitting");
    e.preventDefault();
    
    if (!poolText.trim()) {
      setError('Please enter pool data');
      return;
    }
    
    try {
      setLoading(true);
      
      // Parse the pool text
      const cards = parsePoolText(poolText, setCode);
      console.log(cards);
      
      if (cards.length === 0) {
        setError('No valid cards found in the input');
        setLoading(false);
        return;
      }
      
      // Create the pool
      const response = await api.createPool({
        mainboard: [], // Start with empty mainboard
        sideboard: cards, // All parsed cards go to sideboard initially
        set: setCode,
        user: 'Guest', // Replace with actual user when you add authentication
      });
      
      if (response.success) {
        // Navigate to build page to edit the pool
        navigate(`/build/${response.data._id}`);
      } else {
        console.log("api response", response);
        setError(response.message);
      }
    } catch (err) {
      console.error('Error processing pool:', err);
      setError('Failed to process pool data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        <h1>Upload Pool</h1>
        
        {error && <div className="error">{error}</div>}
        
        <div className="instructions">
          <p>Enter your cards in the format: "1 Card Name" (one per line)</p>
          <p>Example:</p>
          <pre>
            1 Sire of Seven Deaths
            2 Mountain
            1 Fear of Isolation
          </pre>
        </div>
        
        <form onSubmit={handleSubmit}>
          <textarea 
            name="pool" 
            id="pool_submit" 
            rows="20" 
            cols="40"
            value={poolText}
            onChange={(e) => setPoolText(e.target.value)}
            placeholder="Enter your cards here..."
          />
          <br />
          
          <select 
            name="set" 
            id="set" 
            required
            value={setCode}
            onChange={(e) => setSetCode(e.target.value)}
          >
            <option value="TDM">TDM</option>
            <option value="FDN">FDN</option>
          </select>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Pool'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default UploadPage;