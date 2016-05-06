'use strict';

import { assign } from 'lodash';
import { handleActions } from 'redux-actions';
import {
    SHOW_NAV,
    TOGGLE_NAV
} from '../../../actions/dashboard';
import {
    LOCATION_CHANGE
} from 'react-router-redux';

const INITIAL_STATE = {
    showNav: false
};

export default handleActions({
    [SHOW_NAV]: (state, { payload: showNav }) => assign({}, state, {
        showNav
    }),
    [TOGGLE_NAV]: state => assign({}, state, {
        showNav: !state.showNav
    }),
    [LOCATION_CHANGE]: state => assign({}, state, {
        showNav: false
    })
}, INITIAL_STATE);
