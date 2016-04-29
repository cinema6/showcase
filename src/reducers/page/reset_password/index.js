'use strict';

import { handleActions } from 'redux-actions';
import {
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE
} from '../../../actions/auth';
import { assign } from 'lodash';

const INITIAL_STATE = {
    submitSuccess: false
};

export default handleActions({
    [RESET_PASSWORD_SUCCESS]: state => assign({}, state, { submitSuccess: true }),
    [RESET_PASSWORD_FAILURE]: state => assign({}, state, { submitSuccess: false })
}, INITIAL_STATE);
