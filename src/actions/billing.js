'use strict';

import payment, { paymentMethod } from './payment';
import { createAction } from 'redux-actions';
import { find } from 'lodash';
import { createThunk } from '../middleware/fsa_thunk';

function prefix(type) {
    return `BILLING/${type}`;
}

export const GET_PAYMENTS = prefix('GET_PAYMENTS');
export const getPayments = createThunk(() => {
    return function thunk(dispatch) {
        return dispatch(createAction(GET_PAYMENTS)(dispatch(payment.list())));
    };
});

export const GET_PAYMENT_METHODS = prefix('GET_PAYMENT_METHODS');
export const getPaymentMethods = createThunk(() => {
    return function thunk(dispatch) {
        return dispatch(createAction(GET_PAYMENT_METHODS)(dispatch(paymentMethod.list())));
    };
});

export const LOAD_PAGE_DATA = prefix('LOAD_PAGE_DATA');
export const loadPageData = createThunk(() => {
    return function thunk(dispatch) {
        return dispatch(createAction(LOAD_PAGE_DATA)(Promise.all([
            dispatch(getPayments()),
            dispatch(getPaymentMethods())
        ])));
    };
});

export const SHOW_CHANGE_MODAL = prefix('SHOW_CHANGE_MODAL');
export const showChangeModal = createAction(SHOW_CHANGE_MODAL);

export const CHANGE_PAYMENT_METHOD = prefix('CHANGE_PAYMENT_METHOD');
export const changePaymentMethod = createThunk(({ cardholderName, nonce }) => {
    return function thunk(dispatch, getState) {
        const oldMethod = find(getState().db.paymentMethod, { default: true });

        return dispatch(createAction(CHANGE_PAYMENT_METHOD)(
            dispatch(paymentMethod.create({ data: {
                cardholderName,
                paymentMethodNonce: nonce,
                makeDefault: true
            } })).then(() => dispatch(paymentMethod.remove({ id: oldMethod.token })))
                .then(() => dispatch(paymentMethod.list()))
                .then(() => dispatch(showChangeModal(false)))
        )).catch(({ reason }) => Promise.reject(new Error(reason.response)));

    };
});
