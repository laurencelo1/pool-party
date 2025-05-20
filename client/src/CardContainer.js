import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import './CardContainer.css';

function CardContainer({ id, header, cards, showColorSeparation = false }) {
    // Function to organize cards by color category
    const organizeByColor = cardList => {
        const colorCategories = {
            white: [],
            blue: [],
            black: [],
            red: [],
            green: [],
            multicolor: [],
            colorless: [],
        };

        cardList.forEach((card, index) => {
            const colorArray = card.color || [];

            // Determine card color category
            let category = 'colorless';
            if (colorArray.length > 1) {
                category = 'colorless';
            } else if (colorArray.length === 1) {
                // Map single color to category
                const colorMap = {
                    W: 'white',
                    U: 'blue',
                    B: 'black',
                    R: 'red',
                    G: 'green',
                };
                category = colorMap[colorArray[0]] || 'colorless';
            }

            colorCategories[category].push({
                card,
                index,
            });
        });

        return colorCategories;
    };

    // Function to render a card with the proper index
    const renderCard = (card, index) => (
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
    );

    // Function to render a color category section
    const renderColorSection = (categoryName, cardIndexPairs, startIndex) => {
        if (cardIndexPairs.length === 0) return null;

        const colorDisplayNames = {
            white: 'White',
            blue: 'Blue',
            black: 'Black',
            red: 'Red',
            green: 'Green',
            multicolor: 'Multicolor',
            colorless: 'Colorless/Multicolor',
        };

        return (
            <div className="color-section" key={categoryName}>
                <h4>
                    {colorDisplayNames[categoryName]} ({cardIndexPairs.length})
                </h4>
                <div className="color-cards">
                    {cardIndexPairs.map(({ card }, catIndex) =>
                        renderCard(card, startIndex + catIndex)
                    )}
                </div>
            </div>
        );
    };

    // If color separation is enabled, display cards by color categories
    if (showColorSeparation) {
        const colorCategories = organizeByColor(cards);

        // Calculate starting index for each category to maintain proper indexing for drag and drop
        let startIndex = 0;
        const colorSections = [];

        const categoryOrder = ['white', 'blue', 'black', 'red', 'green', 'multicolor', 'colorless'];

        categoryOrder.forEach(category => {
            if (colorCategories[category].length > 0) {
                colorSections.push(
                    renderColorSection(category, colorCategories[category], startIndex)
                );
                startIndex += colorCategories[category].length;
            }
        });

        return (
            <div className={`card-container-wrapper ${id}`}>
                <h3>
                    {header} ({cards.length})
                </h3>
                <Droppable droppableId={id}>
                    {provided => (
                        <div
                            className="card-container color-separated"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {colorSections}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    }

    // Default display (no color separation)
    const cardItems = cards.map((card, index) => renderCard(card, index));

    return (
        <div className={`card-container-wrapper ${id}`}>
            <h3>
                {header} ({cards.length})
            </h3>
            <Droppable droppableId={id}>
                {provided => (
                    <div
                        className="card-container"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {cardItems}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

export default CardContainer;
