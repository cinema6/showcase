import { handleActions } from 'redux-actions';
import {
    SHOW_CHANGE_MODAL,
    LOAD_PAGE_DATA,
    SHOW_PLAN_MODAL,
    CHANGE_PAYMENT_PLAN,
} from '../../../../actions/billing';
import { assign } from 'lodash';

const INITIAL_STATE = {
    showChangeModal: false,
    showPlanModal: false,
    loading: false,
    changingPlan: false,
};

export default handleActions({
    [SHOW_CHANGE_MODAL]: (state, { payload: visible }) => assign({}, state, {
        showChangeModal: visible,
    }),
    [SHOW_PLAN_MODAL]: (state, { payload: visible }) => assign({}, state, {
        showPlanModal: visible,
    }),

    [`${CHANGE_PAYMENT_PLAN}_PENDING`]: state => assign({}, state, {
        changingPlan: true,
    }),
    [`${CHANGE_PAYMENT_PLAN}_FULFILLED`]: state => assign({}, state, {
        changingPlan: false,
    }),
    [`${CHANGE_PAYMENT_PLAN}_REJECTED`]: state => assign({}, state, {
        changingPlan: false,
    }),

    [`${LOAD_PAGE_DATA}_PENDING`]: state => assign({}, state, {
        loading: true,
    }),
    [`${LOAD_PAGE_DATA}_FULFILLED`]: state => assign({}, state, {
        loading: false,
    }),
    [`${LOAD_PAGE_DATA}_REJECTED`]: state => assign({}, state, {
        loading: false,
    }),
}, INITIAL_STATE);
