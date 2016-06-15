import { handleActions } from 'redux-actions';
import { CHANGE_PASSWORD_SUCCESS } from '../../actions/account';

export default handleActions({
    [CHANGE_PASSWORD_SUCCESS]: () => undefined,
});
