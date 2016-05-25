'use strict';

import { pick, includes, reject, isEqual, isArray } from 'lodash';
import { handleActions } from 'redux-actions';
import {
    PRODUCT_SELECTED,
    WIZARD_DESTROYED
} from '../../actions/product_wizard';
import * as TARGETING from '../../enums/targeting';

export default handleActions({
    // Clear every form field but the search field when a new product
    // is selected.
    [`${PRODUCT_SELECTED}_PENDING`]: state => pick(state, ['search']),

    // Clear the form when the wizard is destroyed
    [WIZARD_DESTROYED]: () => undefined
});

export const plugin = {
    age(value, previousValue) {
        if (!isArray(value) || isEqual(value, previousValue)) { return value; }

        if (includes(value, TARGETING.AGE.ALL) || value.length < 1) {
            if (value[0] === TARGETING.AGE.ALL) {
                return reject(value, option => option === TARGETING.AGE.ALL);
            } else {
                return [TARGETING.AGE.ALL];
            }
        }

        return value;
    }
};
