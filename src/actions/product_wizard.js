import { getProductData } from './collateral';
import { paymentMethod } from './payment';
import campaign from './campaign';
import advertiser from './advertiser';
import { createAction } from 'redux-actions';
import { TYPE as NOTIFICATION_TYPE } from '../enums/notification';
import { notify } from './notification';
import { replace, push, goBack } from 'react-router-redux';
import { campaignFromData } from '../utils/campaign';
import { createThunk } from '../../src/middleware/fsa_thunk';
import { getPromotions, getOrg } from './session';
import moment from 'moment';
import _, { find } from 'lodash';

function prefix(type) {
    return `PRODUCT_WIZARD/${type}`;
}

export const PRODUCT_SELECTED = prefix('PRODUCT_SELECTED');
export const productSelected = createThunk(({ product }) => (
    function thunk(dispatch) {
        return dispatch(createAction(PRODUCT_SELECTED)(
            dispatch(getProductData({ uri: product.uri }))
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    }
));

export const GO_TO_STEP = prefix('GO_TO_STEP');
export const goToStep = createAction(GO_TO_STEP);

export const WIZARD_DESTROYED = prefix('WIZARD_DESTROYED');
export const wizardDestroyed = createAction(WIZARD_DESTROYED);

export const CREATE_CAMPAIGN = prefix('CREATE_CAMPAIGN');
export const createCampaign = createThunk(({ payment, productData, targeting }) => (
    function thunk(dispatch, getState) {
        const state = getState();
        const user = state.db.user[state.session.user];

        return dispatch(createAction(CREATE_CAMPAIGN)(
            (payment ? dispatch(paymentMethod.create({ data: {
                cardholderName: payment.cardholderName,
                paymentMethodNonce: payment.nonce,
                makeDefault: true,
            } })) : Promise.resolve()).then(() => dispatch(advertiser.query({
                org: user.org,
                limit: 1,
            }))).then(([advertiserId]) => dispatch(campaign.create({
                data: campaignFromData({ productData, targeting }, { advertiserId }),
            }))).then(([id]) => {
                dispatch(replace(`/dashboard/campaigns/${id}`));
                dispatch(notify({
                    type: NOTIFICATION_TYPE.SUCCESS,
                    message: 'Your ad is ready to go and we’ll start promoting it soon.' +
                    'You’ll get first stat update in a few days so keep a look out.',
                    time: 6000,
                }));

                return [id];
            })
            .catch(reason => {
                dispatch(notify({
                    type: NOTIFICATION_TYPE.DANGER,
                    message: `There was a problem: ${reason.response || reason.message}`,
                }));

                return Promise.reject(reason);
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    }
));

export const wizardComplete = createThunk(({ productData, targeting }) => (
    function thunk(dispatch, getState) {
        const [method] = getState().session.paymentMethods;

        return Promise.resolve(
            method || dispatch(paymentMethod.list()).then(([result]) => result)
        ).then(aPaymentMethod => {
            if (aPaymentMethod) {
                return dispatch(createCampaign({ productData, targeting }));
            }

            return dispatch(goToStep(3));
        });
    }
));

export const LOAD_CAMPAIGN = prefix('LOAD_CAMPAIGN');
export const loadCampaign = createThunk(({ id }) => (dispatch, getState) => (
    dispatch(createAction(LOAD_CAMPAIGN)(
        dispatch(campaign.get({ id })).catch(reason => {
            const cached = getState().db.campaign[id];

            if (!cached) {
                dispatch(notify({
                    type: NOTIFICATION_TYPE.DANGER,
                    message: `Failed to fetch data: ${reason.response || reason.message}`,
                    time: 10000,
                }));
                dispatch(goBack());
            } else {
                dispatch(notify({
                    type: NOTIFICATION_TYPE.WARNING,
                    message: `Failed to fetch latest data: ${reason.response || reason.message}`,
                }));
            }

            return Promise.reject(reason);
        })
    )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));

export const UPDATE_CAMPAIGN = prefix('UPDATE_CAMPAIGN');
export const updateCampaign = createThunk(({ id, productData, targeting }) => (
    function thunk(dispatch, getState) {
        const currentCampaign = getState().db.campaign[id];

        return dispatch(createAction(UPDATE_CAMPAIGN)(
            Promise.resolve().then(() => {
                if (!currentCampaign) {
                    throw new Error(`There is no campaign(${id}) in the cache.`);
                }

                return dispatch(campaign.update({
                    data: campaignFromData({ productData, targeting }, currentCampaign),
                })).then(([campaignId]) => {
                    dispatch(notify({
                        type: NOTIFICATION_TYPE.SUCCESS,
                        message: 'Your app has been updated!',
                    }));
                    dispatch(push(`/dashboard/campaigns/${campaignId}`));

                    return [id];
                });
            }).catch(reason => {
                dispatch(notify({
                    type: NOTIFICATION_TYPE.DANGER,
                    message: `Failed to update your app: ${reason.response || reason.message}`,
                    time: 10000,
                }));

                return Promise.reject(reason);
            })
        )).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
    }
));

export const PREVIEW_LOADED = prefix('PREVIEW_LOADED');
export const previewLoaded = createAction(PREVIEW_LOADED);

export const COLLECT_PAYMENT = prefix('COLLECT_PAYMENT');
export const collectPayment = createThunk(({ productData, targeting }) => (dispatch, getState) => {
    const collectPaymentMethod = () => goToStep(4);

    return dispatch(createAction(COLLECT_PAYMENT)(Promise.all([
        dispatch(getPromotions()),
        dispatch(getOrg()),
    ]).then(([promotionIds, orgId]) => {
        const state = getState();
        const promotions = promotionIds.map(id => state.db.promotion[id]);
        const org = state.db.org[orgId];
        const paymentMethodRequired = _(promotions).every(
            `data[${org.paymentPlanId}].paymentMethodRequired`
        );
        const paymentPlanStart = (org.paymentPlanStart || null) &&
            moment(org.paymentPlanStart);
        const now = moment();

        if (paymentMethodRequired || (paymentPlanStart && !paymentPlanStart.isAfter(now))) {
            return dispatch(collectPaymentMethod());
        }

        return dispatch(createCampaign({ productData, targeting }));
    })
    .then(() => undefined)
    .catch(reason => {
        dispatch(notify({
            type: NOTIFICATION_TYPE.DANGER,
            message: `Unexpected error: ${reason.response || reason.message}`,
            time: 10000,
        }));

        throw reason;
    }))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason));
});

export const AUTOFILL_COMPLETE = prefix('COMPLETE_AUTOFILL');
export function completeAutofill(productData) {
    return {
        type: AUTOFILL_COMPLETE,
        payload: productData,
    };
}

export const AUTOFILL = prefix('AUTOFILL');
export const autofill = createThunk(() => (dispatch) => {
    const uri = localStorage.getItem('appURI');

    function getThumbnail(obj) {
        return (find(obj.images, i => i.type === 'thumbnail') || {}).uri || '';
    }

    localStorage.removeItem('appURI');

    if (uri) {
        return dispatch(getProductData({ uri })).then((response) => dispatch(completeAutofill({
            id: response.uri,
            title: response.name,
            thumbnail: getThumbnail(response),
            uri: response.uri,
        })));
    }

    return undefined;
});
