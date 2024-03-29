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
import {
    getOrg,
    getBillingPeriod,
    getPaymentPlan,
    getCampaigns,
    getArchive,
} from './session';
import moment from 'moment';
import { getCampaignAnalytics } from './analytics';
import { notify, addNotification } from './notification';
import { TYPE as NOTIFICATION } from '../enums/notification';
import React from 'react';
import { Link } from 'react-router';
import { showAlert } from './alert';
import {
    showPlanModal,
    setPostPlanChangeRedirect,
} from './billing';

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
            Promise.all([
                dispatch(getArchive()),
                dispatch(getCampaigns()),
            ]).then(([archives, campaigns]) =>
                Promise.all(campaigns.concat(archives).map(camp => (
                    dispatch(getCampaignAnalytics(camp.id))
            )))),
            dispatch(getPaymentPlan()),
            dispatch(getBillingPeriod()),
        ])
    ))
);

export const checkForSlots = createThunk(() => (dispatch) =>
    Promise.all([
        dispatch(getPaymentPlan()),
        dispatch(getCampaigns()),
    ]).then(([[paymentPlan], campaigns]) => {
        if (campaigns.length >= paymentPlan.maxCampaigns) {
            return false;
        }
        return true;
    })
);

export const promptUpgrade = createThunk(redirect => (dispatch) =>
    dispatch(showAlert({
        title: 'Upgrade your plan',
        description: 'You have used the maximum allowed apps on your plan. '
        + 'Please upgrade your plan to promote more apps.',
        buttons: [
            {
                text: 'Yes, upgrade my plan!',
                type: 'danger btn-block',
                onSelect: dismiss => dispatch(push('/dashboard/billing'))
                .then(() => {
                    dismiss();

                    dispatch(showPlanModal(true));
                    dispatch(setPostPlanChangeRedirect(redirect));
                }).catch(reason => {
                    dispatch(notify({
                        type: NOTIFICATION.DANGER,
                        message: `Unexpected Error:
                            ${reason.response || reason.message}`,
                        time: 10000,
                    }));
                }),
            },
            {
                text: 'No, keep my plan.',
                type: 'default btn-block',
                onSelect: dismiss => dismiss(),
            },
        ],
    }))
);

export const addApp = createThunk(() => (dispatch) =>
    dispatch(checkForSlots()).then(slotsAvailable => {
        const path = '/dashboard/add-product';

        if (!slotsAvailable) {
            return dispatch(promptUpgrade(path));
        }

        return dispatch(push(path));
    })
);
