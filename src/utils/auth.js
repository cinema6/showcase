'use strict';

import { checkAuthStatus } from '../actions/auth';
import { replace } from 'react-router-redux';

export function createProtectedRouteEnterHandler(store, loginPath) {
    return function onEnter(nextState, redirect, done) {
        return store.dispatch(checkAuthStatus()).then(() => done()).catch(() => {
            done();
            return store.dispatch(replace(loginPath));
        });
    };
}

export function createLoginEnterHandler(store, dashboardPath) {
    return function onEnter(nextState, redirect, done) {
        return store.dispatch(checkAuthStatus()).then(() => {
            done();
            return store.dispatch(replace(dashboardPath));
        }).catch(() => done());
    };
}
