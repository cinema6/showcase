'use strict';

import { callAPI } from './api';
import {
    format as formatURL
} from 'url';

function prefix(type) {
    return `COLLATERAL/${type}`;
}

export const GET_PRODUCT_DATA_START = prefix('GET_PRODUCT_DATA_START');
export const GET_PRODUCT_DATA_SUCCESS = prefix('GET_PRODUCT_DATA_SUCCESS');
export const GET_PRODUCT_DATA_FAILURE = prefix('GET_PRODUCT_DATA_FAILURE');
export function getProductData({ uri }) {
    return function thunk(dispatch) {
        return dispatch(callAPI({
            types: [GET_PRODUCT_DATA_START, GET_PRODUCT_DATA_SUCCESS, GET_PRODUCT_DATA_FAILURE],
            endpoint: formatURL({
                pathname: '/api/collateral/product-data',
                query: { uri }
            }),
            method: 'GET'
        }));
    };
}
