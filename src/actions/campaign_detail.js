import { createAction } from 'redux-actions';
import { getCampaignAnalytics } from './analytics';
import { showAlert } from './alert';
import campaign, { cancel as cancelCampaign } from './campaign';
import { replace } from 'react-router-redux';
import { notify } from './notification';
import { TYPE as NOTIFICATION } from '../enums/notification';
import { createThunk } from '../middleware/fsa_thunk';

function prefix(type) {
    return `CAMPAIGN_DETAIL/${type}`;
}

export const UPDATE_CHART_SELECTION = prefix('UPDATE_CHART_SELECTION');
export const updateChartSelection = createAction(UPDATE_CHART_SELECTION,
    (activeChart, activeSeries) => ({ activeChart, activeSeries }));

export const LOAD_PAGE_DATA = prefix('LOAD_PAGE_DATA');
export const loadPageData = createThunk(campaignId => (
    function thunk(dispatch, getState) {
        return dispatch(createAction(LOAD_PAGE_DATA)(
            Promise.all([
                dispatch(campaign.get({ id: campaignId })).catch(reason => {
                    const cachedCampaign = getState().db.campaign[campaignId];

                    // If the campaign can't be fetched but there is some cached data, return the
                    // cached data.
                    if (cachedCampaign) {
                        return cachedCampaign;
                    }

                    // If there is no cached campaign, bounce the user back to the dashboard and
                    // display an error message.
                    dispatch(notify({
                        type: NOTIFICATION.DANGER,
                        message: `Failed to fetch campaign: ${reason.response || reason.message}`,
                        time: 10000,
                    }));
                    dispatch(replace('/dashboard'));

                    throw reason;
                }),
                dispatch(getCampaignAnalytics(campaignId)).catch(reason => {
                    // Show a warning if the analytics can't be fetched, but don't fail.
                    dispatch(notify({
                        type: NOTIFICATION.WARNING,
                        message: `Couldn't fetch analytics: ${reason.response || reason.message}`,
                        time: 10000,
                    }));

                    return null;
                }),
            ])
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    }
));

export const removeCampaign = createThunk(campaignId => (
    function thunk(dispatch) {
        return dispatch(showAlert({
            title: 'Woah There!',
            description: 'Are you sure you want to replace this app? Doing this '
            + 'will erase all your stats and stop current ads. This cannot be un-done.',
            buttons: [
                {
                    text: 'Keep',
                    onSelect: dismiss => dismiss(),
                },
                {
                    text: 'Delete',
                    type: 'danger',
                    onSelect: dismiss => dispatch(cancelCampaign(campaignId)).then(() => {
                        dismiss();
                        dispatch(replace('/dashboard'));
                        dispatch(notify({
                            type: NOTIFICATION.SUCCESS,
                            message: 'Your app has been deleted.',
                        }));
                    }).catch(reason => {
                        dispatch(notify({
                            type: NOTIFICATION.DANGER,
                            message: `Failed to delete: ${reason.response || reason.message}`,
                            time: 10000,
                        }));
                    }),
                },
            ],
        }));
    }
));

export const SHOW_INSTALL_TRACKING_INSTRUCTIONS = prefix('SHOW_INSTALL_TRACKING_INSTRUCTIONS');
export const showInstallTrackingInstructions = createAction(SHOW_INSTALL_TRACKING_INSTRUCTIONS);

export const SHOW_AD_PREVIEW = prefix('SHOW_AD_PREVIEW');
export const showAdPreview = createAction(SHOW_AD_PREVIEW);
