'use strict';

import { handleActions } from 'redux-actions';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS,
    LOGOUT_SUCCESS
} from '../actions/auth';
import payment, { paymentMethod } from '../actions/payment';
import { assign } from 'lodash';

const DEFAULT_STATE = {
    user: null,

    payments: [],
    paymentMethods: []
};

function addUserToSession(state, { payload: user }) {
    return assign({}, state, {
        user: user.id
    });
}

export default handleActions({
    [LOGIN_SUCCESS]: addUserToSession,
    [STATUS_CHECK_SUCCESS]: addUserToSession,

    [payment.list.SUCCESS]: (state, { payload: payments }) => assign({}, state, {
        payments
    }),
    [payment.create.SUCCESS]: (state, { payload: payments }) => assign({}, state, {
        payments: state.payments.concat(payments)
    }),
    [payment.remove.SUCCESS]: (state, { payload: [payment] }) => assign({}, state, {
        payments: state.payments.filter(id => id !== payment)
    }),

    [paymentMethod.list.SUCCESS]: (state, { payload: paymentMethods }) => assign({}, state, {
        paymentMethods
    }),
    [paymentMethod.create.SUCCESS]: (state, { payload: paymentMethods }) => assign({}, state, {
        paymentMethods: state.paymentMethods.concat(paymentMethods)
    }),
    [paymentMethod.remove.SUCCESS]: (state, { payload: [paymentMethod] }) => assign({}, state, {
        paymentMethods: state.paymentMethods.filter(id => id !== paymentMethod)
    }),

    [LOGOUT_SUCCESS]: state => assign({}, state, {
        user: null
    })
}, DEFAULT_STATE);
