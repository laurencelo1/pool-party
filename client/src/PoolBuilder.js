import React from 'react';
import CardContainer from './CardContainer';

function PoolBuilder({ sideboard, mainboard }) {
    return (
        <>
            <CardContainer
                id="sideboard"
                header="Sideboard"
                cards={sideboard}
                showColorSeparation={true}
            />
            <CardContainer
                id="mainboard"
                header="Mainboard"
                cards={mainboard}
            />
        </>
    )
}

export default PoolBuilder;