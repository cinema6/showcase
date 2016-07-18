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
import { dispatch } from '../helpers/stubs';
import { assign } from 'lodash';
import loader from '../../src/utils/loader';

const proxyquire = require('proxyquire');

describe('user actions', function() {
    let adwords, twitter, facebook;
    let realCreateDbActions, createDbActions;
    let actions;
    let changeEmail, changePassword, user, signUp, confirmUser, resendConfirmationEmail;

    beforeEach(function() {
        realCreateDbActions = require('../../src/utils/db').createDbActions;
        createDbActions = jasmine.createSpy('createDbActions()').and.callFake(realCreateDbActions);
        Object.keys(realCreateDbActions).forEach(key => createDbActions[key] = realCreateDbActions[key]);

        adwords = jasmine.createSpy('adwords()');
        twitter = {
            conversion: {
                trackPid: jasmine.createSpy('twttr.conversion.trackPid()')
            }
        };
        facebook = jasmine.createSpy('facebook()');

        spyOn(loader, 'load').and.callFake(name => {
            switch (name) {
            case 'adwords':
                return Promise.resolve(adwords);
            case 'twitter':
                return Promise.resolve(twitter);
            case 'facebook':
                return Promise.resolve(facebook);
            default:
                return Promise.reject(new Error(`Unknown: ${name}`));
            }
        });

        actions = proxyquire('../../src/actions/user', {
            '../utils/db': {
                createDbActions,

                __esModule: true
            },
            './api': {
                callAPI: require('../../src/actions/api').callAPI,

                __esModule: true
            },
            '../utils/loader': {
                default: loader,

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
        beforeEach(function() {
            this.data = {
                firstName: 'Foo',
                lastName: 'Bar',
                email: 'foo@bar.com',
                password: 'the-pass'
            };

            this.thunk = getThunk(signUp(this.data));
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            function getAPICall() {
                return callAPI({
                    types: [SIGN_UP_START, SIGN_UP_SUCCESS, SIGN_UP_FAILURE],
                    method: 'POST',
                    endpoint: formatURL({
                        pathname: '/api/account/users/signup',
                        query: { target: 'showcase' }
                    }),
                    body: this.data
                });
            }

            beforeEach(function(done) {
                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.returnValue({});

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);

                setTimeout(done);
            });

            it('should call the signup endpoint', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getAPICall.call(this));
            });

            describe('when the signup succeeds', function() {
                beforeEach(function(done) {
                    this.response = assign({}, this.data, {
                        id: `u-${createUuid()}`,
                        created: new Date().toISOString()
                    });

                    this.dispatch.getDeferred(getAPICall.call(this)).resolve(this.response);

                    setTimeout(done);
                });

                it('should track the adwords conversion', function() {
                    expect(adwords).toHaveBeenCalledWith({
                        google_conversion_id: 926037221,
                        google_conversion_language: 'en',
                        google_conversion_format: '3',
                        google_conversion_color: 'ffffff',
                        google_conversion_label: 'L5MhCKO_m2cQ5enIuQM',
                        google_remarketing_only: false
                    });
                });

                it('should track the twitter conversion', function() {
                    expect(twitter.conversion.trackPid).toHaveBeenCalledWith('nv3ie', {
                        tw_sale_amount: 0,
                        tw_order_quantity: 0
                    });
                });

                it('should track the facebook conversion', function() {
                    expect(facebook).toHaveBeenCalledWith('track', 'CompleteRegistration');
                });

                it('should fulfill with the response', function() {
                    expect(this.success).toHaveBeenCalledWith(this.response);
                });
            });

            describe('if loading external dependencies fails', function() {
                beforeEach(function(done) {
                    loader.load.and.returnValue(Promise.reject(new Error('Failed to load!')));

                    this.response = assign({}, this.data, {
                        id: `u-${createUuid()}`,
                        created: new Date().toISOString()
                    });

                    this.dispatch.getDeferred(getAPICall.call(this)).resolve(this.response);

                    setTimeout(done);
                });

                it('should fulfill with the response', function() {
                    expect(this.success).toHaveBeenCalledWith(this.response);
                });
            });
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
