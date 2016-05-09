'use strict';

import { createAction } from 'redux-actions';
import { callAPI } from './api';
import campaign from './campaign';

function prefix(type) {
    return `CAMPAIGN_DETAIL/${type}`;
}

export const GET_CAMPAIGN_ANALYTICS_START   = prefix('GET_CAMPAIGN_ANALYTICS_START');
export const GET_CAMPAIGN_ANALYTICS_SUCCESS = prefix('GET_CAMPAIGN_ANALYTICS_SUCCESS');
export const GET_CAMPAIGN_ANALYTICS_FAILURE = prefix('GET_CAMPAIGN_ANALYTICS_FAILURE');

export function getCampaignAnalytics(campaignId) {
    return function thunk(dispatch) {
        return dispatch(callAPI({ 
            types: [
                GET_CAMPAIGN_ANALYTICS_START,
                GET_CAMPAIGN_ANALYTICS_SUCCESS,
                GET_CAMPAIGN_ANALYTICS_FAILURE
            ],
            credentials: 'same-origin',
            endpoint: `/api/analytics/campaigns?ids=${campaignId}`
        }));
    };
}

export const LOAD_PAGE_DATA = prefix('LOAD_PAGE_DATA');
export function loadPageData(campaignId) {
    return function thunk(dispatch) {
        return dispatch(createAction(LOAD_PAGE_DATA)(
                Promise.all([
                    dispatch(campaign.get({ id : campaignId })),
                    dispatch(getCampaignAnalytics(campaignId)).catch(function(){ })
                ])
        ));
    };
}
