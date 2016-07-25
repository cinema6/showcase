import {
    GET_PAYMENTS,
    GET_PAYMENT_METHODS,
    LOAD_PAGE_DATA,
    SHOW_CHANGE_MODAL,
    CHANGE_PAYMENT_METHOD
} from '../../src/actions/billing';
import { createAction } from 'redux-actions';
import { assign, find } from 'lodash';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import { getThunk, createThunk } from '../../src/middleware/fsa_thunk';
import { getBillingPeriod, getPaymentPlan } from '../../src/actions/session';

const proxyquire = require('proxyquire');

describe('billing actions', function() {
    let actions;
    let getPayments, getPaymentMethods, loadPageData, showChangeModal, changePaymentMethod;
    let paymentActions;

    beforeEach(function() {
        paymentActions = require('../../src/actions/payment');

        actions = proxyquire('../../src/actions/billing', {
            './payment': paymentActions,
            './session': {
                getBillingPeriod,
                getPaymentPlan,

                __esModule: true
            }
        });
        getPayments = actions.getPayments;
        getPaymentMethods = actions.getPaymentMethods;
        loadPageData = actions.loadPageData;
        showChangeModal = actions.showChangeModal;
        changePaymentMethod = actions.changePaymentMethod;
    });

    describe('getPayments()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(getPayments());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                spyOn(paymentActions.default, 'list').and.callThrough();

                dispatch = jasmine.createSpy('dispatch()').and.returnValue(new Promise(() => {}));
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should get a list of payments', function() {
                expect(paymentActions.default.list).toHaveBeenCalledWith();
                expect(dispatch).toHaveBeenCalledWith(paymentActions.default.list.calls.all()[0].returnValue);
            });

            it('should dispatch GET_PAYMENTS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(GET_PAYMENTS)(dispatch.calls.all()[0].returnValue));
            });
        });
    });

    describe('getPaymentMethods()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(getPaymentMethods());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                spyOn(paymentActions.paymentMethod, 'list').and.callThrough();

                dispatch = jasmine.createSpy('dispatch()').and.returnValue(new Promise(() => {}));
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should get a list of payment methods', function() {
                expect(paymentActions.paymentMethod.list).toHaveBeenCalledWith();
                expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.list.calls.all()[0].returnValue);
            });

            it('should dispatch GET_PAYMENT_METHODS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(GET_PAYMENT_METHODS)(dispatch.calls.all()[0].returnValue));
            });
        });
    });

    describe('loadPageData()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(loadPageData());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                spyOn(paymentActions.paymentMethod, 'list').and.callThrough();
                spyOn(paymentActions.default, 'list').and.callThrough();

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) { return getThunk(action)(dispatch, getState); }

                    return new Promise(() => {});
                });
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should get payments', function() {
                expect(dispatch).toHaveBeenCalledWith(getPayments());
            });

            it('should get payment methods', function() {
                expect(dispatch).toHaveBeenCalledWith(getPaymentMethods());
            });

            it('should getBillingPeriod()', function() {
                expect(dispatch).toHaveBeenCalledWith(getBillingPeriod());
            });

            it('should getPaymentPlan()', function() {
                expect(dispatch).toHaveBeenCalledWith(getPaymentPlan());
            });

            it('should dispatch LOAD_PAGE_DATA', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOAD_PAGE_DATA)(jasmine.any(Promise)));
            });
        });
    });

    describe('showChangeModal()', function() {
        it('should dispatch an action', function() {
            expect(showChangeModal(true)).toEqual(createAction(SHOW_CHANGE_MODAL)(true));
            expect(showChangeModal(false)).toEqual(createAction(SHOW_CHANGE_MODAL)(false));
        });
    });

    describe('changePaymentMethod(newMethod)', function() {
        let newMethod;
        let thunk;

        beforeEach(function() {
            newMethod = {
                cardholderName: 'Foo',
                nonce: createUuid()
            };

            thunk = getThunk(changePaymentMethod(newMethod));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferred, actionDeferred, state;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                state = {
                    db: {
                        paymentMethod: Array.apply([], new Array(4)).reduce(result => {
                            const method = {
                                token: createUuid(),
                                default: false,
                                last4: '2034',
                                type: 'creditCard'
                            };

                            result[method.token] = method;

                            return result;
                        }, {})
                    }
                };
                state.db.paymentMethod[Object.keys(state.db.paymentMethod)[2]].default = true;

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) {
                        return (dispatchDeferred = defer()).promise;
                    } else {
                        return (actionDeferred = defer()).promise;
                    }
                });
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(paymentActions.paymentMethod, 'create').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should create a new paymentMethod', function() {
                expect(paymentActions.paymentMethod.create).toHaveBeenCalledWith({ data: { cardholderName: newMethod.cardholderName, paymentMethodNonce: newMethod.nonce, makeDefault: true } });
                expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.create.calls.mostRecent().returnValue);
            });

            it('should dispatch CHANGE_PAYMENT_METHOD', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_PAYMENT_METHOD)(jasmine.any(Promise)));
            });

            describe('if creating the payment method fails', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('403 - Forbidden');
                    reason.response = 'Something went really wrong.';

                    actionDeferred.reject({ reason, action: dispatch.calls.all()[0].args[0] });
                    setTimeout(done);
                });

                it('should reject with a plain error for the message', function() {
                    expect(failure).toHaveBeenCalledWith(new Error(reason.response));
                });
            });

            describe('when the new paymentMethod has been created', function() {
                let oldMethod, token, method;

                beforeEach(function(done) {
                    oldMethod = find(state.db.paymentMethod, { default: true });

                    token = createUuid();
                    method = assign({}, newMethod, {
                        token
                    });
                    oldMethod.default = false;
                    state.db.paymentMethod[token] = method;

                    spyOn(paymentActions.paymentMethod, 'remove').and.callThrough();

                    dispatchDeferred.resolve(newMethod);
                    setTimeout(done);

                    dispatch.calls.reset();
                    dispatch.and.returnValue((dispatchDeferred = defer()).promise);
                });

                it('should remove the old paymentMethod', function() {
                    expect(paymentActions.paymentMethod.remove).toHaveBeenCalledWith({ id: oldMethod.token });
                    expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.remove.calls.mostRecent().returnValue);
                });

                describe('when the old payment method has been removed', function() {
                    beforeEach(function(done) {
                        spyOn(paymentActions.paymentMethod, 'list').and.callThrough();

                        dispatchDeferred.resolve([oldMethod.token]);
                        setTimeout(done);

                        dispatch.calls.reset();
                        dispatch.and.returnValue((dispatchDeferred = defer()).promise);
                    });

                    it('should get all of the payment methods', function() {
                        expect(paymentActions.paymentMethod.list).toHaveBeenCalledWith();
                        expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.list.calls.mostRecent().returnValue);
                    });

                    describe('when the list has been fetched', function() {
                        beforeEach(function(done) {
                            dispatchDeferred.resolve(Object.keys(state.db.paymentMethod));
                            setTimeout(done);

                            dispatch.calls.reset();
                            dispatch.and.returnValue((dispatchDeferred = defer()).promise);
                        });

                        it('should close the modal', function() {
                            expect(dispatch).toHaveBeenCalledWith(showChangeModal(false));
                        });
                    });
                });
            });
        });
    });
});
