'use strict';

import {
    loginUser as authLoginUser
} from './auth';
import { replace } from 'react-router-redux';
import { createAction } from 'redux-actions';

function loginType(type) {
    return `LOGIN/${type}`;
}

export const LOGIN_START = loginType('LOGIN_START');
export const LOGIN_SUCCESS = loginType('LOGIN_SUCCESS');
export const LOGIN_FAILURE = loginType('LOGIN_FAILURE');
export function loginUser({ email, password, redirect }) {
    return function doLoginUser(dispatch) {
        dispatch(createAction(LOGIN_START)());

        return dispatch(authLoginUser({ email, password })).then(data => {
            return Promise.all([
                dispatch(createAction(LOGIN_SUCCESS)(data)),
                dispatch(replace(redirect))
            ]);
        }).catch(reason => dispatch(createAction(LOGIN_FAILURE)(reason)));
    };
}
