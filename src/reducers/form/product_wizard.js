'use strict';

import { pick } from 'lodash';
import { handleActions } from 'redux-actions';
import {
    PRODUCT_SELECTED,
    WIZARD_DESTROYED
} from '../../actions/product_wizard';

export default handleActions({
    // Clear every form field but the search field when a new product
    // is selected.
    [`${PRODUCT_SELECTED}_PENDING`]: state => pick(state, ['search']),

    // Clear the form when the wizard is destroyed
    [WIZARD_DESTROYED]: () => undefined
});
