import { callAPI } from './api';

function prefix(type) {
    return `TRANSACTION/${type}`;
}

export const GET_CURRENT_PAYMENT_START = prefix('GET_CURRENT_PAYMENT_START');
export const GET_CURRENT_PAYMENT_SUCCESS = prefix('GET_CURRENT_PAYMENT_SUCCESS');
export const GET_CURRENT_PAYMENT_FAILURE = prefix('GET_CURRENT_PAYMENT_FAILURE');
export function getCurrentPayment() {
    return callAPI({
        method: 'GET',
        types: [
            GET_CURRENT_PAYMENT_START,
            GET_CURRENT_PAYMENT_SUCCESS,
            GET_CURRENT_PAYMENT_FAILURE,
        ],
        endpoint: '/api/transactions/showcase/current-payment',
    });
}
