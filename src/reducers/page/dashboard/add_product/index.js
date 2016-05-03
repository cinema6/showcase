import { handleActions } from 'redux-actions';
import { assign } from 'lodash';
import {
    PRODUCT_SELECTED
} from '../../../../actions/product_wizard';

const INITIAL_STATE = {
    step: 0,
    productData: null
};

export default handleActions({
    [`${PRODUCT_SELECTED}_FULFILLED`]: (state, { payload: productData }) => assign({}, state, {
        step: 1,
        productData
    })
}, INITIAL_STATE);
