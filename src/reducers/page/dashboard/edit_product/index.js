import { handleActions } from 'redux-actions';
import { assign } from 'lodash';
import {
    GO_TO_STEP,
    LOAD_CAMPAIGN,
    TOGGLE_LANDSCAPE,
} from '../../../../actions/product_wizard';

const INITIAL_STATE = {
    step: 1,
    previewLoaded: true,
    loading: false,
    landscape: false,
};

export default handleActions({
    [GO_TO_STEP]: (state, { payload: step }) => assign({}, state, { step }),

    [TOGGLE_LANDSCAPE]: (state, { payload: landscape }) => assign({}, state, { landscape }),

    [`${LOAD_CAMPAIGN}_PENDING`]: state => assign({}, state, {
        loading: true,
    }),
    [`${LOAD_CAMPAIGN}_FULFILLED`]: state => assign({}, state, {
        loading: false,
    }),
    [`${LOAD_CAMPAIGN}_REJECTED`]: state => assign({}, state, {
        loading: false,
    }),
}, INITIAL_STATE);
