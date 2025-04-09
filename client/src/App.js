import React, { useState } from 'react';
// import { DragDropContext } from 'react-beautiful-dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import CardContainer from './CardContainer';
import Card from './Card';
import './App.css';

const cards = [
    {
      "name": "Sire of Seven Deaths",
      "large_img": "https://cards.scryfall.io/large/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
      "mana_cost": "{7}",
      "cmc": 7,
      "rarity": "mythic",
      "color": [],
      "color_identity": [],
      "type_line": "Creature — Eldrazi",
      "collection_number": "1",
    }, {
      "name": "Camera Launcher",
      "large_img": "https://cards.scryfall.io/large/front/9/6/968651db-92fb-46cd-acda-9e097668b7c9.jpg?1738356791",
      "mana_cost": "{3}",
      "cmc": 3,
      "color": [],
      "color_identity": [],
      "type_line": "Artifact Creature — Construct",
      "collection_number": "232",

  }
]


function App() {
  const cardItems = cards.map(card=> 
    <Card 
      name={card.name}
      color={card.color}
      cmc={card.cmc}
      imageUrl={card.large_img}
      cNum={card.collection_number}
    />
  )

  return cardItems;
}

export default App;