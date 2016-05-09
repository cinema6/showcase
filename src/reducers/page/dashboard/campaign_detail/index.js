'use strict';

import { handleActions } from 'redux-actions';
import {
    LOAD_PAGE_DATA,
    GET_CAMPAIGN_ANALYTICS_START,
    GET_CAMPAIGN_ANALYTICS_SUCCESS,
    GET_CAMPAIGN_ANALYTICS_FAILURE 
} from '../../../../actions/campaign_detail';
import { assign } from 'lodash';

const INITIAL_STATE = {
    loading         : true,
    analyticsError  : null,
    analytics       : null
};

export default handleActions({
    [`${GET_CAMPAIGN_ANALYTICS_FAILURE}`]: (state,action) => assign({}, state, {
        analyticsError: action.payload
    }),

    [`${GET_CAMPAIGN_ANALYTICS_SUCCESS}`]: (state,action) => assign({}, state, {
        analytics : action.payload
    }),

    [`${LOAD_PAGE_DATA}_PENDING`]: state => assign({}, state, {
        loading: true
    }),
    [`${LOAD_PAGE_DATA}_FULFILLED`]: state => assign({}, state, {
        loading: false
    }),
    [`${LOAD_PAGE_DATA}_REJECTED`]: state => assign({}, state, {
        loading: false
    })
}, INITIAL_STATE);

