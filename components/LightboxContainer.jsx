import React, { useReducer } from 'react';
import LightboxContext from './LightboxContext';
import Lightbox, { reducer as lbr, init as lbi } from './Lightbox';

export default ({ children }) => {
    const [lightboxState, lightboxAction] = useReducer(lbr, [], lbi);

    return (
        <>
            <LightboxContext.Provider value={lightboxAction}>{children}</LightboxContext.Provider>
            <Lightbox state={lightboxState} action={lightboxAction} />
        </>
    );
};
