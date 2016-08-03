import { createThunk } from '../middleware/fsa_thunk';
import { createAction } from 'redux-actions';
import paymentPlan from './payment_plan';

function prefix(type) {
    return `SYSTEM/${type}`;
}

export const GET_PAYMENT_PLANS = prefix('GET_PAYMENT_PLANS');
export const getPaymentPlans = createThunk(() => (dispatch, getState) => (
    dispatch(createAction(GET_PAYMENT_PLANS)(Promise.resolve().then(() => (
        getState().system.paymentPlans || dispatch(paymentPlan.list())
    )))).then(({ value }) => value).catch(({ reason }) => Promise.reject(reason))
));
