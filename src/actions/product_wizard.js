'use strict';

import { getProductData } from './collateral';
import { paymentMethod } from './payment';
import campaign from './campaign';
import advertiser from './advertiser';
import { createAction } from 'redux-actions';
import { TYPE  as NOTIFICATION_TYPE } from '../enums/notification';
import { notify } from './notification';
import { replace, push, goBack } from 'react-router-redux';
import { campaignFromData } from '../utils/campaign';
import { createThunk } from '../../src/middleware/fsa_thunk';

function prefix(type) {
    return `PRODUCT_WIZARD/${type}`;
}

export const PRODUCT_SELECTED = prefix('PRODUCT_SELECTED');
export const productSelected = createThunk(({ product }) => {
    return function thunk(dispatch) {
        return dispatch(createAction(PRODUCT_SELECTED)(
            dispatch(getProductData({ uri: product.uri }))
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    };
});

export const WIZARD_COMPLETE = prefix('WIZARD_COMPLETE');
export const wizardComplete = createThunk(({ productData, targeting }) => {
    return function thunk(dispatch, getState) {
        const [method] = getState().session.paymentMethods;

        return Promise.resolve(
            method || dispatch(paymentMethod.list()).then(([method]) => method)
        ).then(paymentMethod => {
            if (paymentMethod) {
                return dispatch(createCampaign({ productData, targeting }));
            } else {
                return dispatch(createAction(WIZARD_COMPLETE)({ productData, targeting }));
            }
        });
    };
});

export const GO_TO_STEP = prefix('GO_TO_STEP');
export const goToStep = createAction(GO_TO_STEP);

export const WIZARD_DESTROYED = prefix('WIZARD_DESTROYED');
export const wizardDestroyed = createAction(WIZARD_DESTROYED);

export const CREATE_CAMPAIGN = prefix('CREATE_CAMPAIGN');
export const createCampaign = createThunk(({ payment, productData, targeting }) => {
    return function thunk(dispatch, getState) {
        const state = getState();
        const user = state.db.user[state.session.user];

        return dispatch(createAction(CREATE_CAMPAIGN)(
            (payment ? dispatch(paymentMethod.create({ data: {
                cardholderName: payment.cardholderName,
                paymentMethodNonce: payment.nonce,
                makeDefault: true
            } })) : Promise.resolve()).then(() => dispatch(advertiser.query({
                org: user.org,
                limit: 1
            }))).then(([advertiserId]) => dispatch(campaign.create({
                data: campaignFromData({ productData, targeting }, { advertiserId })
            }))).then(([id]) => {
                dispatch(replace(`/dashboard/campaigns/${id}`));
                dispatch(notify({
                    type: NOTIFICATION_TYPE.SUCCESS,
                    message: 'Your app has been added!'
                }));

                return [id];
            }).catch(reason => {
                dispatch(notify({
                    type: NOTIFICATION_TYPE.DANGER,
                    message: `There was a problem: ${reason.response || reason.message}`
                }));

                return Promise.reject(reason);
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    };
});

export const LOAD_CAMPAIGN = prefix('LOAD_CAMPAIGN');
export const loadCampaign = createThunk(({ id }) => {
    return function thunk(dispatch, getState) {
        return dispatch(createAction(LOAD_CAMPAIGN)(
            dispatch(campaign.get({ id })).catch(reason => {
                const cached = getState().db.campaign[id];

                if (!cached) {
                    dispatch(notify({
                        type: NOTIFICATION_TYPE.DANGER,
                        message: `Failed to fetch data: ${reason.response || reason.message}`,
                        time: 10000
                    }));
                    dispatch(goBack());
                } else {
                    dispatch(notify({
                        type: NOTIFICATION_TYPE.WARNING,
                        message: `Failed to fetch latest data: ${reason.response || reason.message}`
                    }));
                }

                return Promise.reject(reason);
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    };
});

export const UPDATE_CAMPAIGN = prefix('UPDATE_CAMPAIGN');
export const updateCampaign = createThunk(({ id, productData, targeting }) => {
    return function thunk(dispatch, getState) {
        let currentCampaign = getState().db.campaign[id];

        return dispatch(createAction(UPDATE_CAMPAIGN)(
            Promise.resolve().then(() => {
                if (!currentCampaign) {
                    throw new Error(`There is no campaign(${id}) in the cache.`);
                }

                return dispatch(campaign.update({
                    data: campaignFromData({ productData, targeting }, currentCampaign)
                })).then(([id]) => {
                    dispatch(notify({
                        type: NOTIFICATION_TYPE.SUCCESS,
                        message: 'Your app has been updated!'
                    }));
                    dispatch(push(`/dashboard/campaigns/${id}`));

                    return [id];
                });
            }).catch(reason => {
                dispatch(notify({
                    type: NOTIFICATION_TYPE.DANGER,
                    message: `Failed to update your app: ${reason.response || reason.message}`,
                    time: 10000
                }));

                return Promise.reject(reason);
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    };
});
