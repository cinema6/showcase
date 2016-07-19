'use strict';

import pageReducer from '../../src/reducers/page';
import { createPageReducer } from '../../src/utils/page';
import { pageWillMount } from '../../src/actions/page';
import dashboardReducer from '../../src/reducers/page/dashboard';
import dashboardAccountProfileReducer from '../../src/reducers/page/dashboard/account/profile';
import dashboardAccountEmailReducer from '../../src/reducers/page/dashboard/account/email';
import dashboardAccountPasswordReducer from '../../src/reducers/page/dashboard/account/password';
import forgotPasswordReducer from '../../src/reducers/page/forgot_password';
import dashboardBillingReducer from '../../src/reducers/page/dashboard/billing';
import dashboardAddProductReducer from '../../src/reducers/page/dashboard/add_product';
import resendConfirmationReducer from '../../src/reducers/page/resend_confirmation';
import dashboardEditProductReducer from '../../src/reducers/page/dashboard/edit_product';

describe('pageReducer()', function() {
    let exampleReducer;
    let pageMap;
    let expected, state;

    function getActiveState(reducer) {
        return Object.keys(pageMap)
            .reduce((state, path) => reducer(state, pageWillMount({ pagePath: path })), undefined);
    }

    beforeEach(function() {
        pageMap = {
            'forgot_password': forgotPasswordReducer,

            'resend_confirmation': resendConfirmationReducer,

            'dashboard': dashboardReducer,

            'dashboard.account.profile': dashboardAccountProfileReducer,
            'dashboard.account.email': dashboardAccountEmailReducer,
            'dashboard.account.password': dashboardAccountPasswordReducer,

            'dashboard.billing': dashboardBillingReducer,

            'dashboard.add_product': dashboardAddProductReducer,
            'dashboard.edit_product': dashboardEditProductReducer
        };
        exampleReducer = createPageReducer(pageMap);

        expected = getActiveState(exampleReducer);
        state = getActiveState(pageReducer);
    });

    it('should return some initial state', function() {
        expect(state).toEqual(expected);
    });
});
