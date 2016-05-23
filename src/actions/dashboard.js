'use strict';

import {
    logoutUser as authLogoutUser
} from './auth';
import { createAction } from 'redux-actions';
import { replace } from 'react-router-redux';
import { createThunk } from '../middleware/fsa_thunk';

function dashboardType(type) {
    return `DASHBOARD/${type}`;
}

export const LOGOUT_START = dashboardType('LOGOUT_START');
export const LOGOUT_SUCCESS = dashboardType('LOGOUT_SUCCESS');
export const LOGOUT_FAILURE = dashboardType('LOGOUT_FAILURE');
export const logoutUser = createThunk(() => {
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
});

export const SHOW_NAV = dashboardType('SHOW_NAV');
export const showNav = createAction(SHOW_NAV);

export const TOGGLE_NAV = dashboardType('TOGGLE_NAV');
export const toggleNav = createAction(TOGGLE_NAV);
