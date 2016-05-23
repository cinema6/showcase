'use strict';

import { createAction } from 'redux-actions';
import { assign } from 'lodash';
import userActions, {
    changeEmail as userChangeEmail,
    changePassword as userChangePassword
} from './user';
import { createThunk } from '../middleware/fsa_thunk';

function accountPrefix(type) {
    return `ACCOUNT/${type}`;
}

export const UPDATE_START = accountPrefix('UPDATE_START');
export const UPDATE_SUCCESS = accountPrefix('UPDATE_SUCCESS');
export const UPDATE_FAILURE = accountPrefix('UPDATE_FAILURE');
export const updateUser = createThunk(data => {
    return function thunk(dispatch, getState) {
        const userID = getState().session.user;
        const update = assign({}, data, { id: userID });

        dispatch(createAction(UPDATE_START)(data));

        return dispatch(userActions.update({ data: update }))
            .then(user => dispatch(createAction(UPDATE_SUCCESS)(user)))
            .catch(reason => dispatch(createAction(UPDATE_FAILURE)(reason)));
    };
});

export const CHANGE_EMAIL_START = accountPrefix('CHANGE_EMAIL_START');
export const CHANGE_EMAIL_SUCCESS = accountPrefix('CHANGE_EMAIL_SUCCESS');
export const CHANGE_EMAIL_FAILURE = accountPrefix('CHANGE_EMAIL_FAILURE');
export const changeEmail = createThunk(({ email, password }) => {
    return function thunk(dispatch, getState) {
        const id = getState().session.user;

        dispatch(createAction(CHANGE_EMAIL_START)(email));

        return dispatch(userChangeEmail({ id, email, password }))
            .then(email => dispatch(createAction(CHANGE_EMAIL_SUCCESS)(email)))
            .catch(reason => dispatch(createAction(CHANGE_EMAIL_FAILURE)(reason)));
    };
});

export const CHANGE_PASSWORD_START = accountPrefix('CHANGE_PASSWORD_START');
export const CHANGE_PASSWORD_SUCCESS = accountPrefix('CHANGE_PASSWORD_SUCCESS');
export const CHANGE_PASSWORD_FAILURE = accountPrefix('CHANGE_PASSWORD_FAILURE');
export const changePassword = createThunk(({ newPassword, oldPassword }) => {
    return function thunk(dispatch, getState) {
        const id = getState().session.user;

        dispatch(createAction(CHANGE_PASSWORD_START)());

        return dispatch(userChangePassword({ id, newPassword, oldPassword }))
            .then(() => dispatch(createAction(CHANGE_PASSWORD_SUCCESS)()))
            .catch(reason => dispatch(createAction(CHANGE_PASSWORD_FAILURE)(reason)));
    };
});
