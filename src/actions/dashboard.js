import {
    logoutUser as authLogoutUser,
} from './auth';
import {
    trackLogout as intercomTrackLogout,
} from './intercom';
import { createAction } from 'redux-actions';
import { replace } from 'react-router-redux';
import { createThunk } from '../middleware/fsa_thunk';
import { paymentMethod } from './payment';
import { getOrg } from './session';
import moment from 'moment';
import { addNotification } from './notification';
import { TYPE as NOTIFICATION } from '../enums/notification';
import React from 'react';
import { Link } from 'react-router';

const ADD_PAYMENT_METHOD_MESSAGE = (<span>
    Your trial period has expired. Please <Link to="/dashboard/billing">add a
    payment method</Link> to continue your service.
</span>);

function prefix(type) {
    return `DASHBOARD/${type}`;
}

export const LOGOUT_START = prefix('LOGOUT_START');
export const LOGOUT_SUCCESS = prefix('LOGOUT_SUCCESS');
export const LOGOUT_FAILURE = prefix('LOGOUT_FAILURE');
export const logoutUser = createThunk(() => (
    function thunk(dispatch) {
        dispatch(createAction(LOGOUT_START)());

        return dispatch(authLogoutUser()).then(result => Promise.all([
            dispatch(createAction(LOGOUT_SUCCESS)(result)),
            dispatch(replace('/login')),
            dispatch(intercomTrackLogout()),
        ])).catch(reason => {
            dispatch(createAction(LOGOUT_FAILURE)(reason));

            throw reason;
        })
        .then(() => undefined);
    }
));

export const SHOW_NAV = prefix('SHOW_NAV');
export const showNav = createAction(SHOW_NAV);

export const TOGGLE_NAV = prefix('TOGGLE_NAV');
export const toggleNav = createAction(TOGGLE_NAV);

export const CHECK_IF_PAYMENT_METHOD_REQUIRED = prefix('CHECK_IF_PAYMENT_METHOD_REQUIRED');
export const checkIfPaymentMethodRequired = createThunk(() => (dispatch, getState) => (
    dispatch(createAction(CHECK_IF_PAYMENT_METHOD_REQUIRED)(
        dispatch(paymentMethod.list()).then(([paymentMethodId]) => {
            if (paymentMethodId) { return undefined; }

            return dispatch(getOrg()).then(([orgId]) => {
                const org = getState().db.org[orgId];
                const paymentPlanStart = org.paymentPlanStart && moment(org.paymentPlanStart);
                const now = moment();

                if (!paymentPlanStart || paymentPlanStart.isAfter(now)) { return undefined; }

                return dispatch(addNotification({
                    type: NOTIFICATION.WARNING,
                    message: ADD_PAYMENT_METHOD_MESSAGE,
                }));
            });
        }).then(() => undefined)
    )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));
