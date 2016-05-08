import configureStore from 'redux-mock-store';
import defer from 'promise-defer';
import { createUuid } from 'rc-uuid';

const proxyquire = require('proxyquire');

describe('utils/auth', function() {
    let auth;
    let createProtectedRouteEnterHandler, createLoginEnterHandler;
    let checkAuthStatus;

    beforeEach(function() {
        checkAuthStatus = jasmine.createSpy('checkAuthStatus()').and.callFake(require('../../src/actions/auth').checkAuthStatus);

        auth = proxyquire('../../src/utils/auth', {
            '../actions/auth': {
                checkAuthStatus: checkAuthStatus,

                __esModule: true
            }
        });

        createProtectedRouteEnterHandler = auth.createProtectedRouteEnterHandler;
        createLoginEnterHandler = auth.createLoginEnterHandler;
    });

    describe('createProtectedRouteEnterHandler(store, loginPath)', function() {
        let store, loginPath;
        let result;

        beforeEach(function() {
            store = configureStore([])({});
            loginPath = '/login';

            result = createProtectedRouteEnterHandler(store, loginPath);
        });

        it('should return a Function', function() {
            expect(result).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            let nextState, localReplace, callback;
            let dispatchDeferred;

            beforeEach(function() {
                nextState = {
                    location: {
                        pathname: '/dashboard'
                    },
                    routes: [],
                    params: {},
                    components: []
                };
                localReplace = jasmine.createSpy('redirect()');
                callback = jasmine.createSpy('callback()');

                spyOn(store, 'dispatch').and.returnValue((dispatchDeferred = defer()).promise);

                result(nextState, localReplace, callback);
            });

            it('should check the auth status', function() {
                expect(checkAuthStatus).toHaveBeenCalledWith();
                expect(store.dispatch).toHaveBeenCalledWith(checkAuthStatus.calls.mostRecent().returnValue);
            });

            describe('if the auth check suceeds', function() {
                let data;

                beforeEach(function(done) {
                    data = {
                        id: 'u-' + createUuid()
                    };

                    store.dispatch.calls.reset();
                    store.dispatch.and.returnValue(Promise.resolve());

                    dispatchDeferred.resolve(data);
                    setTimeout(done, 0);
                });

                it('should not redirect', function() {
                    expect(localReplace).not.toHaveBeenCalled();
                });

                it('should callback', function() {
                    expect(callback).toHaveBeenCalledWith();
                });
            });

            describe('if the auth check fails', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('I failed!');

                    store.dispatch.calls.reset();
                    store.dispatch.and.returnValue(Promise.resolve());

                    dispatchDeferred.reject(reason);
                    setTimeout(done, 0);
                });

                it('should redirect to the login page', function() {
                    expect(localReplace).toHaveBeenCalledWith(loginPath);
                });

                it('should callback', function() {
                    expect(callback).toHaveBeenCalledWith();
                });
            });
        });
    });

    describe('createLoginEnterHandler()', function() {
        let store, dashboardPath;
        let result;

        beforeEach(function() {
            store = configureStore([])({});
            dashboardPath = '/dashboard';

            result = createLoginEnterHandler(store, dashboardPath);
        });

        it('should return a Function', function() {
            expect(result).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            let nextState, localReplace, callback;
            let dispatchDeferred;

            beforeEach(function() {
                nextState = {
                    location: {
                        pathname: '/login'
                    },
                    routes: [],
                    params: {},
                    components: []
                };
                localReplace = jasmine.createSpy('redirect()');
                callback = jasmine.createSpy('callback()');

                spyOn(store, 'dispatch').and.returnValue((dispatchDeferred = defer()).promise);

                result(nextState, localReplace, callback);
            });

            it('should check the auth status', function() {
                expect(checkAuthStatus).toHaveBeenCalledWith();
                expect(store.dispatch).toHaveBeenCalledWith(checkAuthStatus.calls.mostRecent().returnValue);
            });

            describe('if the auth check suceeds', function() {
                let data;

                beforeEach(function(done) {
                    data = {
                        id: 'u-' + createUuid()
                    };

                    store.dispatch.calls.reset();
                    store.dispatch.and.returnValue(Promise.resolve());

                    dispatchDeferred.resolve(data);
                    setTimeout(done, 0);
                });

                it('should redirect to the dashboard page', function() {
                    expect(localReplace).toHaveBeenCalledWith(dashboardPath);
                });

                it('should callback', function() {
                    expect(callback).toHaveBeenCalledWith();
                });
            });

            describe('if the auth check fails', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('I failed!');

                    store.dispatch.calls.reset();
                    store.dispatch.and.returnValue(Promise.resolve());

                    dispatchDeferred.reject(reason);
                    setTimeout(done, 0);
                });

                it('should not redirect', function() {
                    expect(localReplace).not.toHaveBeenCalled();
                });

                it('should callback', function() {
                    expect(callback).toHaveBeenCalledWith();
                });
            });
        });
    });
});
