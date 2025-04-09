import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import './CardContainer.css';

function CardContainer({ id, header, cards }) {
    const cardItems = cards.map((card, index) => 
    <Card 
      key={`${card.set_name}-${card.collection_number}-${index}`}
      id={`${card.set_name}-${card.collection_number}-${index}`}
      index={index}
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
      {/* <Droppable droppableId={id}>
        {(provided) => (
          <div
            className='card-container'
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cardItems}
            {provided.placeholder}
          </div>
        )}
      </Droppable> */}
      {cardItems}
    </div>
  );
}

export default CardContainer;