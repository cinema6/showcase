'use strict';

import { reducer } from 'redux-form';
import accountEmailReducer from '../../src/reducers/form/account_email';
import accountPasswordReducer from '../../src/reducers/form/account_password';
import forgotPasswordReducer from '../../src/reducers/form/forgot_password';
import productWizardReducer, { plugin as productWizardPlugin } from '../../src/reducers/form/product_wizard';
import signUpReducer from '../../src/reducers/form/sign_up';
import formReducer from '../../src/reducers/form';

describe('formReducer()', function() {
    it('should return intial state as a redux-form plugin', function() {
        expect(formReducer(undefined, 'init')).toEqual(reducer.plugin({
            accountEmail: accountEmailReducer,
            accountPassword: accountPasswordReducer,
            forgotPassword: forgotPasswordReducer,
            productWizard: productWizardReducer,
            signUp: signUpReducer
        }).normalize({
            productWizard: productWizardPlugin
        })(undefined, 'init'));
    });
});
