'use strict';

import { Route, IndexRoute } from 'react-router';
import { find } from 'lodash';
import { createStore } from 'redux';
import { getCampaigns } from '../../src/actions/session';
import { notify } from '../../src/actions/notification';
import defer from 'promise-defer';
import { createUuid } from 'rc-uuid';
import { TYPE as NOTIFICATION_TYPE } from '../../src/enums/notification';

const proxyquire = require('proxyquire');

describe('createRoutes(store)', function() {
    let sessionActions, notificationActions;
    let createRoutes;

    beforeEach(function() {
        sessionActions = {
            getCampaigns: jasmine.createSpy('getCampaigns()').and.callFake(getCampaigns)
        };
        notificationActions = {
            notify: jasmine.createSpy('notify()').and.callFake(notify)
        };

        createRoutes = proxyquire('../../src/create_routes', {
            'react-router': {
                Route, IndexRoute
            },

            './actions/session': sessionActions,
            './actions/notification': notificationActions
        }).default;
    });

    it('should exist', function() {
        expect(createRoutes).toEqual(jasmine.any(Function));
    });

    describe('when called', function() {
        let store;
        let result;

        beforeEach(function() {
            store = createStore(() => ({}));

            result = createRoutes(store);
        });

        it('should return some routes', function() {
            expect(result.type).toBe(Route);
        });

        describe('the dashboard', function() {
            let dashboard;

            beforeEach(function() {
                dashboard = find(result.props.children, route => route.props.path === 'dashboard');
            });

            describe('children:', function() {
                let children;

                beforeEach(function() {
                    children = dashboard.props.children;
                });

                describe('index', function() {
                    let index;

                    beforeEach(function() {
                        index = find(children, route => route.type === IndexRoute);
                    });

                    it('should exist', function() {
                        expect(index).toEqual(jasmine.any(Object));
                    });

                    describe('onEnter()', function() {
                        let onEnter;
                        let dispatchDeferred;
                        let routerState, replace, callback;

                        beforeEach(function(done) {
                            onEnter = index.props.onEnter;

                            routerState = {};
                            replace = jasmine.createSpy('replace()');
                            callback = jasmine.createSpy('callback()');

                            spyOn(store, 'dispatch').and.returnValue((dispatchDeferred = defer()).promise);

                            onEnter(routerState, replace, callback);
                            setTimeout(done);
                        });

                        it('should getCampaigns()', function() {
                            expect(sessionActions.getCampaigns).toHaveBeenCalledWith();
                            expect(store.dispatch).toHaveBeenCalledWith(sessionActions.getCampaigns.calls.mostRecent().returnValue);
                        });

                        describe('when the campaigns are fetched', function() {
                            describe('and there are none', function() {
                                beforeEach(function(done) {
                                    dispatchDeferred.resolve([]);
                                    setTimeout(done);
                                });

                                it('should go to the /add-product state', function() {
                                    expect(replace).toHaveBeenCalledWith('/dashboard/add-product');
                                    expect(callback).toHaveBeenCalledWith();
                                });
                            });

                            describe('and there is one', function() {
                                let campaign;

                                beforeEach(function(done) {
                                    campaign = `cam-${createUuid()}`;
                                    dispatchDeferred.resolve([campaign]);
                                    setTimeout(done);
                                });

                                it('should go to the /campaigns/:campaignId state', function() {
                                    expect(replace).toHaveBeenCalledWith(`/dashboard/campaigns/${campaign}`);
                                    expect(callback).toHaveBeenCalledWith();
                                });
                            });
                        });

                        describe('if the campaigns cannot be fetched', function() {
                            let reason;

                            beforeEach(function(done) {
                                reason = new Error('There was a problem!');
                                dispatchDeferred.reject(reason);
                                setTimeout(done);
                            });

                            it('should show an error notification', function() {
                                expect(notificationActions.notify).toHaveBeenCalledWith({
                                    type: NOTIFICATION_TYPE.DANGER,
                                    message: `Unexpected error: ${reason.message}`,
                                    time: 10000
                                });
                                expect(store.dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                                expect(callback).toHaveBeenCalledWith();
                            });
                        });
                    });
                });

                describe('add-product', function() {
                    let addProduct;

                    beforeEach(function() {
                        addProduct = find(children, route => route.props.path === 'add-product');
                    });

                    it('should exist', function() {
                        expect(addProduct).toEqual(jasmine.any(Object));
                    });

                    describe('onEnter()', function() {
                        let onEnter;
                        let dispatchDeferred;
                        let routerState, replace, callback;

                        beforeEach(function(done) {
                            onEnter = addProduct.props.onEnter;

                            routerState = {};
                            replace = jasmine.createSpy('replace()');
                            callback = jasmine.createSpy('callback()');

                            spyOn(store, 'dispatch').and.returnValue((dispatchDeferred = defer()).promise);

                            onEnter(routerState, replace, callback);
                            setTimeout(done);
                        });

                        it('should getCampaigns()', function() {
                            expect(sessionActions.getCampaigns).toHaveBeenCalledWith();
                            expect(store.dispatch).toHaveBeenCalledWith(sessionActions.getCampaigns.calls.mostRecent().returnValue);
                        });

                        describe('when the campaigns are fetched', function() {
                            describe('and there are none', function() {
                                beforeEach(function(done) {
                                    dispatchDeferred.resolve([]);
                                    setTimeout(done);
                                });

                                it('should allow the transition', function() {
                                    expect(replace).not.toHaveBeenCalled();
                                    expect(callback).toHaveBeenCalledWith();
                                });
                            });

                            describe('and there is one', function() {
                                let campaign;

                                beforeEach(function(done) {
                                    campaign = `cam-${createUuid()}`;
                                    dispatchDeferred.resolve([campaign]);
                                    setTimeout(done);
                                });

                                it('should go to the dashboard state', function() {
                                    expect(replace).toHaveBeenCalledWith('/dashboard');
                                    expect(callback).toHaveBeenCalledWith();
                                });
                            });
                        });

                        describe('if the campaigns cannot be fetched', function() {
                            let reason;

                            beforeEach(function(done) {
                                reason = new Error('There was a problem!');
                                dispatchDeferred.reject(reason);
                                setTimeout(done);
                            });

                            it('should show an error notification and go to the dashboard', function() {
                                expect(notificationActions.notify).toHaveBeenCalledWith({
                                    type: NOTIFICATION_TYPE.WARNING,
                                    message: `Unexpected error: ${reason.message}`
                                });
                                expect(store.dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                                expect(replace).toHaveBeenCalledWith('/dashboard');
                                expect(callback).toHaveBeenCalledWith();
                            });
                        });
                    });
                });
            });
        });
    });
});
