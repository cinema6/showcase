import { handleActions } from 'redux-actions';
import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
} from '../actions/notification';
import { assign, reject } from 'lodash';

const INITIAL_STATE = {
    items: [],
};

export default handleActions({
    [ADD_NOTIFICATION]: (state, { payload: notification }) => assign({}, state, {
        items: [notification].concat(state.items),
    }),
    [REMOVE_NOTIFICATION]: (state, { payload: id }) => assign({}, state, {
        items: reject(state.items, { id }),
    }),
}, INITIAL_STATE);
