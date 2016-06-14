import { handleActions } from 'redux-actions';
import {
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,
} from '../../../actions/auth';
import { assign } from 'lodash';

const INITIAL_STATE = {
    submitSuccess: false,
};

export default handleActions({
    [FORGOT_PASSWORD_SUCCESS]: state => assign({}, state, { submitSuccess: true }),
    [FORGOT_PASSWORD_FAILURE]: state => assign({}, state, { submitSuccess: false }),
}, INITIAL_STATE);
