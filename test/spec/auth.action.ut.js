import {
    checkAuthStatus,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
} from '../../src/actions/auth';
import {
    STATUS_CHECK_START,
    STATUS_CHECK_SUCCESS,
    STATUS_CHECK_FAILURE,

    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,

    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,

    FORGOT_PASSWORD_START,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,

    RESET_PASSWORD_START,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE
} from '../../src/actions/auth';
import {
    callAPI
} from '../../src/actions/api';
import {
    trackLogin as intercomTrackLogin
} from '../../src/actions/intercom';
import { createUuid } from 'rc-uuid';
import { format as formatURL } from 'url';
import { getThunk } from '../../src/middleware/fsa_thunk';
import defer from 'promise-defer';

describe('actions: auth', function() {
    describe('checkAuthStatus()', function() {
        let result;

        beforeEach(function() {
            result = getThunk(checkAuthStatus());
        });

        it('should return a thunk', function() {
            expect(result).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            let dispatch, getState;
            let callResult;
            let user, userDeferred;

            beforeEach(function() {
                user = {
                    id: 'u-' + createUuid()
                };
                userDeferred = defer();
                dispatch = jasmine.createSpy('dispatch()').and.returnValue(userDeferred.promise);
                getState = jasmine.createSpy('getState()').and.returnValue({
                    session: {
                        user: null
                    }
                });

                callResult = result(dispatch, getState);
            });

            it('should dispatch an api call', function() {
                expect(dispatch).toHaveBeenCalledWith(callAPI({
                    endpoint: '/api/auth/status',
                    types: [STATUS_CHECK_START, STATUS_CHECK_SUCCESS, STATUS_CHECK_FAILURE]
                }));
            });

            describe('when the user is returned', function() {
                beforeEach(function(done) {
                    userDeferred.resolve(user);

                    setTimeout(done);
                });

                it('should track via intercom', function() {
                    expect(dispatch).toHaveBeenCalledWith(intercomTrackLogin(user));
                });
            });

            describe('when the user is not returned', function() {
                beforeEach(function(done) {
                    userDeferred.reject();

                    setTimeout(done);
                });

                it('should not track via intercom', function() {
                    expect(dispatch).not.toHaveBeenCalledWith(intercomTrackLogin(user));
                });
            });

            describe('if there is a logged-in user', function() {
                let user;

                beforeEach(function() {
                    user = {
                        id: 'u-' + createUuid()
                    };

                    getState.and.returnValue({
                        session: {
                            user: user.id
                        },
                        db: {
                            user: {
                                [user.id]: user
                            }
                        }
                    });
                    dispatch.calls.reset();

                    callResult = result(dispatch, getState);
                });

                it('should not dispatch anything', function() {
                    expect(dispatch).not.toHaveBeenCalled();
                });

                it('should return the user', function() {
                    expect(callResult).toBe(user);
                });
            });
        });
    });

    describe('loginUser({ email, password })', function() {
        let email, password;
        let result;

        beforeEach(function() {
            email = 'josh@reelcontent.com';
            password = 'banana';

            result = loginUser({ email, password });
        });

        it('should return an RSAA', function() {
            expect(result).toEqual(callAPI({
                endpoint: formatURL({
                    pathname: '/api/auth/login',
                    query: { target: 'showcase' }
                }),
                method: 'POST',
                types: [LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE],
                body: { email, password }
            }));
        });
    });

    describe('logoutUser()', function() {
        let result;

        beforeEach(function() {
            result = logoutUser();
        });

        it('should call the api to logout the user', function() {
            expect(result).toEqual(callAPI({
                endpoint: '/api/auth/logout',
                method: 'POST',
                types: [LOGOUT_START, LOGOUT_SUCCESS, LOGOUT_FAILURE]
            }));
        });
    });

    describe('forgotPassword({ email })', function() {
        let email;
        let result;

        beforeEach(function() {
            email = 'user@reelcontent.com';

            result = forgotPassword({ email });
        });

        it('should call the api to logout the user', function() {
            expect(result).toEqual(callAPI({
                endpoint: formatURL({
                    pathname: '/api/auth/password/forgot',
                    query: { target: 'showcase' }
                }),
                method: 'POST',
                types: [FORGOT_PASSWORD_START, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE],
                body: { email, target: 'bob' }
            }));
        });
    });

    describe('resetPassword({ id, token, newPassword })', function() {
        let id, token, newPassword;
        let result;

        beforeEach(function() {
            id = 'u-' + createUuid();
            token = createUuid();
            newPassword = 'banana2';

            result = resetPassword({ id, token, newPassword });
        });

        it('should call the api to logout the user', function() {
            expect(result).toEqual(callAPI({
                endpoint: formatURL({
                    pathname: '/api/auth/password/reset',
                    query: { target: 'showcase' }
                }),
                method: 'POST',
                types: [RESET_PASSWORD_START, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE],
                body: { id, token, newPassword }
            }));
        });
    });
});
