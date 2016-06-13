import { createUuid } from 'rc-uuid';
import {
    CHANGE_EMAIL_START,
    CHANGE_EMAIL_SUCCESS,
    CHANGE_EMAIL_FAILURE,

    CHANGE_PASSWORD_START,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,

    SIGN_UP_START,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,

    CONFIRM_START,
    CONFIRM_SUCCESS,
    CONFIRM_FAILURE,

    RESEND_CONFIRMATION_EMAIL_START,
    RESEND_CONFIRMATION_EMAIL_SUCCESS,
    RESEND_CONFIRMATION_EMAIL_FAILURE
} from '../../src/actions/user';
import { createAction } from 'redux-actions';
import { callAPI } from '../../src/actions/api';
import { format as formatURL } from 'url';
import { getThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

describe('user actions', function() {
    let realCreateDbActions, createDbActions;
    let actions;
    let changeEmail, changePassword, user, signUp, confirmUser, resendConfirmationEmail;

    beforeEach(function() {
        realCreateDbActions = require('../../src/utils/db').createDbActions;
        createDbActions = jasmine.createSpy('createDbActions()').and.callFake(realCreateDbActions);
        Object.keys(realCreateDbActions).forEach(key => createDbActions[key] = realCreateDbActions[key]);

        actions = proxyquire('../../src/actions/user', {
            '../utils/db': {
                createDbActions,

                __esModule: true
            },
            './api': {
                callAPI: require('../../src/actions/api').callAPI,

                __esModule: true
            }
        });
        changeEmail = actions.changeEmail;
        changePassword = actions.changePassword;
        user = actions.default;
        signUp = actions.signUp;
        confirmUser = actions.confirmUser;
        resendConfirmationEmail = actions.resendConfirmationEmail;
    });

    it('should create db actions for users', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'user',
            endpoint: '/api/account/users'
        });
        expect(user).toEqual(createDbActions.calls.mostRecent().returnValue);
    });

    describe('changeEmail({ id, email, password })', function() {
        let thunk;
        let id, email, password;

        beforeEach(function() {
            id = 'u-' + createUuid();
            email = 'new@email.com';
            password = 'banana';

            thunk = getThunk(changeEmail({ id, email, password }));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let state;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                state = {
                    db: {
                        user: {
                            [id]: {
                                id: id,
                                email: 'old@email.com'
                            }
                        }
                    }
                };

                dispatch = jasmine.createSpy('dispatch()').and.returnValue(Promise.resolve(undefined));
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should make an api call', function() {
                expect(dispatch).toHaveBeenCalledWith(callAPI({
                    endpoint: formatURL({
                        pathname: '/api/account/users/email',
                        query: { target: 'showcase' }
                    }),
                    method: 'POST',
                    types: [
                        CHANGE_EMAIL_START,
                        {
                            type: CHANGE_EMAIL_SUCCESS,
                            meta: { email, id }
                        },
                        {
                            type: CHANGE_EMAIL_FAILURE,
                            meta: { email, id }
                        }
                    ],
                    body: {
                        newEmail: email,
                        email: state.db.user[id].email,
                        password: password
                    }
                }));
            });

            it('should fulfill with the new email', function() {
                expect(success).toHaveBeenCalledWith(email);
            });

            describe('if the id is for an unknown user', function() {
                beforeEach(function(done) {
                    id = 'u-' + createUuid();
                    thunk = getThunk(changeEmail({ id, email, password }));
                    dispatch.calls.reset();

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should not make an API call', function() {
                    expect(dispatch.calls.count()).toBe(1);
                });

                it('should dispatch CHANGE_EMAIL_FAILURE', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_EMAIL_FAILURE)(new Error(`have no user with id: ${id}`)));
                });
            });
        });
    });

    describe('changePassword({ id, newPassword, oldPassword })', function() {
        let thunk;
        let id, newPassword, oldPassword;

        beforeEach(function() {
            id = 'u-' + createUuid();
            newPassword = 'Banana!';
            oldPassword = 'banana';

            thunk = getThunk(changePassword({ id, newPassword, oldPassword }));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let state;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                state = {
                    db: {
                        user: {
                            [id]: {
                                id: id,
                                email: 'old@email.com'
                            }
                        }
                    }
                };

                dispatch = jasmine.createSpy('dispatch()').and.returnValue(Promise.resolve(undefined));
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should make an api call', function() {
                expect(dispatch).toHaveBeenCalledWith(callAPI({
                    endpoint: formatURL({
                        pathname: '/api/account/users/password',
                        query: { target: 'showcase' }
                    }),
                    method: 'POST',
                    types: [CHANGE_PASSWORD_START, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE],
                    body: {
                        email: state.db.user[id].email,
                        password: oldPassword,
                        newPassword: newPassword
                    }
                }));
            });

            describe('if the id is for an unknown user', function() {
                beforeEach(function(done) {
                    id = 'u-' + createUuid();
                    thunk = getThunk(changePassword({ id, newPassword, oldPassword }));
                    dispatch.calls.reset();

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should not make an API call', function() {
                    expect(dispatch.calls.count()).toBe(1);
                });

                it('should dispatch CHANGE_EMAIL_FAILURE', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_PASSWORD_FAILURE)(new Error(`have no user with id: ${id}`)));
                });
            });
        });
    });

    describe('signUp(data)', function() {
        let data;
        let thunk, dispatch, getState, success, failure, state;

        beforeEach(function(done) {
            state = {
                form: {
                    signUp: {
                        _submitSucceeded: true
                    }
                }
            };
            data = {
                firstName: 'Foo',
                lastName: 'Bar',
                email: 'foo@bar.com',
                password: 'the-pass'
            };
            thunk = getThunk(signUp(data));
            dispatch = jasmine.createSpy('dispatch()').and.returnValue(Promise.resolve(undefined));
            getState = jasmine.createSpy('getState()').and.returnValue(state);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            thunk(dispatch, getState).then(success, failure);
            setTimeout(done);
        });

        it('should call the signup endpoint', function() {
            expect(dispatch).toHaveBeenCalledWith(callAPI({
                types: [SIGN_UP_START, SIGN_UP_SUCCESS, SIGN_UP_FAILURE],
                method: 'POST',
                endpoint: formatURL({
                    pathname: '/api/account/users/signup',
                    query: { target: 'showcase' }
                }),
                body: data
            }));
        });
    });

    describe('confirmUser({ id, token })', function() {
        let id, token;
        let result;

        beforeEach(function() {
            id = `u-${createUuid()}`;
            token = createUuid();

            result = confirmUser({ id, token });
        });

        it('should call the confirm endpoint', function() {
            expect(result).toEqual(callAPI({
                types: [CONFIRM_START, CONFIRM_SUCCESS, CONFIRM_FAILURE],
                method: 'POST',
                endpoint: formatURL({
                    pathname: `/api/account/users/confirm/${id}`,
                    query: { target: 'showcase' }
                }),
                body: { token }
            }));
        });
    });

    describe('resendConfirmationEmail()', function() {
        let result;

        beforeEach(function() {
            result = resendConfirmationEmail();
        });

        it('should call the resend activation email', function() {
            expect(result).toEqual(callAPI({
                types: [RESEND_CONFIRMATION_EMAIL_START, RESEND_CONFIRMATION_EMAIL_SUCCESS, RESEND_CONFIRMATION_EMAIL_FAILURE],
                method: 'POST',
                endpoint: formatURL({
                    pathname: '/api/account/users/resendActivation',
                    query: { target: 'showcase' }
                })
            }));
        });
    });
});
