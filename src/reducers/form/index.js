import { reducer } from 'redux-form';
import accountEmail from './account_email';
import accountPassword from './account_password';
import forgotPassword from './forgot_password';
import productWizard, { plugin as productWizardPlugin } from './product_wizard';
import signUp from './sign_up';
import selectPlan from './select_plan';

export default reducer.plugin({
    accountEmail,
    accountPassword,
    forgotPassword,
    productWizard,
    signUp,
    selectPlan,
}).normalize({
    productWizard: productWizardPlugin,
});
