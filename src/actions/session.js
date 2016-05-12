'use strict';

import { createAction } from 'redux-actions';
import  campaign from './campaign';

function prefix(type) {
    return `SESSION/${type}`;
}

export const GET_CAMPAIGNS = prefix('GET_CAMPAIGNS');
export function getCampaigns() {
    return function thunk(dispatch, getState) {
        return dispatch(createAction(GET_CAMPAIGNS)(
            Promise.resolve().then(() => {
                return getState().session.campaigns || dispatch(campaign.list());
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    };
}
