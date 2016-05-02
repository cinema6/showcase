import { callAPI } from '../../src/actions/api';
import {
    GET_CLIENT_TOKEN_START,
    GET_CLIENT_TOKEN_SUCCESS,
    GET_CLIENT_TOKEN_FAILURE
} from '../../src/actions/payment';

const proxyquire = require('proxyquire');

describe('payment actions', function() {
    let realCreateDbActions, createDbActions;
    let actions;
    let payment, paymentMethod, getClientToken;

    beforeEach(function() {
        realCreateDbActions = require('../../src/utils/db').createDbActions;
        createDbActions = jasmine.createSpy('createDbActions()').and.callFake(realCreateDbActions);
        Object.keys(realCreateDbActions).forEach(key => createDbActions[key] = realCreateDbActions[key]);

        actions = proxyquire('../../src/actions/payment', {
            '../utils/db': {
                createDbActions,

                __esModule: true
            },
            './api': {
                callAPI: require('../../src/actions/api').callAPI,

                __esModule: true
            }
        });
        payment = actions.default;
        paymentMethod = actions.paymentMethod;
        getClientToken = actions.getClientToken;
    });

    it('should create db actions for payments', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'payment',
            endpoint: '/api/payments'
        });
        expect(payment).toEqual(createDbActions.calls.all()[0].returnValue);
    });

    it('should create db actions for payment methods', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'paymentMethod',
            endpoint: '/api/payments/methods',
            key: 'token'
        });
        expect(paymentMethod).toBe(createDbActions.calls.all()[1].returnValue);
    });

    describe('getClientToken()', function() {
        let result;

        beforeEach(function() {
            result = getClientToken();
        });

        it('should call the api for the token', function() {
            expect(result).toEqual(callAPI({
                types: [GET_CLIENT_TOKEN_START, GET_CLIENT_TOKEN_SUCCESS, GET_CLIENT_TOKEN_FAILURE],
                endpoint: '/api/payments/clientToken'
            }));
        });
    });
});
