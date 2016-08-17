'use strict';

import { Route, IndexRoute } from 'react-router';
import { find, cloneDeep as clone } from 'lodash';
import { createStore } from 'redux';
import { getCampaigns, getPaymentPlan } from '../../src/actions/session';
import { notify } from '../../src/actions/notification';
import { createUuid } from 'rc-uuid';
import { TYPE as NOTIFICATION_TYPE } from '../../src/enums/notification';
import * as stubs from '../helpers/stubs';

const proxyquire = require('proxyquire');

describe('createRoutes(store)', function() {
    let sessionActions, notificationActions;
    let createRoutes;

    beforeEach(function() {
        sessionActions = {
            getCampaigns: jasmine.createSpy('getCampaigns()').and.callFake(getCampaigns),
            getPaymentPlan
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

                describe('campaigns', function() {
                    let campaigns;

                    beforeEach(function() {
                        campaigns = find(children, route => route.props.path === 'campaigns');
                    });

                    it('should exist', function() {
                        expect(campaigns).toEqual(jasmine.any(Object));
                    });

                    describe('onEnter()', function() {
                        let state;
                        let onEnter;
                        let dispatchStub;
                        let routerState, replace, callback;

                        beforeEach(function(done) {
                            onEnter = campaigns.props.onEnter;

                            routerState = {};
                            replace = jasmine.createSpy('replace()');
                            callback = jasmine.createSpy('callback()');

                            state = {
                                db: {
                                    paymentPlan: {}
                                }
                            };

                            dispatchStub = stubs.dispatch();
                            spyOn(store, 'dispatch').and.callFake(dispatchStub);
                            spyOn(store, 'getState').and.callFake(() => clone(state));

                            onEnter(routerState, replace, callback);
                            setTimeout(done);
                        });

                        it('should get the user\'s campaigns', () => {
                            expect(store.dispatch).toHaveBeenCalledWith(getCampaigns());
                        });

                        it('should get the user\'s paymentPlan', () => {
                            expect(store.dispatch).toHaveBeenCalledWith(getPaymentPlan());
                        });

                        describe('if something goes wrong', () => {
                            let reason;

                            beforeEach(done => {
                                reason = new Error('It went badly!');
                                dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).reject(reason);

                                setTimeout(done);

                                store.dispatch.calls.reset();
                            });

                            it('should show an error notification', function() {
                                expect(store.dispatch).toHaveBeenCalledWith(notify({
                                    type: NOTIFICATION_TYPE.DANGER,
                                    message: `Unexpected error: ${reason.message}`,
                                    time: 10000
                                }));
                                expect(replace).not.toHaveBeenCalled();
                                expect(callback).toHaveBeenCalledWith();
                            });
                        });

                        describe('if the user has no payment plan', () => {
                            beforeEach(done => {
                                dispatchStub.getDeferred(store.dispatch.calls.first().args[0]).resolve([]);
                                dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).resolve(null);

                                setTimeout(done);
                            });

                            afterEach(() => {
                                expect(replace.calls.count()).toBe(1);
                                expect(callback.calls.count()).toBe(1);
                            });

                            it('should redirect to /dashboard/add-product', () => {
                                expect(replace).toHaveBeenCalledWith('/dashboard/add-product');
                                expect(callback).toHaveBeenCalledWith();
                            });
                        });

                        describe('if the user has a legitimate payment plan', () => {
                            let paymentPlan;

                            beforeEach(done => {
                                paymentPlan = {
                                    id: `pp-${createUuid()}`,
                                    maxCampaigns: 1
                                };
                                state.db.paymentPlan[paymentPlan.id] = paymentPlan;

                                dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).resolve([paymentPlan]);
                                setTimeout(done);
                            });

                            describe('and no campaigns', () => {
                                beforeEach(done => {
                                    dispatchStub.getDeferred(store.dispatch.calls.first().args[0]).resolve([]);

                                    setTimeout(done);
                                });

                                afterEach(() => {
                                    expect(replace.calls.count()).toBe(1);
                                    expect(callback.calls.count()).toBe(1);
                                });

                                it('should redirect to /dashboard/add-product', () => {
                                    expect(replace).toHaveBeenCalledWith('/dashboard/add-product');
                                    expect(callback).toHaveBeenCalledWith();
                                });
                            });

                            describe('and at least one campaign', () => {
                                beforeEach(done => {
                                    dispatchStub.getDeferred(store.dispatch.calls.first().args[0]).resolve([`cam-${createUuid()}`]);

                                    setTimeout(done);
                                });

                                afterEach(() => {
                                    expect(callback.calls.count()).toBe(1);
                                });

                                it('should do nothing', () => {
                                    expect(replace).not.toHaveBeenCalled();
                                    expect(callback).toHaveBeenCalledWith();
                                });
                            });
                        });

                        describe('if the user has a canceled paymentPlan', () => {
                            let paymentPlan;

                            beforeEach(done => {
                                paymentPlan = {
                                    id: `pp-${createUuid()}`,
                                    maxCampaigns: 0
                                };
                                state.db.paymentPlan[paymentPlan.id] = paymentPlan;

                                dispatchStub.getDeferred(store.dispatch.calls.first().args[0]).resolve([]);
                                dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).resolve([paymentPlan]);
                                setTimeout(done);
                            });

                            afterEach(() => {
                                expect(callback.calls.count()).toBe(1);
                            });

                            it('should do nothing', () => {
                                expect(replace).not.toHaveBeenCalled();
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
                        let state;
                        let onEnter;
                        let dispatchStub;
                        let routerState, replace, callback;

                        beforeEach(function(done) {
                            onEnter = addProduct.props.onEnter;

                            routerState = {};
                            replace = jasmine.createSpy('replace()');
                            callback = jasmine.createSpy('callback()');

                            state = {
                                db: {
                                    paymentPlan: {}
                                }
                            };

                            dispatchStub = stubs.dispatch();
                            spyOn(store, 'dispatch').and.callFake(dispatchStub);
                            spyOn(store, 'getState').and.callFake(() => clone(state));

                            onEnter(routerState, replace, callback);
                            setTimeout(done);
                        });

                        it('should get the user\'s campaigns', () => {
                            expect(store.dispatch).toHaveBeenCalledWith(getCampaigns());
                        });

                        it('should get the user\'s paymentPlan', () => {
                            expect(store.dispatch).toHaveBeenCalledWith(getPaymentPlan());
                        });

                        describe('if something goes wrong', () => {
                            let reason;

                            beforeEach(done => {
                                reason = new Error('It went badly!');
                                dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).reject(reason);

                                setTimeout(done);

                                store.dispatch.calls.reset();
                            });

                            it('should show an error notification', function() {
                                expect(store.dispatch).toHaveBeenCalledWith(notify({
                                    type: NOTIFICATION_TYPE.WARNING,
                                    message: `Unexpected error: ${reason.message}`
                                }));
                                expect(replace).not.toHaveBeenCalled();
                                expect(callback).toHaveBeenCalledWith();
                            });
                        });

                        describe('if the user has no payment plan', () => {
                            beforeEach(done => {
                                dispatchStub.getDeferred(store.dispatch.calls.first().args[0]).resolve([]);
                                dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).resolve(null);

                                setTimeout(done);
                            });

                            afterEach(() => {
                                expect(callback.calls.count()).toBe(1);
                            });

                            it('should do nothing', () => {
                                expect(replace).not.toHaveBeenCalled();
                                expect(callback).toHaveBeenCalledWith();
                            });
                        });

                        describe('if the user has a payment plan', () => {
                            let paymentPlan;

                            beforeEach(done => {
                                paymentPlan = {
                                    id: `pp-${createUuid()}`,
                                    maxCampaigns: 3
                                };
                                state.db.paymentPlan[paymentPlan.id] = paymentPlan;

                                dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).resolve([paymentPlan]);
                                setTimeout(done);
                            });

                            describe('and they have the maximum amount of campaigns', () => {
                                beforeEach(done => {
                                    dispatchStub.getDeferred(store.dispatch.calls.first().args[0]).resolve(Array.apply([], new Array(paymentPlan.maxCampaigns)).map(() => `cam-${createUuid()}`));

                                    setTimeout(done);
                                });

                                afterEach(() => {
                                    expect(replace.calls.count()).toBe(1);
                                    expect(callback.calls.count()).toBe(1);
                                });

                                it('should redirect to /dashboard/campaigns', () => {
                                    expect(replace).toHaveBeenCalledWith('/dashboard/campaigns');
                                    expect(callback).toHaveBeenCalledWith();
                                });
                            });

                            describe('and they have room for additional apps', () => {
                                beforeEach(done => {
                                    dispatchStub.getDeferred(store.dispatch.calls.first().args[0]).resolve(Array.apply([], new Array(paymentPlan.maxCampaigns - 1)).map(() => `cam-${createUuid()}`));

                                    setTimeout(done);
                                });

                                afterEach(() => {
                                    expect(callback.calls.count()).toBe(1);
                                });

                                it('should do nothing', () => {
                                    expect(replace).not.toHaveBeenCalled();
                                    expect(callback).toHaveBeenCalledWith();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
