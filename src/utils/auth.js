import { checkAuthStatus } from '../actions/auth';

export function createProtectedRouteEnterHandler({ store, loginPath, resendConfirmationPath }) {
    return function onEnter({ location: { pathname } }, redirect, done) {
        return store.dispatch(checkAuthStatus())
            .then(user => {
                if (user.status === 'new' && pathname !== resendConfirmationPath) {
                    return redirect(resendConfirmationPath);
                }

                return user;
            })
            .catch(() => redirect(loginPath))
            .then(() => done());
    };
}

export function createLoginEnterHandler({ store, dashboardPath }) {
    return function onEnter(nextState, redirect, done) {
        return store.dispatch(checkAuthStatus())
            .then(() => redirect(dashboardPath))
            .then(() => done(), () => done());
    };
}
