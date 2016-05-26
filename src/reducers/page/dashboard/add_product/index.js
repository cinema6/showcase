import { handleActions } from 'redux-actions';
import { assign, defaults } from 'lodash';
import {
    PRODUCT_SELECTED,
    GO_TO_STEP,
    WIZARD_COMPLETE,
    PREVIEW_LOADED
} from '../../../../actions/product_wizard';
import * as TARGETING from '../../../../enums/targeting';

const DEFAULT_TARGETING = {
    age: [TARGETING.AGE.ALL],
    gender: TARGETING.GENDER.ALL
};

const INITIAL_STATE = {
    step: 0,
    previewLoaded: false,
    productData: null,
    targeting: DEFAULT_TARGETING
};

export default handleActions({
    [`${PRODUCT_SELECTED}_PENDING`]: state => assign({}, state, {
        previewLoaded: false,
        productData: null,
        targeting: DEFAULT_TARGETING
    }),
    [`${PRODUCT_SELECTED}_FULFILLED`]: (state, { payload: productData }) => assign({}, state, {
        step: 1,
        productData
    }),
    [GO_TO_STEP]: (state, { payload: step }) => assign({}, state, { step }),
    [WIZARD_COMPLETE]: (state, { payload: { productData, targeting } }) => assign({}, state, {
        productData: assign({}, state.productData, productData),
        targeting: defaults({}, targeting, DEFAULT_TARGETING)
    }),
    [PREVIEW_LOADED]: state => assign({}, state, {
        previewLoaded: true
    })
}, INITIAL_STATE);
