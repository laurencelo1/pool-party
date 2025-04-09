import React, { useState } from 'react';
// import { DragDropContext } from 'react-beautiful-dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import CardContainer from './CardContainer';
import './App.css';

function App() {
  // Test card including all properties needed by your Card component
  const testCard = {
    id: "1",
    name: "Sire of Seven Deaths",
    color: [],
    cmc: 7,
    localImage: "https://cards.scryfall.io/png/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.png?1730657490"
  };
  
  const [mainboardCards, setMainboardCards] = useState([testCard]);
  const [sideboardCards, setSideboardCards] = useState([testCard]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    // Skip if dropped outside or in same position
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }
    
    // Get source and destination arrays
    const sourceCards = source.droppableId === "mainboard" ? 
      [...mainboardCards] : [...sideboardCards];
    const destCards = destination.droppableId === "mainboard" ? 
      [...mainboardCards] : [...sideboardCards];
    
    // Remove from source
    const [movedCard] = sourceCards.splice(source.index, 1);
    
    // Add to destination
    destCards.splice(destination.index, 0, movedCard);
    
    // Update state
    if (source.droppableId === "mainboard") {
      setMainboardCards(sourceCards);
    } else {
      setSideboardCards(sourceCards);
    }
    
    if (destination.droppableId === "mainboard") {
      setMainboardCards(destCards);
    } else {
      setSideboardCards(destCards);
    }
  };

  return (
    <div className="app">
      <h1>Card Dragger</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="containers-wrapper">
          <CardContainer
            id="mainboard"
            header="Main Board"
            cards={mainboardCards}
          />
          <CardContainer
            id="sideboard"
            header="Side Board"
            cards={sideboardCards}
          />
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;