import {
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from '../../src/actions/login';
import defer from 'promise-defer';
import {
    loginUser as authLoginUser
} from '../../src/actions/auth';
import {
    getCampaigns,
    getPaymentPlan
} from '../../src/actions/session';
import {
    trackLogin as intercomTrackLogin
} from '../../src/actions/intercom';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { replace } from 'react-router-redux';
import { getThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

describe('actions: login', function() {
    let authActions, sessionActions, intercomActions;
    let actions;
    let loginUser;

    beforeEach(function() {
        authActions = {
            loginUser: jasmine.createSpy('authLoginUser()').and.callFake(authLoginUser)
        };
        sessionActions = {
            getCampaigns: jasmine.createSpy('getCampaigns()').and.callFake(getCampaigns),
            getPaymentPlan
        };
        intercomActions = {
            trackLogin: jasmine.createSpy('intercomTrackLogin()').and.callFake(intercomTrackLogin)
        };

        actions = proxyquire('../../src/actions/login', {
            './auth': authActions,
            './session': sessionActions,
            './intercom': intercomActions
        });
        loginUser = actions.loginUser;
    });

    describe('loginUser({ email, password, redirect })', function() {
        let email, password, redirect;
        let thunk;

        beforeEach(function() {
            email = 'josh@reelcontent.com';
            password = 'banana';
            redirect = '/dashboard';

            thunk = getThunk(loginUser({ email, password, redirect }));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            let dispatch;
            let dispatchDeferred;

            beforeEach(function() {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

                thunk(dispatch);
            });

            it('should login the user', function() {
                expect(authActions.loginUser).toHaveBeenCalledWith({ email, password });
                expect(dispatch).toHaveBeenCalledWith(authActions.loginUser.calls.mostRecent().returnValue);
            });

            it('should dispatch a LOGIN_START action', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOGIN_START)());
            });

            describe('when the login', function() {
                describe('succeeds', function() {
                    let data;

                    beforeEach(function(done) {
                        data = {
                            id: 'u-' + createUuid()
                        };

                        dispatch.calls.reset();
                        dispatchDeferred.resolve(data);
                        setTimeout(done);

                        dispatch.and.returnValue((dispatchDeferred = defer()).promise);
                    });

                    it('should get the campaigns', function() {
                        expect(sessionActions.getCampaigns).toHaveBeenCalledWith();
                        expect(dispatch).toHaveBeenCalledWith(sessionActions.getCampaigns.calls.mostRecent().returnValue);
                    });

                    it('should get the paymentPlan', function() {
                        expect(dispatch).toHaveBeenCalledWith(getPaymentPlan());
                    });

                    describe('when the campaigns are fetched', function() {
                        beforeEach(function(done) {
                            dispatchDeferred.resolve([]);
                            setTimeout(done);

                            dispatch.calls.reset();
                            dispatch.and.callFake(action => Promise.resolve(action.payload));
                        });

                        it('should dispatch LOGIN_SUCCESS', function() {
                            expect(dispatch).toHaveBeenCalledWith(createAction(LOGIN_SUCCESS)(data));
                        });

                        it('should dispatch a transition to the redirect', function() {
                            expect(dispatch).toHaveBeenCalledWith(replace(redirect));
                        });

                        it('should dispatch an intercom login tracker', function() {
                            expect(dispatch).toHaveBeenCalledWith(intercomTrackLogin(data));
                        });
                    });

                    describe('if getting the campaigns fails', function() {
                        let reason;

                        beforeEach(function(done) {
                            reason = new Error('It failed!');
                            dispatchDeferred.reject(reason);
                            setTimeout(done);

                            dispatch.calls.reset();
                            dispatch.and.callFake(action => Promise.resolve(action.payload));
                        });

                        it('should dispatch LOGIN_SUCCESS', function() {
                            expect(dispatch).toHaveBeenCalledWith(createAction(LOGIN_SUCCESS)(data));
                        });

                        it('should dispatch a transition to the redirect', function() {
                            expect(dispatch).toHaveBeenCalledWith(replace(redirect));
                        });

                        it('should dispatch an intercom login tracker', function() {
                            expect(dispatch).toHaveBeenCalledWith(intercomTrackLogin(data));
                        });
                    });
                });

                describe('fails', function() {
                    let reason;

                    beforeEach(function(done) {
                        reason = new Error('It failed!');

                        dispatch.calls.reset();
                        dispatch.and.returnValue(Promise.resolve(undefined));

                        dispatchDeferred.reject(reason);
                        setTimeout(done);
                    });

                    it('should dispatch LOGIN_FAILURE', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(LOGIN_FAILURE)(reason));
                    });

                    it('should not transition', function() {
                        expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                            type: replace().type
                        }));
                    });

                    it('should not dispatch an intercom login tracker', function() {
                        expect(dispatch).not.toHaveBeenCalledWith(intercomTrackLogin(jasmine.any(Object)));
                    });
                });
            });
        });
    });
});
