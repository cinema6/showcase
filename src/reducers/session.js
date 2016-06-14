import { handleActions } from 'redux-actions';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS,
    LOGOUT_SUCCESS,
} from '../actions/auth';
import payment, { paymentMethod } from '../actions/payment';
import campaign, {
    CANCEL as CANCEL_CAMPAIGN,
} from '../actions/campaign';
import {
    GET_PROMOTIONS,
} from '../actions/session';
import { assign, reject, includes } from 'lodash';

const DEFAULT_STATE = {
    user: null,

    promotions: null,

    payments: [],
    paymentMethods: [],

    campaigns: null,
};

function addUserToSession(state, { payload: user }) {
    return assign({}, state, {
        user: user.id,
    });
}

export default handleActions({
    [LOGIN_SUCCESS]: addUserToSession,
    [STATUS_CHECK_SUCCESS]: addUserToSession,

    [`${GET_PROMOTIONS}_FULFILLED`]: (state, { payload: promotions }) => assign({}, state, {
        promotions,
    }),

    [payment.list.SUCCESS]: (state, { payload: payments }) => assign({}, state, {
        payments,
    }),
    [payment.create.SUCCESS]: (state, { payload: payments }) => assign({}, state, {
        payments: state.payments.concat(payments),
    }),
    [payment.remove.SUCCESS]: (state, { payload: payments }) => assign({}, state, {
        payments: reject(state.payments, id => includes(payments, id)),
    }),

    [paymentMethod.list.SUCCESS]: (state, { payload: paymentMethods }) => assign({}, state, {
        paymentMethods,
    }),
    [paymentMethod.create.SUCCESS]: (state, { payload: paymentMethods }) => assign({}, state, {
        paymentMethods: state.paymentMethods.concat(paymentMethods),
    }),
    [paymentMethod.remove.SUCCESS]: (state, { payload: paymentMethods }) => assign({}, state, {
        paymentMethods: reject(state.paymentMethods, id => includes(paymentMethods, id)),
    }),

    [campaign.list.SUCCESS]: (state, { payload: campaigns }) => assign({}, state, {
        campaigns,
    }),
    [campaign.create.SUCCESS]: (state, { payload: campaigns }) => assign({}, state, {
        campaigns: (state.campaigns || []).concat(campaigns),
    }),
    [campaign.remove.SUCCESS]: (state, { payload: campaigns }) => assign({}, state, {
        campaigns: state.campaigns && reject(state.campaigns, id => includes(campaigns, id)),
    }),
    [`${CANCEL_CAMPAIGN}_FULFILLED`]: (state, { payload: [campaignId] }) => assign({}, state, {
        campaigns: state.campaigns && reject(state.campaigns, id => id === campaignId),
    }),

    [LOGOUT_SUCCESS]: () => DEFAULT_STATE,
}, DEFAULT_STATE);
