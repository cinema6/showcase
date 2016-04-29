'use strict';

import { handleActions } from 'redux-actions';
import {
    CHANGE_EMAIL_SUCCESS,
    CHANGE_EMAIL_FAILURE
} from '../../../../../actions/account';
import { assign } from 'lodash';

const INITIAL_STATE = {
    updateSuccess: false
};

export default handleActions({
    [CHANGE_EMAIL_SUCCESS]: state => assign({}, state, { updateSuccess: true }),
    [CHANGE_EMAIL_FAILURE]: state => assign({}, state, { updateSuccess: false })
}, INITIAL_STATE);
