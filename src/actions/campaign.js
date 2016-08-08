import { createDbActions } from '../utils/db';
import { createAction } from 'redux-actions';
import { createThunk } from '../middleware/fsa_thunk';

function prefix(type) {
    return `CAMPAIGN/${type}`;
}

const campaign = createDbActions({
    type: 'campaign',
    endpoint: '/api/campaigns',
    queries: {
        list: {
            application: 'showcase',
        },
    },
});

export default campaign;

export const CANCEL = prefix('CANCEL');
export const cancel = createThunk(id => (
    function thunk(dispatch) {
        return dispatch(createAction(CANCEL)(
            dispatch(campaign.update({ data: { id, status: 'canceled' } }))
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    }
));
