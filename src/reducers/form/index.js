import { reducer } from 'redux-form';
import accountEmail from './account_email';
import accountPassword from './account_password';
import forgotPassword from './forgot_password';
import productWizard, { plugin as productWizardPlugin } from './product_wizard';
import signUp from './sign_up';
import videoPreview from './video_preview';

export default reducer.plugin({
    accountEmail,
    accountPassword,
    forgotPassword,
    productWizard,
    signUp,
    videoPreview,
}).normalize({
    productWizard: productWizardPlugin,
});
