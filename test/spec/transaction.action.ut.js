import {
    getCurrentPayment,

    GET_CURRENT_PAYMENT_START,
    GET_CURRENT_PAYMENT_SUCCESS,
    GET_CURRENT_PAYMENT_FAILURE
} from '../../src/actions/transaction';
import { callAPI } from '../../src/actions/api';

describe('transaction actions', function() {
    describe('getCurrentPayment()', function() {
        beforeEach(function() {
            this.result = getCurrentPayment();
        });

        it('should return a callAPI() action', function() {
            expect(this.result).toEqual(callAPI({
                method: 'GET',
                types: [GET_CURRENT_PAYMENT_START, GET_CURRENT_PAYMENT_SUCCESS, GET_CURRENT_PAYMENT_FAILURE],
                endpoint: '/api/transactions/showcase/current-payment'
            }));
        });
    });
});
