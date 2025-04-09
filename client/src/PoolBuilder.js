import React from 'react';
import CardContainer from './CardContainer';

function PoolBuilder({ sideboard, mainboard }) {
    return (
        <div>
        <CardContainer
            id="sideboard"
            header="Sideboard"
            cards={sideboard}
        />
        <CardContainer
            id="mainboard"
            header="Mainboard"
            cards={mainboard}
        />
        </div>
    )
}

export default PoolBuilder;