'use strict';

import { reducer } from 'redux-form';
import accountEmail from './account_email';
import accountPassword from './account_password';
import forgotPassword from './forgot_password';
import resetPassword from './reset_password';
import productWizard, { plugin as productWizardPlugin } from './product_wizard';
import signUp from './sign_up';

export default reducer.plugin({
    accountEmail,
    accountPassword,
    forgotPassword,
    resetPassword,
    productWizard,
    signUp
}).normalize({
    productWizard: productWizardPlugin
});
