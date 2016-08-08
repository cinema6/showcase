import {
    getPaymentPlans,

    GET_PAYMENT_PLANS
} from '../../src/actions/system';
import { getThunk } from '../../src/middleware/fsa_thunk';
import { dispatch as createDispatch } from '../helpers/stubs';
import { createAction } from 'redux-actions';
import paymentPlan from '../../src/actions/payment_plan';
import { createUuid } from 'rc-uuid';
import { assign, cloneDeep as clone } from 'lodash';

describe('system actions', () => {
    describe('getPaymentPlans()', () => {
        let thunk;

        beforeEach(() => {
            thunk = getThunk(getPaymentPlans());
        });

        afterEach(() => {
            thunk = null;
        });

        it('should be a thunk', () => {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', () => {
            let state;
            let dispatch;
            let getState;

            let success;
            let failure;

            beforeEach(done => {
                state = {
                    system: {
                        paymentPlans: null
                    },
                    db: {
                        paymentPlan: {}
                    }
                };

                getState = jasmine.createSpy('getState()').and.callFake(() => clone(state));
                dispatch = createDispatch();

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            afterEach(() => {
                state = null;
                dispatch = null;
                getState = null;

                success = null;
                failure = null;
            });

            it('should dispatch GET_PAYMENT_PLANS', () => {
                expect(dispatch).toHaveBeenCalledWith(createAction(GET_PAYMENT_PLANS)(jasmine.any(Promise)));
            });

            it('should get all payment plans', () => {
                expect(dispatch).toHaveBeenCalledWith(paymentPlan.list());
            });

            describe('when the payment plans are fetched', () => {
                let paymentPlanIds;

                beforeEach(done => {
                    paymentPlanIds = Array.apply([], new Array(4)).map(() => createUuid());

                    dispatch.getDeferred(paymentPlan.list()).resolve(paymentPlanIds);
                    setTimeout(done);
                });

                afterEach(() => {
                    paymentPlanIds = null;
                });

                it('should fulfill with the ids', () => {
                    expect(success).toHaveBeenCalledWith(paymentPlanIds);
                });
            });

            describe('if there is a problem', () => {
                let reason;

                beforeEach(done => {
                    reason = new Error('I failed!');
                    dispatch.getDeferred(paymentPlan.list()).reject(reason);
                    setTimeout(done);
                });

                afterEach(() => {
                    reason = null;
                });

                it('should reject with the reason', () => {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });

            describe('if the payment plans have been fetched', () => {
                let paymentPlans;

                beforeEach(done => {
                    paymentPlans = Array.apply([], new Array(4)).map(() => ({
                        id: `pp-${createUuid()}`
                    }));
                    state.system.paymentPlans = paymentPlans.map(plan => plan.id);
                    state.db.paymentPlan = paymentPlans.reduce((cache, plan) => assign(cache, {
                        [plan.id]: plan
                    }), {});

                    dispatch.calls.reset();
                    failure.calls.reset();
                    success.calls.reset();
                    failure.calls.reset();

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                afterEach(() => {
                    paymentPlans = null;
                });

                it('should not get the paymentPlans', () => {
                    expect(dispatch).not.toHaveBeenCalledWith(paymentPlan.list());
                });

                it('should fulfill with the paymentPlans', () => {
                    expect(success).toHaveBeenCalledWith(paymentPlans);
                });
            });
        });
    });
});
