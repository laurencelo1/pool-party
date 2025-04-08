import React from "react";
import "./Card.css"

function Card({name, color, cmc, imageUrl}) {
    return (
        <img 
            className="card"
            src={imageUrl}
            draggable="true"
        />

    )
}

export default Card;