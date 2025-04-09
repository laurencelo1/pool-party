import React from "react";
import "./Card.css"

function Card({name, color, cmc, imageUrl, cNum}) {
    return (
        <img 
            className="card"
            key={cNum}
            src={imageUrl}
        />

    )
}

export default Card;