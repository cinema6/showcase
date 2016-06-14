import { handleActions } from 'redux-actions';
import {
    GET_CAMPAIGN_ANALYTICS_START,
    GET_CAMPAIGN_ANALYTICS_SUCCESS,
    GET_CAMPAIGN_ANALYTICS_FAILURE,
} from '../actions/analytics';
import { assign } from 'lodash';

const DEFAULT_STATE = {
    results: {},
    lastError: null,
};

export default handleActions({
    [`${GET_CAMPAIGN_ANALYTICS_START}`]: (state) => assign({}, state, {
        lastError: null,
    }),

    [`${GET_CAMPAIGN_ANALYTICS_FAILURE}`]: (state, action) => assign({}, state, {
        lastError: action.payload,
    }),

    [`${GET_CAMPAIGN_ANALYTICS_SUCCESS}`]: (state, action) => assign({}, state, {
        results: assign({}, state.results, { [action.payload.campaignId]: action.payload }),
    }),
}, DEFAULT_STATE);

