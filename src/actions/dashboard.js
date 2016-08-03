import {
    logoutUser as authLogoutUser,
} from './auth';
import {
    trackLogout as intercomTrackLogout,
} from './intercom';
import { createAction } from 'redux-actions';
import { replace, push } from 'react-router-redux';
import { createThunk } from '../middleware/fsa_thunk';
import { paymentMethod } from './payment';
import { getOrg, getBillingPeriod, getPaymentPlan, getCampaigns } from './session';
import moment from 'moment';
import { getCampaignAnalytics } from './analytics';
import { notify, addNotification } from './notification';
import { TYPE as NOTIFICATION } from '../enums/notification';
import React from 'react';
import { Link } from 'react-router';
import { showAlert } from './alert';
import { showChangeModal } from './billing';

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
export const checkIfPaymentMethodRequired = createThunk(() => dispatch => (
    dispatch(createAction(CHECK_IF_PAYMENT_METHOD_REQUIRED)(
        dispatch(paymentMethod.list()).then(([aPaymentMethod]) => {
            if (aPaymentMethod) { return undefined; }

            return dispatch(getOrg()).then(([org]) => {
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

export const LOAD_PAGE_DATA = prefix('LOAD_PAGE_DATA');
export const loadPageData = createThunk(() => (dispatch) =>
    dispatch(createAction(LOAD_PAGE_DATA)(
        Promise.all([
            dispatch(getCampaigns())
            .then((campaigns) => Promise.all(campaigns.map(campaign => (
                dispatch(getCampaignAnalytics(campaign.id))
            )))),
            dispatch(getPaymentPlan()),
            dispatch(getBillingPeriod()),
        ])
    ))
);

export const ADD_APP_REQUEST = prefix('ADD_APP_REQUEST');
export const onAddApp = createThunk(() => (dispatch, getState) =>
    dispatch(createAction(ADD_APP_REQUEST)(
        dispatch(getPaymentPlan()).then(id =>
            dispatch(getCampaigns()).then(campaigns => {
                const state = getState();
                const paymentPlan = state.db.paymentPlan[id];
                if (campaigns.length === paymentPlan.maxCampaigns) {
                    return dispatch(showAlert({
                        title: 'Uh oh!',
                        description: 'You have no unused apps remaining in your current plan. '
                        + 'Would you like to upgrade your plan?',
                        buttons: [
                            {
                                text: 'No thanks',
                                onSelect: dismiss => dismiss(),
                            },
                            {
                                text: 'Yes, upgrade my plan!',
                                type: 'success',
                                onSelect: dismiss => dispatch(showChangeModal()).then(() => {
                                    dismiss();
                                    return dispatch(push('/dashboard/billing'));
                                }).catch(reason => {
                                    dispatch(notify({
                                        type: NOTIFICATION.DANGER,
                                        message: `Failed to upgrade plan:
                                            ${reason.response || reason.message}`,
                                        time: 10000,
                                    }));
                                }),
                            },
                        ],
                    }));
                }
                return dispatch(push('/dashboard/add-product'));
            })
        )
    ))
);
