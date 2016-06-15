import { handleActions } from 'redux-actions';
import { assign, every } from 'lodash';
import {
    SIGN_UP_START,
    SIGN_UP_SUCCESS,
} from '../../actions/user';

const INITIAL_STATE = {
    _submitSucceeded: false,
};

const handler = handleActions({
    [SIGN_UP_START]: state => assign({}, state, { _submitSucceeded: false }),
    [SIGN_UP_SUCCESS]: () => ({
        _submitSucceeded: true,
        _submitFailed: false,
        _submitting: false,
    }),
});

export default function signUpReducer(state, action) {
    let transformedState = state;

    if (!every(INITIAL_STATE, (value, key) => key in state)) {
        transformedState = assign({}, state, INITIAL_STATE);
    }

    return handler(transformedState, action);
}
