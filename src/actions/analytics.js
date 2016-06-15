import { callAPI } from './api';
import { createThunk } from '../middleware/fsa_thunk';

function prefix(type) {
    return `ANALYTICS/${type}`;
}

export const GET_CAMPAIGN_ANALYTICS_START = prefix('GET_CAMPAIGN_ANALYTICS_START');
export const GET_CAMPAIGN_ANALYTICS_SUCCESS = prefix('GET_CAMPAIGN_ANALYTICS_SUCCESS');
export const GET_CAMPAIGN_ANALYTICS_FAILURE = prefix('GET_CAMPAIGN_ANALYTICS_FAILURE');

export const getCampaignAnalytics = createThunk(campaignId => (
    function thunk(dispatch) {
        return dispatch(callAPI({
            types: [
                GET_CAMPAIGN_ANALYTICS_START,
                GET_CAMPAIGN_ANALYTICS_SUCCESS,
                GET_CAMPAIGN_ANALYTICS_FAILURE,
            ],
            credentials: 'same-origin',
            endpoint: `/api/analytics/campaigns/showcase/apps/${campaignId}`,
        }));
    }
));
