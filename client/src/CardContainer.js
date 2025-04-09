import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';
import './CardContainer.css';

function CardContainer({ id, header, cards }) {
    const cardItems = cards.map(card=> 
    <Card 
      name={card.name}
      color={card.color}
      cmc={card.cmc}
      imageUrl={card.large_img}
      cNum={card.collection_number}
    />
  )
  return (
    <div className={id}>
      <h3>{header}</h3>
      <div className='card-container'>
        {cardItems}
      </div>
    </div>
  );
}

export default CardContainer;