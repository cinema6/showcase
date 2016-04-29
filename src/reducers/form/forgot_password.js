'use strict';

import { handleActions } from 'redux-actions';
import { FORGOT_PASSWORD_SUCCESS } from '../../actions/auth';

export default handleActions({
    [FORGOT_PASSWORD_SUCCESS]: () => undefined
});
