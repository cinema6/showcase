import { Route, IndexRedirect, IndexRoute } from 'react-router';
import React from 'react';
import Application from './containers/Application';
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import SignUp from './containers/SignUp';
import ConfirmAccount from './containers/ConfirmAccount';
import ResendConfirmation from './containers/ResendConfirmation';
import Account from './containers/Account';
import AccountProfile from './containers/Account/Profile';
import AccountEmail from './containers/Account/Email';
import AccountPassword from './containers/Account/Password';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import DashboardBilling from './containers/Dashboard/Billing';
import DashboardCampaignDetail from './containers/Dashboard/CampaignDetail';
import DashboardAddProduct from './containers/Dashboard/AddProduct';
import DashboardEditProduct from './containers/Dashboard/EditProduct';
import NotFound from './components/NotFound';
import {
    createProtectedRouteEnterHandler,
    createLoginEnterHandler,
} from './utils/auth';

import { TYPE as NOTIFICATION_TYPE } from './enums/notification';
import { getCampaigns } from './actions/session';
import { notify } from './actions/notification';

export default function createRoutes(store) {
    const checkAuth = createProtectedRouteEnterHandler({
        store,
        loginPath: '/login',
        resendConfirmationPath: '/resend-confirmation',
    });
    const checkLoggedIn = createLoginEnterHandler({ store, dashboardPath: '/dashboard' });

    function onEnterDashboard(routerState, replace, done) {
        return store.dispatch(getCampaigns()).then(([campaign]) => {
            if (!campaign) {
                return replace('/dashboard/add-product');
            }

            return replace(`/dashboard/campaigns/${campaign}`);
        }).catch(reason => {
            store.dispatch(notify({
                type: NOTIFICATION_TYPE.DANGER,
                message: `Unexpected error: ${reason.response || reason.message}`,
                time: 10000,
            }));
        })
        .then(() => done());
    }

    function onEnterAddProduct(routerState, replace, done) {
        return store.dispatch(getCampaigns()).then(([campaign]) => {
            if (campaign) {
                return replace('/dashboard');
            }

            return undefined;
        }).catch(reason => {
            store.dispatch(notify({
                type: NOTIFICATION_TYPE.WARNING,
                message: `Unexpected error: ${reason.response || reason.message}`,
            }));

            return replace('/dashboard');
        })
        .then(() => done());
    }

    return (
        <Route path="/" component={Application}>
            <IndexRedirect to="/dashboard" />

            <Route path="confirm-account" component={ConfirmAccount} />
            <Route path="resend-confirmation" component={ResendConfirmation} onEnter={checkAuth} />

            <Route path="dashboard" component={Dashboard} onEnter={checkAuth}>
                <IndexRoute onEnter={onEnterDashboard} />

                <Route
                    path="add-product"
                    component={DashboardAddProduct}
                    onEnter={onEnterAddProduct}
                />

                <Route path="campaigns/:campaignId/edit" component={DashboardEditProduct} />

                <Route path="account" component={Account}>
                    <IndexRedirect to="profile" />

                    <Route path="profile" component={AccountProfile} />
                    <Route path="email" component={AccountEmail} />
                    <Route path="password" component={AccountPassword} />
                </Route>

                <Route path="billing" component={DashboardBilling} />
                <Route
                    path="campaigns/:campaignId"
                    component={DashboardCampaignDetail}
                />
            </Route>

            <Route path="login" component={Login} onEnter={checkLoggedIn} />
            <Route path="sign-up" component={SignUp} onEnter={checkLoggedIn} />
            <Route path="forgot-password" component={ForgotPassword} />
            <Route path="reset-password" component={ResetPassword} />

            <Route path="*" component={NotFound} />
        </Route>
    );
}
