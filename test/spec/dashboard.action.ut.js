import defer from 'promise-defer';
import {
    logoutUser,
    showNav,
    toggleNav,
    checkIfPaymentMethodRequired
} from '../../src/actions/dashboard';
import { logoutUser as authLogoutUser } from '../../src/actions/auth';
import { intercomTrackLogout } from '../../src/actions/intercom';
import { createAction } from 'redux-actions';
import {
    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    SHOW_NAV,
    TOGGLE_NAV,
    CHECK_IF_PAYMENT_METHOD_REQUIRED
} from '../../src/actions/dashboard';
import { replace } from 'react-router-redux';
import { getThunk } from '../../src/middleware/fsa_thunk';
import { dispatch } from '../helpers/stubs';
import { paymentMethod } from '../../src/actions/payment';
import { getOrg } from '../../src/actions/session';
import { createUuid } from 'rc-uuid';
import { assign, pick } from 'lodash';
import { addNotification } from '../../src/actions/notification';
import moment from 'moment';
import { TYPE as NOTIFICATION } from '../../src/enums/notification';
import React from 'react';
import { Link } from 'react-router';

describe('dashboard actions', function() {
    describe('logoutUser()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(logoutUser());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            let dispatch, getState;
            let dispatchDeferred;
            let success, failure;

            beforeEach(function(done) {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should dispatch LOGOUT_START', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_START)());
            });

            it('should logout the user', function() {
                expect(dispatch).toHaveBeenCalledWith(authLogoutUser());
            });

            describe('when logging out succeeds', function() {
                beforeEach(function(done) {
                    dispatch.calls.reset();
                    dispatch.and.returnValue(Promise.resolve(undefined));

                    dispatchDeferred.resolve(null);
                    setTimeout(done);
                });

                it('should dispatch LOGOUT_SUCCESS', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_SUCCESS)(null));
                });

                it('should redirect to the homepage', function() {
                    expect(dispatch).toHaveBeenCalledWith(replace('/login'));
                });

                it('should dispath intercomTrackLogout', function() {
                    expect(dispatch).toHaveBeenCalledWith(intercomTrackLogout());
                });

                it('should fulfill to undefined', function() {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('when logging out fails', function() {
                let reason;

                beforeEach(function(done) {
                    dispatch.calls.reset();
                    dispatch.and.returnValue(Promise.resolve(undefined));

                    reason = new Error('Something went wrong.');
                    dispatchDeferred.reject(reason);

                    setTimeout(done);
                });

                it('should dispatch LOGOUT_FAILURE', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_FAILURE)(reason));
                });

                it('should reject the promise', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });
        });
    });

    describe('showNav(show)', function() {
        let result;

        beforeEach(function() {
            result = showNav(true);
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(SHOW_NAV)(true));
        });
    });

    describe('toggleNav()', function() {
        let result;

        beforeEach(function() {
            result = toggleNav();
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(TOGGLE_NAV)());
        });
    });

    describe('checkIfPaymentMethodRequired()', function() {
        beforeEach(function() {
            this.thunk = getThunk(checkIfPaymentMethodRequired());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.state = {
                    db: {
                        org: {},
                        paymentMethod: {}
                    }
                };
                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.callFake(() => this.state);

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should dispatch() CHECK_IF_PAYMENT_METHOD_REQUIRED', function() {
                expect(this.dispatch).toHaveBeenCalledWith({
                    type: CHECK_IF_PAYMENT_METHOD_REQUIRED,
                    payload: jasmine.any(Promise)
                });
            });

            it('should get all the payment methods', function() {
                expect(this.dispatch).toHaveBeenCalledWith(paymentMethod.list());
            });

            describe('if the payment methods cannot be fetched', function() {
                beforeEach(function(done) {
                    this.reason = new Error('I failed to fetch the stuff you wanted.');
                    this.dispatch.getDeferred(paymentMethod.list()).reject(this.reason);
                    setTimeout(done);
                });

                it('should reject the promise', function() {
                    expect(this.failure).toHaveBeenCalledWith(this.reason);
                });
            });

            describe('if the user has a payment method', function() {
                beforeEach(function(done) {
                    this.paymentMethod = {
                        token: createUuid(),
                        last4: '5780'
                    };
                    this.state = assign({}, this.state, {
                        db: assign({}, this.state.db, {
                            paymentMethod: assign({}, this.state.db.paymentMethod, {
                                [this.paymentMethod.token]: this.paymentMethod
                            })
                        })
                    });
                    this.dispatch.getDeferred(paymentMethod.list()).resolve([this.paymentMethod.token]);
                    setTimeout(done);
                });

                it('should not get the user\'s org', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(getOrg());
                });

                it('should fulfill the promise', function() {
                    expect(this.success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('if the user has no payment method', function() {
                beforeEach(function(done) {
                    this.dispatch.getDeferred(paymentMethod.list()).resolve([]);
                    setTimeout(done);
                });

                it('should get the org', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(getOrg());
                });

                describe('if the org cannot be fetched', function() {
                    beforeEach(function(done) {
                        this.reason = new Error('I failed to fetch the thing you wanted.');
                        this.dispatch.getDeferred(getOrg()).reject(this.reason);
                        setTimeout(done);
                    });

                    it('should reject the promise', function() {
                        expect(this.failure).toHaveBeenCalledWith(this.reason);
                    });
                });

                describe('if the org', function() {
                    beforeEach(function() {
                        this.org = {
                            id: `o-${createUuid()}`
                        };
                        this.state = assign({}, this.state, {
                            db: assign({}, this.state.db, {
                                org: assign({}, this.state.db.org, {
                                    [this.org.id]: this.org
                                })
                            })
                        });
                    });

                    describe('has no paymentPlanStart', function() {
                        beforeEach(function(done) {
                            delete this.org.paymentPlanStart;

                            this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                            setTimeout(done);
                        });

                        it('should not show a notification', function() {
                            expect(this.dispatch).not.toHaveBeenCalledWith(addNotification(jasmine.any(Object)));
                        });

                        it('should fulfill with undefined', function() {
                            expect(this.success).toHaveBeenCalledWith(undefined);
                        });
                    });

                    describe('has a paymentPlanStart in the future', function() {
                        beforeEach(function(done) {
                            this.org.paymentPlanStart = moment().add(5, 'days').format();

                            this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                            setTimeout(done);
                        });

                        it('should not show a notification', function() {
                            expect(this.dispatch).not.toHaveBeenCalledWith(addNotification(jasmine.any(Object)));
                        });

                        it('should fulfill with undefined', function() {
                            expect(this.success).toHaveBeenCalledWith(undefined);
                        });
                    });

                    describe('has a paymentPlanStart in the past', function() {
                        beforeEach(function(done) {
                            this.org.paymentPlanStart = moment().subtract(5, 'days').format();

                            this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                            setTimeout(done);
                        });

                        it('should show a notification', function() {
                            expect(this.dispatch).toHaveBeenCalledWith(jasmine.objectContaining(pick(addNotification({
                                type: NOTIFICATION.WARNING,
                                message: <span>Your trial period has expired. Please <Link to="/dashboard/billing">add a payment method</Link> to continue your service.</span>
                            }), ['type', 'message'])));
                        });

                        it('should fulfill with undefined', function() {
                            expect(this.success).toHaveBeenCalledWith(undefined);
                        });
                    });
                });
            });
        });
    });
});
