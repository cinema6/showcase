import { handleActions } from 'redux-actions';
import { assign } from 'lodash';
import {
    RESEND_CONFIRMATION_EMAIL_START,
    RESEND_CONFIRMATION_EMAIL_SUCCESS,
    RESEND_CONFIRMATION_EMAIL_FAILURE,
} from '../../../actions/user';

const INITIAL_STATE = {
    sending: false,
    success: false,
    error: null,
};

export default handleActions({
    [RESEND_CONFIRMATION_EMAIL_START]: state => assign({}, state, {
        success: false,
        error: null,
        sending: true,
    }),
    [RESEND_CONFIRMATION_EMAIL_SUCCESS]: state => assign({}, state, {
        sending: false,
        success: true,
    }),
    [RESEND_CONFIRMATION_EMAIL_FAILURE]: (state, { payload: error }) => assign({}, state, {
        sending: false,
        error,
    }),
}, INITIAL_STATE);
