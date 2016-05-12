'use strict';

import { createAction } from 'redux-actions';
import campaign from './campaign';
import { getCampaignAnalytics } from './analytics';

function prefix(type) {
    return `CAMPAIGN_DETAIL/${type}`;
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
