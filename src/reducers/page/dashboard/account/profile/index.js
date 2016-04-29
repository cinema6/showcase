'use strict';

import { handleActions } from 'redux-actions';
import {
    UPDATE_SUCCESS,
    UPDATE_FAILURE
} from '../../../../../actions/account';
import { assign } from 'lodash';

const INITIAL_STATE = {
    updateSuccess: false
};

export default handleActions({
    [UPDATE_SUCCESS]: state => assign({}, state, { updateSuccess: true }),
    [UPDATE_FAILURE]: state => assign({}, state, { updateSuccess: false })
}, INITIAL_STATE);
