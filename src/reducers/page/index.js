import { createPageReducer } from '../../utils/page';
import dashboardAccountProfileReducer from './dashboard/account/profile';
import dashboardAccountEmailReducer from './dashboard/account/email';
import dashboardAccountPasswordReducer from './dashboard/account/password';
import forgotPasswordReducer from './forgot_password';
import resetPasswordReducer from './reset_password';
import dashboardBillingReducer from './dashboard/billing';

export default createPageReducer({
    'forgot_password': forgotPasswordReducer,
    'reset_password': resetPasswordReducer,

    'dashboard.account.profile': dashboardAccountProfileReducer,
    'dashboard.account.email': dashboardAccountEmailReducer,
    'dashboard.account.password': dashboardAccountPasswordReducer,

    'dashboard.billing': dashboardBillingReducer
});
