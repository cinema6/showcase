import { createDbActions } from '../utils/db';

export default createDbActions({
    type: 'paymentPlan',
    endpoint: '/api/payment-plans',
});
