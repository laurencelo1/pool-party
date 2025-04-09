import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./Card.css"

function Card({id, index, name, color, cmc, imageUrl, cNum, codeSet}) {
    console.log("Card ID:", id, "Index:", index);


    function handleClick() {
    // 
    }

    return (
        // <Draggable draggableId={String(id)} index={index}>
        //     {(provided, snapshot) => (
        //         <div
        //             ref={provided.innerRef}
        //             {...provided.draggableProps}
        //             {...provided.dragHandleProps}
        //             // className={`card ${snapshot.isDragging ? 'is-dragging' : ''}`}
        //             className="card"
        //         >
        //             <img 
        //                 className="card"
        //                 src={imageUrl}
        //                 onClick={handleClick}
        //                 alt={name}
        //             />
        //         <h4>{name}</h4>
        //         </div>
        //     )}
        // </Draggable>
        <img 
            className="card"
            src={imageUrl}
            onClick={handleClick}
            alt={name}
        />
    )
}

export default Card;