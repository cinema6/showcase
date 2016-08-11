import { handleActions } from 'redux-actions';
import { assign } from 'lodash';
import {
    PRODUCT_SELECTED,
    GO_TO_STEP,
    PREVIEW_LOADED,
    COLLECT_PAYMENT,
    TOGGLE_LANDSCAPE,
} from '../../../../actions/product_wizard';
import * as TARGETING from '../../../../enums/targeting';

const DEFAULT_TARGETING = {
    age: [TARGETING.AGE.ALL],
    gender: TARGETING.GENDER.ALL,
};

const INITIAL_STATE = {
    step: 0,
    previewLoaded: false,
    checkingIfPaymentRequired: false,
    productData: null,
    targeting: DEFAULT_TARGETING,
    landscape: false,
};

export default handleActions({
    [`${PRODUCT_SELECTED}_PENDING`]: state => assign({}, state, {
        previewLoaded: false,
        productData: null,
        targeting: DEFAULT_TARGETING,
    }),
    [`${PRODUCT_SELECTED}_FULFILLED`]: (state, { payload: productData }) => assign({}, state, {
        step: 1,
        productData,
    }),

    [GO_TO_STEP]: (state, { payload: step }) => assign({}, state, { step }),

    [TOGGLE_LANDSCAPE]: state => assign({}, state, {
        landscape: !state.landscape,
    }),

    [PREVIEW_LOADED]: state => assign({}, state, {
        previewLoaded: true,
    }),

    [`${COLLECT_PAYMENT}_PENDING`]: state => assign({}, state, {
        checkingIfPaymentRequired: true,
    }),
    [`${COLLECT_PAYMENT}_FULFILLED`]: state => assign({}, state, {
        checkingIfPaymentRequired: false,
    }),
    [`${COLLECT_PAYMENT}_REJECTED`]: state => assign({}, state, {
        checkingIfPaymentRequired: false,
    }),
}, INITIAL_STATE);
