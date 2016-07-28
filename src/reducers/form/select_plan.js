import { handleActions } from 'redux-actions';
import {
    WIZARD_DESTROYED,
} from '../../actions/product_wizard';
import {
    LOAD_PAGE_DATA,
} from '../../actions/billing';

export default handleActions({
    [WIZARD_DESTROYED]: () => undefined,
    [`${LOAD_PAGE_DATA}_PENDING`]: () => undefined,
});
