'use strict';

import { Route, IndexRedirect } from 'react-router';
import React from 'react';
import Application from './containers/Application';
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import Account from './containers/Account';
import AccountProfile from './containers/Account/Profile';
import AccountEmail from './containers/Account/Email';
import AccountPassword from './containers/Account/Password';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import DashboardBilling from './containers/Dashboard/Billing';
import DashboardAddProduct from './containers/Dashboard/AddProduct';
import {
    createProtectedRouteEnterHandler,
    createLoginEnterHandler
} from './utils/auth';

export default function createRoutes(store) {
    const checkAuth = createProtectedRouteEnterHandler(store, '/login');
    const checkLoggedIn = createLoginEnterHandler(store, '/dashboard');

    return (
        <Route path="/" component={Application}>
            <IndexRedirect to="/dashboard" />

            <Route path="dashboard" component={Dashboard} onEnter={checkAuth}>
                <IndexRedirect to="add-product" />

                <Route path="add-product" component={DashboardAddProduct}></Route>

                <Route path="account" component={Account}>
                    <IndexRedirect to="profile" />

                    <Route path="profile" component={AccountProfile}></Route>
                    <Route path="email" component={AccountEmail}></Route>
                    <Route path="password" component={AccountPassword}></Route>
                </Route>

                <Route path="billing" component={DashboardBilling}></Route>
            </Route>

            <Route path="login" component={Login} onEnter={checkLoggedIn}></Route>
            <Route path="forgot-password" component={ForgotPassword}></Route>
            <Route path="reset-password" component={ResetPassword}></Route>
        </Route>
    );
}
