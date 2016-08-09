import { createThunk } from '../middleware/fsa_thunk';
import { createAction } from 'redux-actions';
import campaigns, {
    cancel as cancelCampaign,
} from './campaign';
import { getCampaignAnalytics } from './analytics';
import { showAlert } from './alert';
import * as NOTIFICATION from '../enums/notification';
import { notify } from './notification';

function prefix(type) {
    return `CAMPAIGN_LIST/${type}`;
}

export const LOAD_PAGE_DATA = prefix('LOAD_PAGE_DATA');
export const loadPageData = createThunk(() => dispatch => dispatch(createAction(LOAD_PAGE_DATA)(
    Promise.resolve().then(() => (
        dispatch(campaigns.list()).then(camps => (
            Promise.all(camps.map(campaign => dispatch(getCampaignAnalytics(campaign.id))))
        ))
    )).then(() => undefined)
)).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason)));

export const ARCHIVE_CAMPAIGN = prefix('ARCHIVE_CAMPAIGN');
export const archiveCampaign = createThunk(campaign => dispatch => dispatch(
    createAction(ARCHIVE_CAMPAIGN)(Promise.resolve().then(() => {
        dispatch(showAlert({
            title: `Archive "${campaign.product.name}"?`,
            description: 'Are you sure you want to archive this app?',
            buttons: [
                {
                    text: 'Keep',
                    onSelect: dismiss => dismiss(),
                },
                {
                    text: 'Archive',
                    type: 'danger',
                    onSelect: dismiss => (
                        dispatch(cancelCampaign(campaign.id)).then(() => {
                            dismiss();

                            dispatch(notify({
                                type: NOTIFICATION.TYPE.SUCCESS,
                                message: `Moved "${campaign.product.name}" to the archive.`,
                            }));
                        })
                        .catch(reason => {
                            dispatch(notify({
                                type: NOTIFICATION.TYPE.DANGER,
                                message: `Failed to archive: ${reason.response || reason.message}`,
                                time: 10000,
                            }));
                        })
                    ),
                },
            ],
        }));
    }))
));
