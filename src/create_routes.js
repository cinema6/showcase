import { Route, IndexRedirect } from 'react-router';
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
import DashboardCampaignList from './containers/Dashboard/CampaignList';
import DashboardArchive from './containers/Dashboard/Archive';
import NotFound from './components/NotFound';
import {
    createProtectedRouteEnterHandler,
    createLoginEnterHandler,
} from './utils/auth';

import { TYPE as NOTIFICATION_TYPE } from './enums/notification';
import {
    getCampaigns,
    getPaymentPlan,
} from './actions/session';
import { notify } from './actions/notification';

export default function createRoutes(store) {
    const dispatch = action => store.dispatch(action);

    const checkAuth = createProtectedRouteEnterHandler({
        store,
        loginPath: '/login',
        resendConfirmationPath: '/resend-confirmation',
    });
    const checkLoggedIn = createLoginEnterHandler({ store, dashboardPath: '/dashboard' });

    function onEnterCampaigns(routerState, replace, done) {
        return Promise.all([
            dispatch(getCampaigns()),
            dispatch(getPaymentPlan()),
        ])
        .then(([campaigns, paymentPlans]) => {
            const paymentPlan = paymentPlans && paymentPlans[0];

            if (!paymentPlan || (campaigns.length < 1 && paymentPlan.maxCampaigns > 0)) {
                replace('/dashboard/add-product');
            }
        })
        .catch(reason => {
            dispatch(notify({
                type: NOTIFICATION_TYPE.DANGER,
                message: `Unexpected error: ${reason.response || reason.message}`,
                time: 10000,
            }));
        })
        .then(() => done());
    }

    function onEnterAddProduct(routerState, replace, done) {
        return Promise.all([
            dispatch(getCampaigns()),
            dispatch(getPaymentPlan()),
        ])
        .then(([campaigns, paymentPlans]) => {
            const paymentPlan = paymentPlans && paymentPlans[0];

            if (paymentPlan && paymentPlan.maxCampaigns <= campaigns.length) {
                replace('/dashboard/campaigns');
            }
        })
        .catch(reason => {
            dispatch(notify({
                type: NOTIFICATION_TYPE.WARNING,
                message: `Unexpected error: ${reason.response || reason.message}`,
            }));
        })
        .then(() => done());
    }

    return (
        <Route path="/" component={Application}>
            <IndexRedirect to="/dashboard" />

            <Route path="confirm-account" component={ConfirmAccount} />
            <Route path="resend-confirmation" component={ResendConfirmation} onEnter={checkAuth} />

            <Route path="dashboard" component={Dashboard} onEnter={checkAuth}>
                <IndexRedirect to="campaigns" />

                <Route
                    path="add-product"
                    component={DashboardAddProduct}
                    onEnter={onEnterAddProduct}
                />

                <Route
                    path="campaigns"
                    component={DashboardCampaignList}
                    onEnter={onEnterCampaigns}
                />
                <Route
                    path="campaigns/:campaignId"
                    component={DashboardCampaignDetail}
                />
                <Route path="campaigns/:campaignId/edit" component={DashboardEditProduct} />

                <Route
                    path="archive"
                    component={DashboardArchive}
                />

                <Route path="account" component={Account}>
                    <IndexRedirect to="profile" />

                    <Route path="profile" component={AccountProfile} />
                    <Route path="email" component={AccountEmail} />
                    <Route path="password" component={AccountPassword} />
                </Route>

                <Route path="billing" component={DashboardBilling} />
            </Route>

            <Route path="login" component={Login} onEnter={checkLoggedIn} />
            <Route path="sign-up" component={SignUp} onEnter={checkLoggedIn} />
            <Route path="forgot-password" component={ForgotPassword} />
            <Route path="reset-password" component={ResetPassword} />

            <Route path="*" component={NotFound} />
        </Route>
    );
}
