'use strict';

import { checkAuthStatus } from '../actions/auth';

export function createProtectedRouteEnterHandler(store, loginPath) {
    return function onEnter(nextState, redirect, done) {
        return store.dispatch(checkAuthStatus())
            .catch(() => redirect(loginPath))
            .then(() => done());
    };
}

export function createLoginEnterHandler(store, dashboardPath) {
    return function onEnter(nextState, redirect, done) {
        return store.dispatch(checkAuthStatus())
            .then(() => redirect(dashboardPath))
            .then(() => done(), () => done());
    };
}
