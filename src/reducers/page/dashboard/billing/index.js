'use strict';

import { handleActions } from 'redux-actions';
import {
    SHOW_CHANGE_MODAL,
    LOAD_PAGE_DATA
} from '../../../../actions/billing';
import { assign } from 'lodash';

const INITIAL_STATE = {
    showChangeModal: false,
    loading: false
};

export default handleActions({
    [SHOW_CHANGE_MODAL]: (state, { payload: visible }) => assign({}, state, {
        showChangeModal: visible
    }),

    [`${LOAD_PAGE_DATA}_PENDING`]: state => assign({}, state, {
        loading: true
    }),
    [`${LOAD_PAGE_DATA}_FULFILLED`]: state => assign({}, state, {
        loading: false
    }),
    [`${LOAD_PAGE_DATA}_REJECTED`]: state => assign({}, state, {
        loading: false
    })
}, INITIAL_STATE);
