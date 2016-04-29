'use strict';

import { reducer } from 'redux-form';
import accountEmail from './account_email';
import accountPassword from './account_password';
import forgotPassword from './forgot_password';
import resetPassword from './reset_password';

export default reducer.plugin({
    accountEmail,
    accountPassword,
    forgotPassword,
    resetPassword
});
