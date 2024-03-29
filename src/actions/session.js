import { createAction } from 'redux-actions';
import campaign from './campaign';
import { createThunk } from '../middleware/fsa_thunk';
import orgs, {
    getPaymentPlanStatus as getOrgPaymentPlanStatus,
} from './org';
import promotions from './promotion';
import paymentPlans from './payment_plan';
import { getCurrentPayment } from './transaction';

function prefix(type) {
    return `SESSION/${type}`;
}

export const GET_CAMPAIGNS = prefix('GET_CAMPAIGNS');
export const getCampaigns = createThunk(() => (
    function thunk(dispatch, getState) {
        return dispatch(createAction(GET_CAMPAIGNS)(
            Promise.resolve().then(() => {
                const state = getState();
                const campaignIds = state.session.campaigns;

                return (campaignIds && campaignIds.map(id => state.db.campaign[id])) ||
                    dispatch(campaign.list()).then(campaigns => (
                        campaigns.filter(camp => camp.status !== 'canceled')
                    ));
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    }
));

export const GET_ARCHIVE = prefix('GET_CAMPAIGNS');
export const getArchive = createThunk(() => (
    function thunk(dispatch, getState) {
        return dispatch(createAction(GET_ARCHIVE)(
            Promise.resolve().then(() => {
                const state = getState();
                const campaignIds = state.session.archive;

                return (campaignIds && campaignIds.map(id => state.db.campaign[id])) ||
                    dispatch(campaign.list()).then(campaigns => (
                        campaigns.filter(camp => camp.status === 'canceled')
                    ));
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    }
));

export const GET_ORG = prefix('GET_ORG');
export const getOrg = createThunk(() => (dispatch, getState) => dispatch(createAction(GET_ORG)(
    Promise.resolve().then(() => {
        const state = getState();
        const user = state.db.user[state.session.user];
        const org = state.db.org[user.org];

        return (org && [org]) || dispatch(orgs.get({ id: user.org }));
    })
)).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason)));

export const GET_PROMOTIONS = prefix('GET_PROMOTIONS');
export const getPromotions = createThunk(() => (dispatch, getState) => (
    dispatch(createAction(GET_PROMOTIONS)(Promise.resolve().then(() => {
        const state = getState();
        const user = state.db.user[state.session.user];
        const promotionIds = state.session.promotions;

        return (
            (promotionIds && promotionIds.map(id => state.db.promotion[id])) ||
            (!user.promotion && []) ||
            dispatch(promotions.get({
                id: user.promotion,
            }))
        );
    }))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));

export const GET_BILLING_PERIOD = prefix('GET_BILLING_PERIOD');
export const getBillingPeriod = createThunk(() => (dispatch, getState) => (
    dispatch(createAction(GET_BILLING_PERIOD)(Promise.resolve().then(() => (
        getState().session.billingPeriod || dispatch(getCurrentPayment()).catch(reason => {
            if (reason.status === 404) {
                return null;
            }

            throw reason;
        })
    )))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));

export const GET_PAYMENT_PLAN_STATUS = prefix('GET_PAYMENT_PLAN_STATUS');
export const getPaymentPlanStatus = createThunk(() => (dispatch, getState) => dispatch(
    createAction(GET_PAYMENT_PLAN_STATUS)(Promise.resolve().then(() => {
        const state = getState();
        const user = state.db.user[state.session.user];
        const paymentPlanStatus = state.session.paymentPlanStatus;

        return paymentPlanStatus || dispatch(getOrgPaymentPlanStatus({ orgId: user.org }));
    }))
).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason)));

export const GET_PAYMENT_PLAN = prefix('GET_PAYMENT_PLAN');
export const getPaymentPlan = createThunk(() => (dispatch, getState) => (
    dispatch(createAction(GET_PAYMENT_PLAN)(Promise.resolve().then(() => (
        dispatch(getPaymentPlanStatus()).then(status => {
            const plan = getState().db.paymentPlan[status.paymentPlanId];

            if (!status.paymentPlanId) {
                return null;
            }

            return (plan && [plan]) || dispatch(paymentPlans.get({ id: status.paymentPlanId }));
        })
    )))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));

export const GET_NEXT_PAYMENT_PLAN = prefix('GET_NEXT_PAYMENT_PLAN');
export const getNextPaymentPlan = createThunk(() => (dispatch, getState) => dispatch(
    createAction(GET_NEXT_PAYMENT_PLAN)(Promise.resolve().then(() => (
        dispatch(getPaymentPlanStatus()).then(status => {
            const plan = getState().db.paymentPlan[status.nextPaymentPlanId];

            if (!status.nextPaymentPlanId) {
                return null;
            }

            return (plan && [plan]) || dispatch(paymentPlans.get({ id: status.nextPaymentPlanId }));
        })
    )))
).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason)));
