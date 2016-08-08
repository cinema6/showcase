import { handleActions } from 'redux-actions';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS,
    LOGOUT_SUCCESS,
} from '../actions/auth';
import payment, { paymentMethod } from '../actions/payment';
import campaign, {
    CANCEL as CANCEL_CAMPAIGN,
    RESTORE as RESTORE_CAMPAIGN,
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
    archive: null,
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
        promotions: promotions.map(promotion => promotion.id),
    }),

    [`${GET_BILLING_PERIOD}_FULFILLED`]: (state, { payload: billingPeriod }) => assign({}, state, {
        billingPeriod,
    }),
    [`${GET_PAYMENT_PLAN}_FULFILLED`]: (state, { payload }) => assign({}, state, {
        paymentPlan: (payload || null) && payload[0].id,
    }),
    [CHANGE_PAYMENT_PLAN_SUCCESS]: (state, { payload: { paymentPlanId } }) => assign({}, state, {
        paymentPlan: paymentPlanId,
    }),
    [`${GET_ORG}_FULFILLED`]: (state, { payload: [org] }) => assign({}, state, {
        org: org.id,
    }),

    [payment.list.SUCCESS]: (state, { meta: { ids } }) => assign({}, state, {
        payments: ids,
    }),
    [payment.create.SUCCESS]: (state, { meta: { ids } }) => assign({}, state, {
        payments: state.payments.concat(ids),
    }),
    [payment.remove.SUCCESS]: (state, { meta: { ids } }) => assign({}, state, {
        payments: reject(state.payments, id => includes(ids, id)),
    }),

    [paymentMethod.list.SUCCESS]: (state, { meta: { ids } }) => assign({}, state, {
        paymentMethods: ids,
    }),
    [paymentMethod.create.SUCCESS]: (state, { meta: { ids } }) => assign({}, state, {
        paymentMethods: state.paymentMethods.concat(ids),
    }),
    [paymentMethod.remove.SUCCESS]: (state, { meta: { ids } }) => assign({}, state, {
        paymentMethods: reject(state.paymentMethods, id => includes(ids, id)),
    }),

    [campaign.list.SUCCESS]: (state, { payload: campaigns }) => assign({}, state, {
        campaigns: campaigns.filter(camp => camp.status !== 'canceled').map(camp => camp.id),
        archive: campaigns.filter(camp => camp.status === 'canceled').map(camp => camp.id),
    }),
    [campaign.create.SUCCESS]: (state, { meta: { ids } }) => assign({}, state, {
        campaigns: (state.campaigns || []).concat(ids),
    }),
    [campaign.remove.SUCCESS]: (state, { meta: { ids } }) => assign({}, state, {
        campaigns: state.campaigns && reject(state.campaigns, id => includes(ids, id)),
    }),
    [`${CANCEL_CAMPAIGN}_FULFILLED`]: (state, { payload: [camp] }) => assign({}, state, {
        campaigns: state.campaigns && reject(state.campaigns, id => id === camp.id),
        archive: state.archive && state.archive.concat([camp.id]),
    }),
    [`${RESTORE_CAMPAIGN}_FULFILLED`]: (state, { payload: [camp] }) => assign({}, state, {
        campaigns: state.campaigns && state.campaigns.concat([camp.id]),
        archive: state.archive && state.archive.filter(id => id !== camp.id),
    }),

    [LOGOUT_SUCCESS]: () => DEFAULT_STATE,
}, DEFAULT_STATE);
