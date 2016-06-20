import { createAction } from 'redux-actions';
import campaign from './campaign';
import { createThunk } from '../middleware/fsa_thunk';
import orgs from './org';
import promotions from './promotion';
import moment from 'moment';

function prefix(type) {
    return `SESSION/${type}`;
}

export const GET_CAMPAIGNS = prefix('GET_CAMPAIGNS');
export const getCampaigns = createThunk(() => (
    function thunk(dispatch, getState) {
        return dispatch(createAction(GET_CAMPAIGNS)(
            Promise.resolve().then(() => (
                getState().session.campaigns || dispatch(campaign.list())
            ))
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    }
));

export const GET_ORG = prefix('GET_ORG');
export const getOrg = createThunk(() => (dispatch, getState) => dispatch(createAction(GET_ORG)(
    Promise.resolve().then(() => {
        const state = getState();
        const user = state.db.user[state.session.user];
        const org = state.db.org[user.org];

        return (org && [org.id]) || dispatch(orgs.get({ id: user.org }));
    })
)).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason)));

export const GET_PROMOTIONS = prefix('GET_PROMOTIONS');
export const getPromotions = createThunk(() => (dispatch, getState) => (
    dispatch(createAction(GET_PROMOTIONS)(Promise.resolve().then(() => {
        const state = getState();
        const user = state.db.user[state.session.user];

        return state.session.promotions || (!user.promotion && []) || (dispatch(promotions.get({
            id: user.promotion,
        })));
    }))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));

export const GET_BILLING_PERIOD = prefix('GET_BILLING_PERIOD');
export const getBillingPeriod = createThunk(() => (dispatch, getState) => (
    dispatch(createAction(GET_BILLING_PERIOD)(Promise.resolve().then(() => (
        getState().session.billingPeriod || dispatch(getOrg()).then(([orgID]) => {
            const now = moment();
            const org = getState().db.org[orgID];
            const paymentPlanStart = org.paymentPlanStart && moment(org.paymentPlanStart);
            const nextPaymentDate = org.nextPaymentDate && moment(org.nextPaymentDate);

            // Can't figure out the billing period if the paymentPlanStart is unknown.
            if (!paymentPlanStart) { return null; }

            // The user's free trial has ended.
            if (paymentPlanStart.isSameOrBefore(now, 'day')) {
                // If their nextPaymentDate is today, the billing period starts today and ends one
                // month from now.
                if (nextPaymentDate.isSameOrBefore(now, 'day')) {
                    return {
                        start: nextPaymentDate.format(),
                        end: moment(nextPaymentDate)
                            .add(1, 'month')
                            .subtract(1, 'day')
                            .format(),
                    };
                }

                // Otherwise, the billing period ends on the nextPaymentDate, and the start date is
                // calculated by subtracting one month from the nextPaymentDate.
                return {
                    start: moment(nextPaymentDate).subtract(1, 'month').format(),
                    end: moment(nextPaymentDate).subtract(1, 'day').format(),
                };
            }

            // The user is in their free trial. Fetch their oldest campaign.
            return dispatch(campaign.query({
                org: org.id,
                sort: 'created,1',
                limit: 1,
            })).then(([campaignID]) => {
                // Their billing cycle (free trial) started when they created their first campaign,
                // and ends when their trial ends (on their paymentPlanStart date.)
                const oldestCampaign = getState().db.campaign[campaignID];

                return {
                    start: oldestCampaign.created,
                    end: moment(paymentPlanStart).subtract(1, 'day').format(),
                };
            });
        })
    )))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));
