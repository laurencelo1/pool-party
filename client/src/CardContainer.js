import React from 'react';
import Card from './Card'
import "./CardContainer.css"

function MainBoard({header}) {
    return (
        <div className="main-board">
            <h3>{header}</h3>
            <div className="card-container">
                <Card
                    name = {sire.name}
                    color = {sire.color}
                    cmc = {sire.cmc}
                    imageUrl= {sire.localImage}
                />
            </div>
        </div>
    );
}

const sire = {
    "name": "Sire of Seven Deaths",
    "GIH_WR": 63.7,
    "small_img": "https://cards.scryfall.io/small/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
    "normal_img": "https://cards.scryfall.io/normal/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
    "full_img": "https://cards.scryfall.io/png/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.png?1730657490",
    "large_img": "https://cards.scryfall.io/large/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
    "mana_cost": "{7}",
    "cmc": 7,
    "rarity": "mythic",
    "prices": {
      "usd": "20.88",
      "usd_foil": "27.77",
      "usd_etched": null,
      "eur": "15.99",
      "eur_foil": "16.52",
      "tix": null
    },
    "color": [],
    "color_identity": [],
    "type_line": "Creature — Eldrazi",
    "collection_number": "1",
    "set_name": "FDN",
    "localImage": "https://cards.scryfall.io/png/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.png?1730657490"
  }

export default MainBoard
