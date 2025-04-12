import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import PoolBuilder from './PoolBuilder';

const SIDE = [
  {
    "name": "Sire of Seven Deaths",
    "large_img": "https://cards.scryfall.io/large/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
    "cmc": 7,
    "color": [],
    "collection_number": "1",
    "set_name": "FDN",
  }, {
    "name": "Camera Launcher",
    "large_img": "https://cards.scryfall.io/large/front/9/6/968651db-92fb-46cd-acda-9e097668b7c9.jpg?1738356791",
    "cmc": 3,
    "color": [],
    "collection_number": "232",
    "set_name": "DFT",
  }
];

const MAIN = [{
  "name": "Abhorrent Oculus",
  "large_img": "https://cards.scryfall.io/large/front/d/2/d2705b43-a94a-44c0-8740-82e0b296820c.jpg?1726286015",
  "cmc": 3,
  "color": [
    "U"
  ],
  "collection_number": "42",
  "set_name": "DSK",
}, {
  "name": "Fear of Isolation",
  "large_img": "https://cards.scryfall.io/large/front/6/9/69aa6054-8c59-4bbc-a283-adb453639786.jpg?1726286073",
  "cmc": 2,
  "color": [
    "U"
  ],
  "collection_number": "58",
  "set_name": "DSK",
}];

export default function App() {
  const onDragEnd = (result) => {
    console.log(`from ${result.source}`);
    console.log(`to ${result.destination}`);
  };

  return (
    <div className="app">
      <DragDropContext onDragEnd={onDragEnd}>
        <PoolBuilder sideboard={SIDE} mainboard={MAIN} />
      </DragDropContext>
    </div>
  );
}
