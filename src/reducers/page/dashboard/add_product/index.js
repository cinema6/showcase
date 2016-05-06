import { handleActions } from 'redux-actions';
import { assign } from 'lodash';
import {
    PRODUCT_SELECTED,
    PRODUCT_EDITED,
    TARGETING_EDITED,
    GO_TO_STEP
} from '../../../../actions/product_wizard';
import * as TARGETING from '../../../../enums/targeting';

const DEFAULT_TARGETING = {
    age: TARGETING.AGE.ALL,
    gender: TARGETING.GENDER.ALL
};

const INITIAL_STATE = {
    step: 0,
    productData: null,
    targeting: DEFAULT_TARGETING
};

export default handleActions({
    [`${PRODUCT_SELECTED}_PENDING`]: state => assign({}, state, {
        productData: null,
        targeting: DEFAULT_TARGETING
    }),
    [`${PRODUCT_SELECTED}_FULFILLED`]: (state, { payload: productData }) => assign({}, state, {
        step: 1,
        productData
    }),
    [PRODUCT_EDITED]: (state, { payload: productData }) => assign({}, state, {
        step: 2,
        productData: assign({}, state.productData, productData)
    }),
    [TARGETING_EDITED]: (state, { payload: targeting }) => assign({}, state, {
        step: 3,
        targeting: assign({}, state.targeting, targeting)
    }),
    [GO_TO_STEP]: (state, { payload: step }) => assign({}, state, { step })
}, INITIAL_STATE);
