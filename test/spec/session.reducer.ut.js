import sessionReducer from '../../src/reducers/session';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS,
    LOGOUT_SUCCESS
} from '../../src/actions/auth';
import payment, { paymentMethod } from '../../src/actions/payment';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';
import { createUuid } from 'rc-uuid';

describe('sessionReducer()', function() {
    it('should return some initial state', function() {
        expect(sessionReducer(undefined, 'INIT')).toEqual({
            user: null,
            payments: [],
            paymentMethods: []
        });
    });

    describe('handling actions', function() {
        let state;
        let newState;

        beforeEach(function() {
            state = {
                user: null,

                payments: Array.apply([], new Array(5)).map(() => createUuid()),
                paymentMethods: Array.apply([], new Array(3)).map(() => createUuid())
            };
        });

        [LOGIN_SUCCESS, STATUS_CHECK_SUCCESS].forEach(ACTION => {
            describe(ACTION, function() {
                let user;

                beforeEach(function() {
                    user = {
                        id: 'u-' + createUuid(),
                        name: 'Johnny Testmonkey',
                        email: 'johnny@bananas.com'
                    };

                    newState = sessionReducer(state, createAction(ACTION)(user));
                });

                it('should add the user to the session', function() {
                    expect(newState).toEqual(assign({}, state, {
                        user: user.id
                    }));
                });
            });
        });

        describe(LOGOUT_SUCCESS, function() {
            beforeEach(function() {
                state.user = 'u-' + createUuid();

                newState = sessionReducer(state, createAction(LOGOUT_SUCCESS)());
            });

            it('should set the user to null', function() {
                expect(newState).toEqual(assign({}, state, {
                    user: null
                }));
            });
        });

        describe(payment.list.SUCCESS, function() {
            let payments;

            beforeEach(function() {
                payments = Array.apply([], new Array(7)).map(() => createUuid());

                newState = sessionReducer(state, createAction(payment.list.SUCCESS)(payments));
            });

            it('should update the payments', function() {
                expect(newState).toEqual(assign({}, state, {
                    payments
                }));
            });
        });

        describe(payment.create.SUCCESS, function() {
            let payments;

            beforeEach(function() {
                payments = [createUuid()];

                newState = sessionReducer(state, createAction(payment.create.SUCCESS)(payments));
            });

            it('should add the item to the payments', function() {
                expect(newState).toEqual(assign({}, state, {
                    payments: state.payments.concat(payments)
                }));
            });
        });

        describe(payment.remove.SUCCESS, function() {
            let payments;

            beforeEach(function() {
                payments = [state.payments[1]];

                newState = sessionReducer(state, createAction(payment.remove.SUCCESS)(payments));
            });

            it('should remove the items from its list', function() {
                expect(newState).toEqual(assign({}, state, {
                    payments: state.payments.filter(id => id !== payments[0])
                }));
            });
        });

        describe(paymentMethod.list.SUCCESS, function() {
            let paymentMethods;

            beforeEach(function() {
                paymentMethods = Array.apply([], new Array(3)).map(() => createUuid());

                newState = sessionReducer(state, createAction(paymentMethod.list.SUCCESS)(paymentMethods));
            });

            it('should update the paymentMethods', function() {
                expect(newState).toEqual(assign({}, state, {
                    paymentMethods
                }));
            });
        });

        describe(paymentMethod.create.SUCCESS, function() {
            let paymentMethods;

            beforeEach(function() {
                paymentMethods = [createUuid()];

                newState = sessionReducer(state, createAction(paymentMethod.create.SUCCESS)(paymentMethods));
            });

            it('should add the item to the paymentMethods', function() {
                expect(newState).toEqual(assign({}, state, {
                    paymentMethods: state.paymentMethods.concat(paymentMethods)
                }));
            });
        });

        describe(paymentMethod.remove.SUCCESS, function() {
            let paymentMethods;

            beforeEach(function() {
                paymentMethods = [state.paymentMethods[1]];

                newState = sessionReducer(state, createAction(paymentMethod.remove.SUCCESS)(paymentMethods));
            });

            it('should remove the paymentMethod from its list', function() {
                expect(newState).toEqual(assign({}, state, {
                    paymentMethods: state.paymentMethods.filter(id => id !== paymentMethods[0])
                }));
            });
        });
    });
});
