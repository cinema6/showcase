'use strict';

import defer from 'promise-defer';
import { confirmUser } from '../../src/actions/user';
import { notify } from '../../src/actions/notification';
import {
    CONFIRM_ACCOUNT
} from '../../src/actions/confirm_account';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { replace } from 'react-router-redux';
import { TYPE as NOTIFICATION_TYPE } from '../../src/enums/notification';

const proxyquire = require('proxyquire');

describe('confirm account actions', function() {
    let userActions, notificationActions;
    let actions;
    let confirmAccount;

    beforeEach(function() {
        userActions = {
            confirmUser: jasmine.createSpy('confirmUser()').and.callFake(confirmUser),

            __esModule: true
        };
        notificationActions = {
            notify: jasmine.createSpy('notify()').and.callFake(notify),

            __esModule: true
        };

        actions = proxyquire('../../src/actions/confirm_account', {
            './user': userActions,
            './notification': notificationActions
        });
        confirmAccount = actions.confirmAccount;
    });

    describe('confirmAccount({ id, token })', function() {
        let id, token;
        let thunk;

        beforeEach(function() {
            id = `u-${createUuid()}`;
            token = createUuid();

            thunk = confirmAccount({ id, token });
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferred;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should dispatch a call to confirmUser()', function() {
                expect(userActions.confirmUser).toHaveBeenCalledWith({ id, token });
                expect(dispatch.calls.all()[0].args[0]).toBe(userActions.confirmUser.calls.mostRecent().returnValue);
            });

            it('should dispatch CONFIRM_ACCOUNT', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CONFIRM_ACCOUNT)(dispatch.calls.all()[0].returnValue));
            });

            describe('when the account is confirmed', function() {
                let user;

                beforeEach(function(done) {
                    user = { id: `u-${createUuid()}` };
                    dispatchDeferred.resolve({ value: user });
                    dispatch.calls.reset();

                    setTimeout(done);
                });

                it('should redirect to the login page', function() {
                    expect(dispatch).toHaveBeenCalledWith(replace('/login'));
                });

                it('should display a success message', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION_TYPE.SUCCESS,
                        message: 'Your account has been confirmed! Please log in.',
                        time: 10000
                    });
                    expect(dispatch.calls.all()[1].args[0]).toBe(notificationActions.notify.calls.mostRecent().returnValue);
                });

                it('should fulfill with the user', function() {
                    expect(success).toHaveBeenCalledWith(user);
                });
            });

            describe('if there is a problem', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('Something went wrong!');
                    dispatchDeferred.reject({ reason });
                    dispatch.calls.reset();

                    setTimeout(done);
                });

                it('should redirect to the login page', function() {
                    expect(dispatch).toHaveBeenCalledWith(replace('/login'));
                });

                it('should display an error message', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION_TYPE.DANGER,
                        message: 'Failed to confirm your account. Please log in again to resend a confirmation email.',
                        time: 30000
                    });
                    expect(dispatch.calls.all()[1].args[0]).toBe(notificationActions.notify.calls.mostRecent().returnValue);
                });

                it('should reject with the reason', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });
        });
    });
});
