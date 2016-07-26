import { handleActions } from 'redux-actions';
import { assign } from 'lodash';
import {
    GO_TO_STEP,
    LOAD_CAMPAIGN,
    SHOW_VIDEO_MODAL,
} from '../../../../actions/product_wizard';

const INITIAL_STATE = {
    step: 1,
    previewLoaded: true,
    loading: false,
    showVideoModal: false,
};

export default handleActions({
    [GO_TO_STEP]: (state, { payload: step }) => assign({}, state, { step }),

    [SHOW_VIDEO_MODAL]: (state, { payload: visible }) => assign({}, state, {
        showVideoModal: visible,
    }),

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
