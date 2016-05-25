'use strict';

import { handleActions } from 'redux-actions';
import {
    LOAD_PAGE_DATA,
    UPDATE_CHART_SELECTION,
    SHOW_INSTALL_TRACKING_INSTRUCTIONS,
    SHOW_AD_PREVIEW
} from '../../../../actions/campaign_detail';

import {
    CHART_TODAY,
    SERIES_VIEWS
} from '../../../../components/CampaignDetailChart';

import { assign } from 'lodash';

const INITIAL_STATE = {
    loading                         : true,
    showInstallTrackingInstructions : false,
    showAdPreview                   : false,
    activeChart                     : CHART_TODAY,
    activeSeries                    : SERIES_VIEWS
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
    }),

    [SHOW_INSTALL_TRACKING_INSTRUCTIONS]: (state, { payload: show }) => assign({}, state, {
        showInstallTrackingInstructions: show
    }),

    [SHOW_AD_PREVIEW]: (state, { payload: show }) => assign({}, state, {
        showAdPreview: show
    })
}, INITIAL_STATE);

