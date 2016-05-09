'use strict';

import { getProductData } from './collateral';
import { paymentMethod } from './payment';
import campaign from './campaign';
import { createAction } from 'redux-actions';
import { TYPE  as NOTIFICATION_TYPE } from '../enums/notification';
import { notify } from './notification';
import { replace } from 'react-router-redux';
import { campaignFromData } from '../utils/campaign';

function prefix(type) {
    return `PRODUCT_WIZARD/${type}`;
}

export const PRODUCT_SELECTED = prefix('PRODUCT_SELECTED');
export function productSelected({ product }) {
    return function thunk(dispatch) {
        return dispatch(createAction(PRODUCT_SELECTED)(
            dispatch(getProductData({ uri: product.uri }))
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    };
}

export const WIZARD_COMPLETE = prefix('WIZARD_COMPLETE');
export const wizardComplete = createAction(WIZARD_COMPLETE);

export const GO_TO_STEP = prefix('GO_TO_STEP');
export const goToStep = createAction(GO_TO_STEP);

export const WIZARD_DESTROYED = prefix('WIZARD_DESTROYED');
export const wizardDestroyed = createAction(WIZARD_DESTROYED);

export const CREATE_CAMPAIGN = prefix('CREATE_CAMPAIGN');
export function createCampaign({ payment, productData, targeting }) {
    return function thunk(dispatch) {
        return dispatch(createAction(CREATE_CAMPAIGN)(
            dispatch(paymentMethod.create({ data: {
                cardholderName: payment.cardholderName,
                paymentMethodNonce: payment.nonce,
                makeDefault: true
            } })).then(() => dispatch(campaign.create({
                data: campaignFromData({ productData, targeting })
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
}
