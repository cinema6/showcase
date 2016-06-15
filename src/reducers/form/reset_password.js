import { handleActions } from 'redux-actions';
import { RESET_PASSWORD_SUCCESS } from '../../actions/auth';

export default handleActions({
    [RESET_PASSWORD_SUCCESS]: () => undefined,
});
