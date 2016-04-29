'use strict';

import { createAction } from 'redux-actions';
import { callAPI } from './api';
import { createDbActions } from '../utils/db';

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
export function changeEmail({ id, email, password }) {
    const meta = () => ({ email, id });

    return function thunk(dispatch, getState) {
        const user = getState().db.user[id];

        if (!user) {
            return dispatch(createAction(CHANGE_EMAIL_FAILURE)(new Error(
                `have no user with id: ${id}`
            )));
        }

        return dispatch(callAPI({
            endpoint: '/api/account/users/email',
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
}

export const CHANGE_PASSWORD_START = userPrefix('CHANGE_PASSWORD_START');
export const CHANGE_PASSWORD_SUCCESS = userPrefix('CHANGE_PASSWORD_SUCCESS');
export const CHANGE_PASSWORD_FAILURE = userPrefix('CHANGE_PASSWORD_FAILURE');
export function changePassword({ id, oldPassword, newPassword }) {
    return function thunk(dispatch, getState) {
        const user = getState().db.user[id];

        if (!user) {
            return dispatch(createAction(CHANGE_PASSWORD_FAILURE)(new Error(
                `have no user with id: ${id}`
            )));
        }

        return dispatch(callAPI({
            endpoint: '/api/account/users/password',
            method: 'POST',
            types: [CHANGE_PASSWORD_START, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE],
            body: {
                email: user.email,
                password: oldPassword,
                newPassword: newPassword
            }
        }));
    };
}
