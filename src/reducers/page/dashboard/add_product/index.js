import { handleActions } from 'redux-actions';
import { assign } from 'lodash';
import {
    PRODUCT_SELECTED,
    PRODUCT_EDITED
} from '../../../../actions/product_wizard';

const INITIAL_STATE = {
    step: 0,
    productData: null
};

export default handleActions({
    [`${PRODUCT_SELECTED}_PENDING`]: state => assign({}, state, {
        productData: null
    }),
    [`${PRODUCT_SELECTED}_FULFILLED`]: (state, { payload: productData }) => assign({}, state, {
        step: 1,
        productData
    }),
    [PRODUCT_EDITED]: (state, { payload: productData }) => assign({}, state, {
        step: 2,
        productData: assign({}, state.productData, productData)
    })
}, INITIAL_STATE);
