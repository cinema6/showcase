'use strict';

import {
    logoutUser as authLogoutUser
} from './auth';
import { createAction } from 'redux-actions';
import { replace } from 'react-router-redux';

function dashboardType(type) {
    return `DASHBOARD/${type}`;
}

export const LOGOUT_START = dashboardType('LOGOUT_START');
export const LOGOUT_SUCCESS = dashboardType('LOGOUT_SUCCESS');
export const LOGOUT_FAILURE = dashboardType('LOGOUT_FAILURE');
export function logoutUser() {
    return function thunk(dispatch) {
        dispatch(createAction(LOGOUT_START)());

        return dispatch(authLogoutUser()).then(result => Promise.all([
            dispatch(createAction(LOGOUT_SUCCESS)(result)),
            dispatch(replace('/login'))
        ])).catch(reason => {
            dispatch(createAction(LOGOUT_FAILURE)(reason));

            throw reason;
        }).then(() => undefined);
    };
}
