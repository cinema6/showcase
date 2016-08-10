const proxyquire = require('proxyquire');

import { createUuid } from 'rc-uuid';
import { callAPI } from '../../src/actions/api';
import {
    changePaymentPlan,
    getPaymentPlanStatus,

    CHANGE_PAYMENT_PLAN_START,
    CHANGE_PAYMENT_PLAN_SUCCESS,
    CHANGE_PAYMENT_PLAN_FAILURE,

    GET_PAYMENT_PLAN_STATUS_START,
    GET_PAYMENT_PLAN_STATUS_SUCCESS,
    GET_PAYMENT_PLAN_STATUS_FAILURE
} from '../../src/actions/org';

describe('org actions', function() {
    let realCreateDbActions, createDbActions;
    let actions;
    let org;

    beforeEach(function() {
        realCreateDbActions = require('../../src/utils/db').createDbActions;
        createDbActions = jasmine.createSpy('createDbActions()').and.callFake(realCreateDbActions);
        Object.keys(realCreateDbActions).forEach(key => createDbActions[key] = realCreateDbActions[key]);

        actions = proxyquire('../../src/actions/org', {
            '../utils/db': {
                createDbActions,

                __esModule: true
            },
            './api': {
                callAPI: require('../../src/actions/api').callAPI,

                __esModule: true
            }
        });
        org = actions.default;
    });

    it('should create db actions for orgs', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'org',
            endpoint: '/api/account/orgs'
        });
        expect(org).toEqual(createDbActions.calls.mostRecent().returnValue);
    });

    describe('changePaymentPlan({ orgId, paymentPlanId })', () => {
        let orgId;
        let paymentPlanId;

        beforeEach(() => {
            orgId = `o-${createUuid()}`;
            paymentPlanId = `pp-${createUuid()}`;
        });

        afterEach(() => {
            orgId = null;
            paymentPlanId = null;
        });

        it('should call the API', () => {
            expect(changePaymentPlan({ orgId, paymentPlanId })).toEqual(callAPI({
                method: 'POST',
                endpoint: `/api/account/orgs/${orgId}/payment-plan`,
                types: [CHANGE_PAYMENT_PLAN_START, CHANGE_PAYMENT_PLAN_SUCCESS, CHANGE_PAYMENT_PLAN_FAILURE],
                body: {
                    id: paymentPlanId
                }
            }));
        });
    });

    describe('getPaymentPlanStatus({ orgId })', () => {
        let orgId;

        beforeEach(() => {
            orgId = `o-${createUuid()}`;
        });

        afterEach(() => {
            orgId = null;
        });

        it('should call the API', () => {
            expect(getPaymentPlanStatus({ orgId })).toEqual(callAPI({
                method: 'GET',
                endpoint: `/api/account/orgs/${orgId}/payment-plan`,
                types: [GET_PAYMENT_PLAN_STATUS_START, GET_PAYMENT_PLAN_STATUS_SUCCESS, GET_PAYMENT_PLAN_STATUS_FAILURE]
            }));
        });
    });
});
