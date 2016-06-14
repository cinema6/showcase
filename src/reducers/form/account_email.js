import { assign } from 'lodash';
import { handleActions } from 'redux-actions';
import { CHANGE_EMAIL_SUCCESS } from '../../actions/account';

export default handleActions({
    [CHANGE_EMAIL_SUCCESS]: state => assign({}, state, {
        password: {},
    }),
});
