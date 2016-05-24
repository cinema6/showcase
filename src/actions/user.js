'use strict';

import { createAction } from 'redux-actions';
import { callAPI } from './api';
import { createDbActions } from '../utils/db';
import { format as formatURL } from 'url';
import { createThunk } from '../middleware/fsa_thunk';

function userPrefix(type) {
    return `USER/${type}`;
}

export default createDbActions({
    type: 'user',
    endpoint: '/api/account/users'
});

export const CHANGE_EMAIL_START = userPrefix('CHANGE_EMAIL_START');
export const CHANGE_EMAIL_SUCCESS = userPrefix('CHANGE_EMAIL_SUCCESS');
export const CHANGE_EMAIL_FAILURE = userPrefix('CHANGE_EMAIL_FAILURE');
export const changeEmail = createThunk(({ id, email, password }) => {
    const meta = () => ({ email, id });

    return function thunk(dispatch, getState) {
        const user = getState().db.user[id];

        if (!user) {
            return dispatch(createAction(CHANGE_EMAIL_FAILURE)(new Error(
                `have no user with id: ${id}`
            )));
        }

        return dispatch(callAPI({
            endpoint: formatURL({
                pathname: '/api/account/users/email',
                query: { target: 'showcase' }
            }),
            method: 'POST',
            types: [
                CHANGE_EMAIL_START,
                {
                    type: CHANGE_EMAIL_SUCCESS,
                    meta: meta()
                },
                {
                    type: CHANGE_EMAIL_FAILURE,
                    meta: meta()
                }
            ],
            body: {
                newEmail: email,
                email: user.email,
                password: password
            }
        })).then(() => email);
    };
});

export const CHANGE_PASSWORD_START = userPrefix('CHANGE_PASSWORD_START');
export const CHANGE_PASSWORD_SUCCESS = userPrefix('CHANGE_PASSWORD_SUCCESS');
export const CHANGE_PASSWORD_FAILURE = userPrefix('CHANGE_PASSWORD_FAILURE');
export const changePassword = createThunk(({ id, oldPassword, newPassword }) => {
    return function thunk(dispatch, getState) {
        const user = getState().db.user[id];

        if (!user) {
            return dispatch(createAction(CHANGE_PASSWORD_FAILURE)(new Error(
                `have no user with id: ${id}`
            )));
        }

        return dispatch(callAPI({
            endpoint: formatURL({
                pathname: '/api/account/users/password',
                query: { target: 'showcase' }
            }),
            method: 'POST',
            types: [CHANGE_PASSWORD_START, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE],
            body: {
                email: user.email,
                password: oldPassword,
                newPassword: newPassword
            }
        }));
    };
});

export const SIGN_UP_START = userPrefix('SIGN_UP_START');
export const SIGN_UP_SUCCESS = userPrefix('SIGN_UP_SUCCESS');
export const SIGN_UP_FAILURE = userPrefix('SIGN_UP_FAILURE');
export function signUp(data) {
    return callAPI({
        types: [SIGN_UP_START, SIGN_UP_SUCCESS, SIGN_UP_FAILURE],
        method: 'POST',
        endpoint: formatURL({
            pathname: '/api/account/users/signup',
            query: { target: 'showcase' }
        }),
        body: data
    });
}

export const CONFIRM_START = userPrefix('CONFIRM_START');
export const CONFIRM_SUCCESS = userPrefix('CONFIRM_SUCCESS');
export const CONFIRM_FAILURE = userPrefix('CONFIRM_FAILURE');
export function confirmUser({ id, token }) {
    return callAPI({
        types: [CONFIRM_START, CONFIRM_SUCCESS, CONFIRM_FAILURE],
        method: 'POST',
        endpoint: formatURL({
            pathname: `/api/account/users/confirm/${id}`,
            query: { target: 'showcase' }
        }),
        body: { token }
    });
}

export const RESEND_CONFIRMATION_EMAIL_START = userPrefix('RESEND_CONFIRMATION_EMAIL_START');
export const RESEND_CONFIRMATION_EMAIL_SUCCESS = userPrefix('RESEND_CONFIRMATION_EMAIL_SUCCESS');
export const RESEND_CONFIRMATION_EMAIL_FAILURE = userPrefix('RESEND_CONFIRMATION_EMAIL_FAILURE');
export function resendConfirmationEmail() {
    return callAPI({
        types: [
            RESEND_CONFIRMATION_EMAIL_START,
            RESEND_CONFIRMATION_EMAIL_SUCCESS,
            RESEND_CONFIRMATION_EMAIL_FAILURE
        ],
        method: 'POST',
        endpoint: formatURL({
            pathname: '/api/account/users/resendActivation',
            query: { target: 'showcase' }
        })
    });
}
