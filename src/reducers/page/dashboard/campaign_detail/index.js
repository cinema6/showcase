'use strict';

import { handleActions } from 'redux-actions';
import {
    LOAD_PAGE_DATA
} from '../../../../actions/campaign_detail';
import { assign } from 'lodash';

const INITIAL_STATE = {
    loading         : true
};

export default handleActions({
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

