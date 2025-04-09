import React, { useState } from "react";
import "./Card.css"

function Card({name, color, cmc, imageUrl, cNum}) {
    const [count, setCount] = useState(0);

    function handleClick() {
    // 
    }

    return (
        <img 
            className="card"
            key={cNum}
            src={imageUrl}
            onClick={handleClick}
        />

    )
}

export default Card;