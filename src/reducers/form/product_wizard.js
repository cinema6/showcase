'use strict';

import { handleActions } from 'redux-actions';
import {
    PRODUCT_SELECTED
} from '../../actions/product_wizard';

export default handleActions({
    [`${PRODUCT_SELECTED}_PENDING`]: () => undefined // Clear the form
});
