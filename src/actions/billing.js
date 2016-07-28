import payment, { paymentMethod } from './payment';
import { createAction } from 'redux-actions';
import _, { find } from 'lodash';
import { createThunk } from '../middleware/fsa_thunk';
import { getBillingPeriod, getPaymentPlan } from './session';
import orgs, {
    changePaymentPlan as changeOrgPaymentPlan,
} from './org';
import {
    getPaymentPlans,
} from './system';
import { notify } from './notification';
import * as NOTIFICATION from '../enums/notification';
import moment from 'moment';

function prefix(type) {
    return `BILLING/${type}`;
}

export const GET_PAYMENTS = prefix('GET_PAYMENTS');
export const getPayments = createThunk(() => (
    function thunk(dispatch) {
        return dispatch(createAction(GET_PAYMENTS)(dispatch(payment.list())));
    }
));

export const GET_PAYMENT_METHODS = prefix('GET_PAYMENT_METHODS');
export const getPaymentMethods = createThunk(() => (
    function thunk(dispatch) {
        return dispatch(createAction(GET_PAYMENT_METHODS)(dispatch(paymentMethod.list())));
    }
));

export const LOAD_PAGE_DATA = prefix('LOAD_PAGE_DATA');
export const loadPageData = createThunk(() => (
    function thunk(dispatch) {
        return dispatch(createAction(LOAD_PAGE_DATA)(Promise.all([
            dispatch(getPayments()),
            dispatch(getPaymentMethods()),
            dispatch(getBillingPeriod()),
            dispatch(getPaymentPlan()),
        ])));
    }
));

export const SHOW_CHANGE_MODAL = prefix('SHOW_CHANGE_MODAL');
export const showChangeModal = createAction(SHOW_CHANGE_MODAL);

export const CHANGE_PAYMENT_METHOD = prefix('CHANGE_PAYMENT_METHOD');
export const changePaymentMethod = createThunk(({ cardholderName, nonce }) => (
    function thunk(dispatch, getState) {
        const oldMethod = find(getState().db.paymentMethod, { default: true });

        return dispatch(createAction(CHANGE_PAYMENT_METHOD)(
            dispatch(paymentMethod.create({ data: {
                cardholderName,
                paymentMethodNonce: nonce,
                makeDefault: true,
            } })).then(() => dispatch(paymentMethod.remove({ id: oldMethod.token })))
                .then(() => dispatch(paymentMethod.list()))
                .then(() => dispatch(showChangeModal(false)))
        )).catch(({ reason }) => Promise.reject(new Error(reason.response)));
    }
));

export const CHANGE_PAYMENT_PLAN = prefix('CHANGE_PAYMENT_PLAN');
export const changePaymentPlan = createThunk(paymentPlanId => (dispatch, getState) => dispatch(
    createAction(CHANGE_PAYMENT_PLAN)(Promise.resolve().then(() => {
        const state = getState();
        const user = state.db.user[state.session.user];
        const orgId = user.org;

        return dispatch(changeOrgPaymentPlan({
            orgId,
            paymentPlanId,
        }))
        .then(() => dispatch(orgs.get({ id: orgId })))
        .catch(reason => {
            dispatch(notify({
                type: NOTIFICATION.TYPE.DANGER,
                message: `Unexpected error changing subscription: ${
                    reason.response || reason.message
                }`,
                time: 10000,
            }));
        })
        .then(() => undefined);
    }))
).then(({ value }) => value));

export const CANCEL_SUBSCRIPTION = prefix('CANCEL_SUBSCRIPTION');
export const cancelSubscription = createThunk(() => (dispatch, getState) => dispatch(
    createAction(CANCEL_SUBSCRIPTION)(Promise.resolve().then(() => {
        const user = getState().db.user[getState().session.user];

        return dispatch(getPaymentPlans()).then(ids => {
            const canceled = _(ids).map(id => getState().db.paymentPlan[id])
                .find(plan => plan.price === 0);

            return dispatch(changeOrgPaymentPlan({
                orgId: user.org,
                paymentPlanId: canceled.id,
            }));
        })
        .then(({ effectiveDate }) => {
            dispatch(notify({
                type: NOTIFICATION.TYPE.SUCCESS,
                message: 'Your subscription will be suspended at the end of current billing ' +
                    `period (${moment(effectiveDate).format('MMM D')}).`,
                time: 10000,
            }));
        })
        .catch(reason => {
            dispatch(notify({
                type: NOTIFICATION.TYPE.DANGER,
                message: `Unexpected error canceling subscription: ${
                    reason.response || reason.message
                }`,
                time: 10000,
            }));
        })
        .then(() => undefined);
    }))
).then(({ value }) => value));
