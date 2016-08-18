import { createThunk } from '../middleware/fsa_thunk';
import { createAction } from 'redux-actions';
import campaign, {
    restore,
} from './campaign';
import {
    notify,
} from './notification';
import {
    checkForSlots,
    promptUpgrade,
} from './dashboard';
import * as NOTIFICATION from '../enums/notification';

function prefix(type) {
    return `ARCHIVE/${type}`;
}

export const LOAD_PAGE_DATA = prefix('LOAD_PAGE_DATA');
export const loadPageData = createThunk(() => dispatch => dispatch(createAction(LOAD_PAGE_DATA)(
    Promise.resolve().then(() => Promise.all([
        dispatch(campaign.query({ statuses: 'canceled' })),
    ])).then(() => undefined)
)).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason)));

export const RESTORE_CAMPAIGN = prefix('RESTORE_CAMPAIGN');
export const restoreCampaign = createThunk((
    id,
    redirect = '/dashboard/archive'
) => dispatch => dispatch(
    createAction(RESTORE_CAMPAIGN)(Promise.resolve().then(() => (
        dispatch(checkForSlots()).then(thereAreSlots => {
            if (!thereAreSlots) {
                dispatch(promptUpgrade(redirect));

                return undefined;
            }

            return dispatch(restore(id)).then(([camp]) => {
                dispatch(notify({
                    type: NOTIFICATION.TYPE.SUCCESS,
                    message: `Unarchived "${camp.product.name}".`,
                }));
            })
            .catch(reason => {
                dispatch(notify({
                    type: NOTIFICATION.TYPE.DANGER,
                    message: `Failed to unarchive: ${
                        reason.response || reason.message
                    }`,
                }));
            });
        })
    )))
).then(({ value }) => value));
