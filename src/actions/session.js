'use strict';

import { createAction } from 'redux-actions';
import campaign from './campaign';
import { createThunk } from '../middleware/fsa_thunk';
import orgs from './org';
import promotions from './promotion';
import { map } from 'lodash';

function prefix(type) {
    return `SESSION/${type}`;
}

export const GET_CAMPAIGNS = prefix('GET_CAMPAIGNS');
export const getCampaigns = createThunk(() => {
    return function thunk(dispatch, getState) {
        return dispatch(createAction(GET_CAMPAIGNS)(
            Promise.resolve().then(() => {
                return getState().session.campaigns || dispatch(campaign.list());
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    };
});

export const GET_ORG = prefix('GET_ORG');
export const getOrg = createThunk(() => (dispatch, getState) => dispatch(createAction(GET_ORG)(
    Promise.resolve().then(() => {
        const state = getState();
        const user = state.db.user[state.session.user];
        const org  = state.db.org[user.org];

        return (org && [org.id]) || dispatch(orgs.get({ id: user.org }));
    })
)).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason)));

export const GET_PROMOTIONS = prefix('GET_PROMOTIONS');
export const getPromotions = createThunk(() => (dispatch, getState) => {
    return dispatch(createAction(GET_PROMOTIONS)(Promise.resolve().then(() => {
        const state = getState();

        return state.session.promotions || (dispatch(getOrg())
            .then(([id]) => {
                const org = getState().db.org[id];

                if ((org.promotions || []).length < 1) {
                    return [];
                }

                return dispatch(promotions.query({
                    ids: map(org.promotions, 'id').join(',')
                }));
            }));
    }))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
});
