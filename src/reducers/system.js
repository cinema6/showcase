import { handleActions } from 'redux-actions';
import {
    GET_PAYMENT_PLANS,
} from '../actions/system';
import { assign } from 'lodash';

const INITIAL_STATE = {
    paymentPlans: null,
};

export default handleActions({
    [`${GET_PAYMENT_PLANS}_FULFILLED`]: (state, { payload: paymentPlanIds }) => assign({}, state, {
        paymentPlans: paymentPlanIds,
    }),
}, INITIAL_STATE);
