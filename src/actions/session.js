import { createAction } from 'redux-actions';
import campaign from './campaign';
import { createThunk } from '../middleware/fsa_thunk';
import orgs from './org';
import promotions from './promotion';
import { getCurrentPayment } from './transaction';

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
        getState().session.billingPeriod || dispatch(getCurrentPayment()).catch(reason => {
            if (reason.status === 404) {
                return null;
            }

            throw reason;
        })
    )))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));
