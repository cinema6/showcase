import { createThunk } from '../middleware/fsa_thunk';
import { createAction } from 'redux-actions';
import campaigns from './campaign';
import { getCampaignAnalytics } from './analytics';

function prefix(type) {
    return `CAMPAIGN_LIST/${type}`;
}

export const LOAD_PAGE_DATA = prefix('LOAD_PAGE_DATA');
export const loadPageData = createThunk(() => dispatch => dispatch(createAction(LOAD_PAGE_DATA)(
    Promise.resolve().then(() => (
        dispatch(campaigns.list()).then(ids => (
            Promise.all(ids.map(id => dispatch(getCampaignAnalytics(id))))
        ))
    )).then(() => undefined)
)).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason)));
