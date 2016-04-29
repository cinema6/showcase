'use strict';

import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import promisify from '../../src/middleware/promisify';
import rootReducer from '../../src/reducers';
import { hashHistory } from 'react-router';

const proxyquire = require('proxyquire');

describe('configureStore(initialState)', function() {
    let configureStore;
    let redux, reactRouterRedux, reduxLogger;

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

        reduxLogger = jasmine.createSpy('reduxLogger()').and.callFake(require('redux-logger'));

        configureStore = proxyquire('../../src/store/configure_store', {
            redux,
            'react-router-redux': reactRouterRedux,
            'redux-logger': reduxLogger,

            '../reducers': {
                default: require('../../src/reducers').default,

                __esModule: true
            },

            '../middleware/promisify': {
                default: require('../../src/middleware/promisify').default,

                __esModule: true
            },

            'redux-api-middleware': {
                apiMiddleware: require('redux-api-middleware').apiMiddleware,

                __esModule: true
            },

            'redux-thunk': {
                default: require('redux-thunk').default,

                __esModule: true
            },

            'react-router': {
                hashHistory: require('react-router').hashHistory,

                __esModule: true
            }
        }).default;
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
            expect(reactRouterRedux.routerMiddleware).toHaveBeenCalledWith(hashHistory);
        });

        it('should configure logging middleware', function() {
            expect(reduxLogger).toHaveBeenCalledWith({
                duration: true,
                collapsed: true
            });
        });

        it('should configure a middleware stack', function() {
            expect(redux.applyMiddleware).toHaveBeenCalledWith(
                promisify,
                thunk,
                reactRouterRedux.routerMiddleware.calls.mostRecent().returnValue,
                apiMiddleware,
                reduxLogger.calls.mostRecent().returnValue
            );
        });

        it('should create a store', function() {
            expect(redux.createStore).toHaveBeenCalledWith(rootReducer, initialState, redux.applyMiddleware.calls.mostRecent().returnValue);
        });

        it('should return the store', function() {
            expect(result).toBe(redux.createStore.calls.mostRecent().returnValue);
        });
    });
});
