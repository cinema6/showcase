import { createPageReducer } from '../../utils/page';
import dashboardReducer from './dashboard';
import dashboardAccountProfileReducer from './dashboard/account/profile';
import dashboardAccountEmailReducer from './dashboard/account/email';
import dashboardAccountPasswordReducer from './dashboard/account/password';
import forgotPasswordReducer from './forgot_password';
import resetPasswordReducer from './reset_password';
import dashboardBillingReducer from './dashboard/billing';
import dashboardAddProductReducer from './dashboard/add_product';

export default createPageReducer({
    'forgot_password': forgotPasswordReducer,
    'reset_password': resetPasswordReducer,

    'dashboard': dashboardReducer,

    'dashboard.account.profile': dashboardAccountProfileReducer,
    'dashboard.account.email': dashboardAccountEmailReducer,
    'dashboard.account.password': dashboardAccountPasswordReducer,

    'dashboard.billing': dashboardBillingReducer,

    'dashboard.add_product': dashboardAddProductReducer
});
