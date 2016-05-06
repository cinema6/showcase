'use strict';

import { getProductData } from './collateral';
import { createAction } from 'redux-actions';

function prefix(type) {
    return `PRODUCT_WIZARD/${type}`;
}

export const PRODUCT_SELECTED = prefix('PRODUCT_SELECTED');
export function productSelected({ product }) {
    return function thunk(dispatch) {
        return dispatch(createAction(PRODUCT_SELECTED)(
            dispatch(getProductData({ uri: product.uri }))
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    };
}

export const PRODUCT_EDITED = prefix('PRODUCT_EDITED');
export const productEdited = createAction(PRODUCT_EDITED, ({ data }) => data);

export const TARGETING_EDITED = prefix('TARGETING_EDITED');
export const targetingEdited = createAction(TARGETING_EDITED, ({ data }) => data);

export const GO_TO_STEP = prefix('GO_TO_STEP');
export const goToStep = createAction(GO_TO_STEP);

export const WIZARD_DESTROYED = prefix('WIZARD_DESTROYED');
export const wizardDestroyed = createAction(WIZARD_DESTROYED);
