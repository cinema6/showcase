import { createDbActions } from '../utils/db';
import { callAPI } from './api';

function prefix(type) {
    return `ORG/${type}`;
}

export default createDbActions({
    type: 'org',
    endpoint: '/api/account/orgs',
});

export const CHANGE_PAYMENT_PLAN_START = prefix('CHANGE_PAYMENT_PLAN_START');
export const CHANGE_PAYMENT_PLAN_SUCCESS = prefix('CHANGE_PAYMENT_PLAN_SUCCESS');
export const CHANGE_PAYMENT_PLAN_FAILURE = prefix('CHANGE_PAYMENT_PLAN_FAILURE');
export const changePaymentPlan = ({
    orgId,
    paymentPlanId,
}) => callAPI({
    method: 'POST',
    endpoint: `/api/account/orgs/${orgId}/payment-plan`,
    types: [
        CHANGE_PAYMENT_PLAN_START,
        CHANGE_PAYMENT_PLAN_SUCCESS,
        CHANGE_PAYMENT_PLAN_FAILURE,
    ],
    body: {
        id: paymentPlanId,
    },
});

export const GET_PAYMENT_PLAN_STATUS_START = prefix('GET_PAYMENT_PLAN_STATUS_START');
export const GET_PAYMENT_PLAN_STATUS_SUCCESS = prefix('GET_PAYMENT_PLAN_STATUS_SUCCESS');
export const GET_PAYMENT_PLAN_STATUS_FAILURE = prefix('GET_PAYMENT_PLAN_STATUS_FAILURE');
export const getPaymentPlanStatus = ({ orgId }) => callAPI({
    method: 'GET',
    endpoint: `/api/account/orgs/${orgId}/payment-plan`,
    types: [
        GET_PAYMENT_PLAN_STATUS_START,
        GET_PAYMENT_PLAN_STATUS_SUCCESS,
        GET_PAYMENT_PLAN_STATUS_FAILURE,
    ],
});
