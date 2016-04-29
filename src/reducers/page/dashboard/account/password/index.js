'use strict';

import { handleActions } from 'redux-actions';
import {
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE
} from '../../../../../actions/account';
import { assign } from 'lodash';

const INITIAL_STATE = {
    updateSuccess: false
};

export default handleActions({
    [CHANGE_PASSWORD_SUCCESS]: state => assign({}, state, { updateSuccess: true }),
    [CHANGE_PASSWORD_FAILURE]: state => assign({}, state, { updateSuccess: false })
}, INITIAL_STATE);
