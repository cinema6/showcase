const proxyquire = require('proxyquire');

describe('paymentPlan actions', function() {
    beforeEach(function() {
        this.createDbActions = (createDbActions => jasmine.createSpy('createDbActions()').and.callFake(createDbActions))(require('../../src/utils/db').createDbActions);
        this.actions = proxyquire('../../src/actions/payment_plan', {
            '../utils/db': {
                createDbActions: this.createDbActions,

                __esModule: true
            }
        });
        this.paymentPlan = this.actions.default;
    });

    it('should create db actions for paymentPlans', function() {
        expect(this.createDbActions).toHaveBeenCalledWith({
            type: 'paymentPlan',
            endpoint: '/api/payment-plans'
        });
        expect(this.paymentPlan).toEqual(this.createDbActions.calls.mostRecent().returnValue);
    });
});
