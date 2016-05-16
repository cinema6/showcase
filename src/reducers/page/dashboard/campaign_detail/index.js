'use strict';

import { handleActions } from 'redux-actions';
import {
    LOAD_PAGE_DATA,
    UPDATE_CHART_SELECTION
} from '../../../../actions/campaign_detail';

import {
    CHART_TODAY,
    SERIES_USERS
} from '../../../../components/CampaignDetailChart';

import { assign } from 'lodash';

const INITIAL_STATE = {
    loading         : true,
    activeChart     : CHART_TODAY,
    activeSeries    : SERIES_USERS
};

export default handleActions({
    [UPDATE_CHART_SELECTION] : (state,action) => assign({}, state, action.payload),

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

