import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./Card.css"

const Card = React.memo(function Card({ id, index, name, color, cmc, imageUrl, cNum }) {
    // console.log("Card ID:", id, "Index:", index);


    function handleClick() {
    // 
    }

    return (
        <Draggable draggableId={String(id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                >
                    <img 
                        className="card"
                        src={imageUrl}
                        onClick={handleClick}
                        alt={name}
                        loading="lazy"
                    />
                </div>
            )}
        </Draggable>
    );
});

export default Card;