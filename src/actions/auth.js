import { callAPI } from './api';
import { format as formatURL } from 'url';
import { createThunk } from '../middleware/fsa_thunk';

function authType(type) {
    return `AUTH/${type}`;
}

export const STATUS_CHECK_START = authType('STATUS_CHECK_START');
export const STATUS_CHECK_SUCCESS = authType('STATUS_CHECK_SUCCESS');
export const STATUS_CHECK_FAILURE = authType('STATUS_CHECK_FAILURE');
export const checkAuthStatus = createThunk(() => (
    function check(dispatch, getState) {
        const state = getState();
        const userID = state.session.user;

        if (userID) {
            return state.db.user[userID];
        }

        return dispatch(callAPI({
            endpoint: '/api/auth/status',
            types: [STATUS_CHECK_START, STATUS_CHECK_SUCCESS, STATUS_CHECK_FAILURE],
        }));
    }
));

export const LOGIN_START = authType('LOGIN_START');
export const LOGIN_SUCCESS = authType('LOGIN_SUCCESS');
export const LOGIN_FAILURE = authType('LOGIN_FAILURE');
export function loginUser({ email, password }) {
    return callAPI({
        endpoint: formatURL({
            pathname: '/api/auth/login',
            query: { target: 'showcase' },
        }),
        method: 'POST',
        types: [LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE],
        body: { email, password },
    });
}

export const LOGOUT_START = authType('LOGOUT_START');
export const LOGOUT_SUCCESS = authType('LOGOUT_SUCCESS');
export const LOGOUT_FAILURE = authType('LOGOUT_FAILURE');
export function logoutUser() {
    return callAPI({
        endpoint: '/api/auth/logout',
        method: 'POST',
        types: [LOGOUT_START, LOGOUT_SUCCESS, LOGOUT_FAILURE],
    });
}

export const FORGOT_PASSWORD_START = authType('FORGOT_PASSWORD_START');
export const FORGOT_PASSWORD_SUCCESS = authType('FORGOT_PASSWORD_SUCCESS');
export const FORGOT_PASSWORD_FAILURE = authType('FORGOT_PASSWORD_FAILURE');
export function forgotPassword({ email }) {
    return callAPI({
        endpoint: formatURL({
            pathname: '/api/auth/password/forgot',
            query: { target: 'showcase' },
        }),
        method: 'POST',
        types: [FORGOT_PASSWORD_START, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE],
        body: { email, target: 'bob' },
    });
}

export const RESET_PASSWORD_START = authType('RESET_PASSWORD_START');
export const RESET_PASSWORD_SUCCESS = authType('RESET_PASSWORD_SUCCESS');
export const RESET_PASSWORD_FAILURE = authType('RESET_PASSWORD_FAILURE');
export function resetPassword({ id, token, newPassword }) {
    return callAPI({
        endpoint: formatURL({
            pathname: '/api/auth/password/reset',
            query: { target: 'showcase' },
        }),
        method: 'POST',
        types: [RESET_PASSWORD_START, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE],
        body: { id, token, newPassword },
    });
}
