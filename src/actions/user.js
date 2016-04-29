'use strict';

import { createAction } from 'redux-actions';
import { assign } from 'lodash';
import { callAPI } from './api';

function userPrefix(type) {
    return `USER/${type}`;
}

export const UPDATE_START = userPrefix('UPDATE_START');
export const UPDATE_SUCCESS = userPrefix('UPDATE_SUCCESS');
export const UPDATE_FAILURE = userPrefix('UPDATE_FAILURE');
export function updateUser(data) {
    return function thunk(dispatch, getState) {
        const id = data.id;
        const user = getState().db.users[id];

        if (!id) {
            return dispatch(createAction(UPDATE_FAILURE)(new Error(
                'data has no id'
            )));
        }

        if (!user) {
            return dispatch(createAction(UPDATE_FAILURE)(new Error(
                `have no user with id: ${id}`
            )));
        }

        return dispatch(callAPI({
            endpoint: `/api/account/users/${id}`,
            method: 'PUT',
            types: [UPDATE_START, UPDATE_SUCCESS, UPDATE_FAILURE],
            body: assign({}, user, data)
        }));
    };
}

export const CHANGE_EMAIL_START = userPrefix('CHANGE_EMAIL_START');
export const CHANGE_EMAIL_SUCCESS = userPrefix('CHANGE_EMAIL_SUCCESS');
export const CHANGE_EMAIL_FAILURE = userPrefix('CHANGE_EMAIL_FAILURE');
export function changeEmail({ id, email, password }) {
    const meta = () => ({ email, id });

    return function thunk(dispatch, getState) {
        const user = getState().db.users[id];

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
        const user = getState().db.users[id];

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
