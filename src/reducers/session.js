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
    GET_BILLING_PERIOD,
    GET_PAYMENT_PLAN,
    GET_ORG,
} from '../actions/session';
import {
    CHANGE_PAYMENT_PLAN_SUCCESS,
} from '../actions/org';
import { assign, reject, includes } from 'lodash';

const DEFAULT_STATE = {
    user: null,
    org: null,
    promotions: null,
    payments: [],
    paymentMethods: [],
    campaigns: null,
    paymentPlan: null,

    billingPeriod: null,
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

    [`${GET_BILLING_PERIOD}_FULFILLED`]: (state, { payload: billingPeriod }) => assign({}, state, {
        billingPeriod,
    }),
    [`${GET_PAYMENT_PLAN}_FULFILLED`]: (state, { payload }) => assign({}, state, {
        paymentPlan: (payload || null) && payload[0],
    }),
    [CHANGE_PAYMENT_PLAN_SUCCESS]: (state, { payload: { paymentPlanId } }) => assign({}, state, {
        paymentPlan: paymentPlanId,
    }),
    [`${GET_ORG}_FULFILLED`]: (state, { payload: [orgId] }) => assign({}, state, {
        org: orgId,
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
