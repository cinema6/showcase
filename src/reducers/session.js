'use strict';

import { handleActions } from 'redux-actions';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS,
    LOGOUT_SUCCESS
} from '../actions/auth';
import { assign } from 'lodash';

const DEFAULT_STATE = {
    user: null
};

function addUserToSession(state, { payload: user }) {
    return assign({}, state, {
        user: user.id
    });
}

export default handleActions({
    [LOGIN_SUCCESS]: addUserToSession,
    [STATUS_CHECK_SUCCESS]: addUserToSession,

    [LOGOUT_SUCCESS]: state => assign({}, state, {
        user: null
    })
}, DEFAULT_STATE);
