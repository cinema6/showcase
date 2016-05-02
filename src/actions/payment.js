'use strict';

import { callAPI } from './api';

function prefix(type) {
    return `PAYMENT/${type}`;
}

import { createDbActions } from '../utils/db';

export default createDbActions({
    type: 'payment',
    endpoint: '/api/payments'
});

export const paymentMethod = createDbActions({
    type: 'paymentMethod',
    endpoint: '/api/payments/methods',
    key: 'token'
});

export const GET_CLIENT_TOKEN_START = prefix('GET_CLIENT_TOKEN_START');
export const GET_CLIENT_TOKEN_SUCCESS = prefix('GET_CLIENT_TOKEN_SUCCESS');
export const GET_CLIENT_TOKEN_FAILURE = prefix('GET_CLIENT_TOKEN_FAILURE');
export function getClientToken() {
    return callAPI({
        types: [GET_CLIENT_TOKEN_START, GET_CLIENT_TOKEN_SUCCESS, GET_CLIENT_TOKEN_FAILURE],
        endpoint: '/api/payments/clientToken'
    });
}
