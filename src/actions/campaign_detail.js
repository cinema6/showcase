'use strict';

import { createAction } from 'redux-actions';
import campaign from './campaign';
import { getCampaignAnalytics } from './analytics';
import { showAlert } from './alert';
import { cancel as cancelCampaign } from './campaign';
import { replace } from 'react-router-redux';
import { notify } from './notification';
import { TYPE as NOTIFICATION } from '../enums/notification';

function prefix(type) {
    return `CAMPAIGN_DETAIL/${type}`;
}

export const UPDATE_CHART_SELECTION = prefix('UPDATE_CHART_SELECTION');
export const updateChartSelection = createAction(UPDATE_CHART_SELECTION, 
    (activeChart, activeSeries) => { return { activeChart, activeSeries }; });

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

export function removeCampaign(campaignId) {
    return function thunk(dispatch) {
        return dispatch(showAlert({
            title: 'Woah There!',
            description: 'Are you sure you want to delete your campaign? This cannot be un-done.',
            buttons: [
                {
                    text: 'Keep',
                    onSelect: dismiss => dismiss()
                },
                {
                    text: 'Delete',
                    type: 'danger',
                    onSelect: dismiss => dispatch(cancelCampaign(campaignId)).then(() => {
                        dismiss();
                        dispatch(replace('/dashboard'));
                        dispatch(notify({
                            type: NOTIFICATION.SUCCESS,
                            message: 'Your app has been deleted.'
                        }));
                    }).catch(reason => {
                        dispatch(notify({
                            type: NOTIFICATION.DANGER,
                            message: `Failed to delete: ${reason.response || reason.message}`,
                            time: 10000
                        }));
                    })
                }
            ]
        }));
    };
}
