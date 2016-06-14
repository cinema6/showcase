import { handleActions } from 'redux-actions';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS,
} from '../../actions/auth';
import {
    CHANGE_EMAIL_SUCCESS,
} from '../../actions/user';
import { assign } from 'lodash';

const DEFAULT_STATE = {};

function addUserToCache(state, { payload: user }) {
    return assign({}, state, {
        [user.id]: user,
    });
}

export default handleActions({
    [LOGIN_SUCCESS]: addUserToCache,
    [STATUS_CHECK_SUCCESS]: addUserToCache,

    [CHANGE_EMAIL_SUCCESS]: (state, { meta }) => {
        const { id, email } = meta;

        return assign({}, state, {
            [id]: assign({}, state[id], { email }),
        });
    },
}, DEFAULT_STATE);
