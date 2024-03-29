'use strict';

/* global process */

import thunk from 'redux-thunk';
import promisify from '../../src/middleware/promisify';
import rootReducer from '../../src/reducers';
import history from '../../src/history';
import { middleware as fsaThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

describe('configureStore(initialState)', function() {
    let configureStore;
    let redux, reactRouterRedux, reduxLogger, reduxPromiseMiddleware;

    function get() {
        return proxyquire('../../src/store/configure_store', {
            redux,
            'react-router-redux': reactRouterRedux,
            'redux-logger': reduxLogger,
            'redux-promise-middleware': reduxPromiseMiddleware,
            '_process': process,

            '../reducers': {
                default: require('../../src/reducers').default,

                __esModule: true
            },

            '../middleware/promisify': {
                default: require('../../src/middleware/promisify').default,

                __esModule: true
            },

            '../middleware/fsa_thunk': {
                middleware: fsaThunk,

                __esModule: true
            },

            'redux-thunk': {
                default: require('redux-thunk').default,

                __esModule: true
            },

            '../history': {
                default: history,

                __esModule: true
            }
        }).default;
    }

    beforeEach(function() {
        redux  = {
            createStore: jasmine.createSpy('createStore()').and.callFake(require('redux').createStore),
            applyMiddleware: jasmine.createSpy('applyMiddleware()').and.callFake(require('redux').applyMiddleware),

            __esModule: true
        };

        reactRouterRedux = {
            routerMiddleware: jasmine.createSpy('routerMiddleware()').and.callFake(require('react-router-redux').routerMiddleware),

            __esModule: true
        };

        reduxPromiseMiddleware = {
            default: jasmine.createSpy('promiseMiddleware()').and.callFake((module => module.__esModule ? module.default : module)(require('redux-promise-middleware'))),

            __esModule: true
        };

        reduxLogger = jasmine.createSpy('reduxLogger()').and.callFake(require('redux-logger'));

        configureStore = get();
    });

    it('should exist', function() {
        expect(configureStore).toEqual(jasmine.any(Function));
    });

    describe('when called', function() {
        let initialState;
        let result;

        beforeEach(function() {
            initialState = {};

            result = configureStore(initialState);
        });

        it('should configure routing middleware', function() {
            expect(reactRouterRedux.routerMiddleware).toHaveBeenCalledWith(history);
        });

        it('should configure logging middleware', function() {
            expect(reduxLogger).toHaveBeenCalledWith({
                duration: true,
                collapsed: true
            });
        });

        it('should configure promise middleware', function() {
            expect(reduxPromiseMiddleware.default).toHaveBeenCalledWith();
        });

        it('should configure a middleware stack', function() {
            expect(redux.applyMiddleware).toHaveBeenCalledWith(
                promisify,
                fsaThunk,
                thunk,
                reduxPromiseMiddleware.default.calls.mostRecent().returnValue,
                reactRouterRedux.routerMiddleware.calls.mostRecent().returnValue,
                reduxLogger.calls.mostRecent().returnValue
            );
        });

        it('should create a store', function() {
            expect(redux.createStore).toHaveBeenCalledWith(rootReducer, initialState, redux.applyMiddleware.calls.mostRecent().returnValue);
        });

        it('should return the store', function() {
            expect(result).toBe(redux.createStore.calls.mostRecent().returnValue);
        });

        describe('if in production', function() {
            beforeEach(function() {
                process.env.NODE_ENV = 'production';
                reduxLogger.calls.reset();
                redux.createStore.calls.reset();
                configureStore = get();

                result = configureStore(initialState);
            });

            it('should not include the logger middleware', function() {
                expect(reduxLogger).not.toHaveBeenCalled();
                expect(redux.applyMiddleware.calls.mostRecent().args.length).toBe(redux.applyMiddleware.calls.first().args.length - 1, 'Did not apply fewer middlewares.');
            });

            it('should create a return a store', function() {
                expect(redux.createStore).toHaveBeenCalledWith(rootReducer, initialState, redux.applyMiddleware.calls.mostRecent().returnValue);
                expect(result).toBe(redux.createStore.calls.mostRecent().returnValue);
            });
        });
    });
});
