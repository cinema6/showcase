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

                /*
            * paymentPlanStart: This is the date on which the user will be charged for the first
            * time. During the user's free trial, it will be some date in the future.
            *
            * nextPaymentDate: This is the date when the user will be charged next. During the free
            * trial period, it will be the same as the paymentPlanStart. Each time the user is
            * successfully charged, this date will be incremented by one month.
            */

            // Can't figure out the billing period if the paymentPlanStart is unknown.
            if (!paymentPlanStart) { return null; }

            // The user's free trial has expired, their paymentPlanStart is sometime in the past,
            // or today:
            if (paymentPlanStart.isSameOrBefore(now, 'day')) {
                // The nextPaymentDate is today, or sometime in the past (meaning the user has
                // become delinquent on their payments.) The system (watchman) will try and bill
                // the user today, but it has not done so yet, otherwise the nextPaymentDate would
                // have been advanced by one month.
                if (nextPaymentDate.isSameOrBefore(now, 'day')) {
                    // Optimistically show the user that their billing cycle has started fresh
                    // today (the nextPaymentDate) and calculate the end of the billing cycle by
                    // advancing that date by a month.
                    return {
                        start: nextPaymentDate.format(),
                        end: moment(nextPaymentDate)
                            .add(1, 'month')
                            .subtract(1, 'day')
                            .format(),
                    };
                }

                // The nextPaymentDate is sometime in the future. The end of the billing cycle is
                // the day before the nextPaymentDate. Because there is no lastPaymentDate, the
                // start of the billing cycle is calculated by subtracting one month from the
                // nextPaymentDate.
                return {
                    start: moment(nextPaymentDate).subtract(1, 'month').format(),
                    end: moment(nextPaymentDate).subtract(1, 'day').format(),
                };
            }

            // The paymentPlanStart is sometime in the future, the user is still in their free tiral
            // period.
            return dispatch(campaign.query({
                org: org.id,
                sort: 'created,1',
                limit: 1,
            })).then(([campaignID]) => {
                // The free trial started on the day the user created their first campaign, so that
                // date is used as the start of the billing cycle.
                // The free trial ends the day before the paymentPlanStart, so that date is used as
                // the end of the billing cycle.
                const oldestCampaign = getState().db.campaign[campaignID];

                return {
                    start: oldestCampaign.created,
                    end: moment(paymentPlanStart).subtract(1, 'day').format(),
                };
            });
        })
    )))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));
