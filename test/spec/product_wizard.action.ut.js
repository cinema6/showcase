'use strict';

import defer from 'promise-defer';
import { getProductData } from '../../src/actions/collateral';
import {
    PRODUCT_SELECTED,
    GO_TO_STEP,
    WIZARD_DESTROYED,
    CREATE_CAMPAIGN,
    LOAD_CAMPAIGN,
    UPDATE_CAMPAIGN,
    PREVIEW_LOADED,
    COLLECT_PAYMENT
} from '../../src/actions/product_wizard';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';
import { paymentMethod } from '../../src/actions/payment';
import campaign from '../../src/actions/campaign';
import advertiser from '../../src/actions/advertiser';
import { replace } from 'react-router-redux';
import { notify } from '../../src/actions/notification';
import { TYPE as NOTIFICATION_TYPE } from '../../src/enums/notification';
import { campaignFromData } from '../../src/utils/campaign';
import { push, goBack } from 'react-router-redux';
import { getThunk, createThunk } from '../../src/middleware/fsa_thunk';
import { collectPayment, autofill, completeAutofill } from '../../src/actions/product_wizard';
import { dispatch } from '../helpers/stubs';
import { getPromotions, getOrg } from '../../src/actions/session';
import { assign } from 'lodash';
import moment from 'moment';

const proxyquire = require('proxyquire');

describe('product wizard actions', function() {
    let collateralActions, notificationActions;
    let actions;
    let productSelected, wizardComplete, goToStep, wizardDestroyed, createCampaign, loadCampaign, updateCampaign, previewLoaded;

    beforeEach(function() {
        notificationActions = {
            notify: jasmine.createSpy('notify()').and.callFake(notify),

            __esModule: true
        };
        collateralActions = {
            getProductData: jasmine.createSpy('getProductData()').and.callFake(getProductData),

            __esModule: true
        };
        actions = proxyquire('../../src/actions/product_wizard', {
            './collateral': collateralActions,
            './notification': notificationActions,
            './payment': {
                paymentMethod,

                __esModule: true
            },
            './campaign': {
                default: campaign,

                __esModule: true
            },
            './advertiser': {
                default: advertiser,

                __esModule: true
            },
            './session': {
                getPromotions,
                getOrg,

                __esModule: true
            }
        });
        productSelected = actions.productSelected;
        wizardComplete = actions.wizardComplete;
        goToStep = actions.goToStep;
        wizardDestroyed = actions.wizardDestroyed;
        createCampaign = actions.createCampaign;
        loadCampaign = actions.loadCampaign;
        updateCampaign = actions.updateCampaign;
        previewLoaded = actions.previewLoaded;
    });

    describe('updateCampaign({ id, productData, targeting })', function() {
        let id, productData, targeting;
        let thunk;

        beforeEach(function() {
            id = `cam-${createUuid()}`;
            productData = {
                name: 'New Product Name',
                description: 'Better description!'
            };
            targeting = {
                gender: TARGETING.GENDER.FEMALE,
                age: TARGETING.AGE.KIDS
            };

            thunk = getThunk(updateCampaign({ id, productData, targeting }));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let camp;
            let dispatchDeferred, state;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                camp = {
                    id: id,
                    product: {
                        name: 'Old Name',
                        description: 'Old description.',
                        categories: ['Gaming', 'FPS'],
                        images: []
                    },
                    targeting: {
                        demographics: {
                            age: [],
                            gender: []
                        },
                        appStoreCategory: ['Gaming', 'FPS']
                    }
                };

                dispatchDeferred = defer();
                state = {
                    db: {
                        campaign: {
                            [id]: camp
                        }
                    }
                };

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) { return dispatchDeferred.promise; }

                    if (!(action.payload instanceof Promise)) {
                        return Promise.resolve(action.payload);
                    } else {
                        return action.payload.then(value => ({ value, action }))
                            .catch(reason => Promise.reject({ reason, action }));
                    }
                });
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(campaign, 'update').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should update the campaign', function() {
                expect(campaign.update).toHaveBeenCalledWith({ data: campaignFromData({ productData, targeting }, camp) });
                expect(dispatch).toHaveBeenCalledWith(campaign.update.calls.mostRecent().returnValue);
            });

            it('should dispatch UPDATE_CAMPAIGN', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(UPDATE_CAMPAIGN)(jasmine.any(Promise)));
            });

            describe('when the campaign is updated', function() {
                beforeEach(function(done) {
                    dispatchDeferred.resolve([id]);
                    setTimeout(done);
                });

                it('should go to the product page', function() {
                    expect(dispatch).toHaveBeenCalledWith(push(`/dashboard/campaigns/${id}`));
                });

                it('should show a notification', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION_TYPE.SUCCESS,
                        message: 'Your app has been updated!'
                    });
                    expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                });

                it('should fulfill with the id', function() {
                    expect(success).toHaveBeenCalledWith([id]);
                });
            });

            describe('if there is a problem', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('ERROR!');
                    dispatchDeferred.reject(reason);
                    setTimeout(done);
                });

                it('should show a notification', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION_TYPE.DANGER,
                        message: `Failed to update your app: ${reason.message}`,
                        time: 10000
                    });
                    expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                });

                it('should reject with the reason', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });

            describe('If the campaign is not in the cache', function() {
                beforeEach(function(done) {
                    delete state.db.campaign[id];
                    success.calls.reset();
                    failure.calls.reset();
                    dispatch.calls.reset();
                    campaign.update.calls.reset();

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should dispatch UPDATE_CAMPAIGN', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(UPDATE_CAMPAIGN)(jasmine.any(Promise)));
                });

                it('should not update anything', function() {
                    expect(campaign.update).not.toHaveBeenCalled();
                });

                it('should show a notification', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION_TYPE.DANGER,
                        message: `Failed to update your app: There is no campaign(${id}) in the cache.`,
                        time: 10000
                    });
                    expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                });

                it('should return a rejected promise', function() {
                    expect(failure).toHaveBeenCalledWith(new Error(`There is no campaign(${id}) in the cache.`));
                });
            });
        });
    });

    describe('loadCampaign({ id })', function() {
        let id;
        let thunk;

        beforeEach(function() {
            id = `cam-${createUuid()}`;

            thunk = getThunk(loadCampaign({ id }));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferred, state;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                dispatchDeferred = defer();
                state = {
                    db: {
                        campaign: {}
                    }
                };

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) { return dispatchDeferred.promise; }

                    if (!(action.payload instanceof Promise)) {
                        return Promise.resolve(action.payload);
                    } else {
                        return action.payload.then(value => ({ value, action }))
                            .catch(reason => Promise.reject({ reason, action }));
                    }
                });
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(campaign, 'get').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should get the campaign', function() {
                expect(campaign.get).toHaveBeenCalledWith({ id });
                expect(dispatch).toHaveBeenCalledWith(campaign.get.calls.mostRecent().returnValue);
            });

            it('should dispatch LOAD_CAMPAIGN', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOAD_CAMPAIGN)(jasmine.any(Promise)));
            });

            describe('when the campaign is fetched', function() {
                beforeEach(function(done) {
                    dispatchDeferred.resolve([id]);
                    setTimeout(done);
                });

                it('should fulfill with the id', function() {
                    expect(success).toHaveBeenCalledWith([id]);
                });
            });

            describe('if there is a problem', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('ERROR!');
                    dispatchDeferred.reject(reason);
                    setTimeout(done);
                });

                it('should show an error', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION_TYPE.DANGER,
                        message: `Failed to fetch data: ${reason.message}`,
                        time: 10000
                    });
                    expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                });

                it('should goBack()', function() {
                    expect(dispatch).toHaveBeenCalledWith(goBack());
                });

                it('should reject with the reason', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });

            describe('if there was a problem but the campaign is cached', function() {
                let reason;

                beforeEach(function(done) {
                    state.db.campaign[id] = {
                        id
                    };
                    reason = new Error('ERROR!');
                    dispatchDeferred.reject(reason);
                    setTimeout(done);
                });

                it('should show a warning', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION_TYPE.WARNING,
                        message: `Failed to fetch latest data: ${reason.message}`
                    });
                    expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                });

                it('should not goBack()', function() {
                    expect(dispatch).not.toHaveBeenCalledWith(goBack());
                });

                it('should reject with the reason', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });
        });
    });

    describe('createCampaign({ productData, targeting, payment })', function() {
        let productData, targeting, payment;
        let thunk;

        beforeEach(function() {
            productData = {
                name: 'The name of my product!',
                foo: 'bar',
                hello: 'world',
                categories: ['Games', 'Strategy']
            };
            targeting = {
                age: TARGETING.AGE.KIDS,
                gender: TARGETING.GENDER.FEMALE
            };
            payment = {
                cardholderName: 'Foo',
                nonce: createUuid()
            };

            thunk = getThunk(createCampaign({ productData, targeting, payment }));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let userID;
            let dispatchDeferred, state;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                userID = `u-${createUuid}`;

                dispatchDeferred = defer();
                state = {
                    session: {
                        user: userID
                    },
                    db: {
                        user: {
                            [userID]: {
                                id: userID,
                                org: `o-${createUuid()}`
                            }
                        }
                    }
                };

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) { return dispatchDeferred.promise; }

                    if (!(action.payload instanceof Promise)) {
                        return Promise.resolve(action.payload);
                    } else {
                        return action.payload.then(value => ({ value, action }))
                            .catch(reason => Promise.reject({ reason, action }));
                    }
                });
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(paymentMethod, 'create').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should create a paymentMethod', function() {
                expect(paymentMethod.create).toHaveBeenCalledWith({ data: { cardholderName: payment.cardholderName, paymentMethodNonce: payment.nonce, makeDefault: true } });
                expect(dispatch).toHaveBeenCalledWith(paymentMethod.create.calls.mostRecent().returnValue);
            });

            it('should dispatch CREATE_CAMPAIGN', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CREATE_CAMPAIGN)(jasmine.any(Promise)));
            });

            describe('when the payment method is created', function() {
                beforeEach(function(done) {
                    spyOn(advertiser, 'query').and.callThrough();
                    dispatchDeferred.resolve([createUuid()]);

                    dispatchDeferred = defer();
                    dispatch.calls.reset();

                    setTimeout(done);
                });

                it('should get the advertiser', function() {
                    expect(advertiser.query).toHaveBeenCalledWith({
                        org: state.db.user[state.session.user].org,
                        limit: 1
                    });
                    expect(dispatch).toHaveBeenCalledWith(advertiser.query.calls.mostRecent().returnValue);
                });

                describe('when the advertiser is fetched', function() {
                    let advertiserID;

                    beforeEach(function(done) {
                        advertiserID = `a-${createUuid()}`;
                        dispatchDeferred.resolve([advertiserID]);

                        spyOn(campaign, 'create').and.callThrough();
                        dispatchDeferred = defer();
                        dispatch.calls.reset();

                        setTimeout(done);
                    });

                    it('should create a campaign', function() {
                        expect(campaign.create).toHaveBeenCalledWith({ data: campaignFromData({ productData, targeting }, { advertiserId: advertiserID }) });
                        expect(dispatch).toHaveBeenCalledWith(campaign.create.calls.mostRecent().returnValue);
                    });

                    describe('when the campaign has been created', function() {
                        let id;

                        beforeEach(function(done) {
                            id = `cam-${createUuid()}`;
                            dispatchDeferred.resolve([id]);

                            dispatchDeferred = defer();
                            dispatch.calls.reset();
                            setTimeout(done);
                        });

                        it('should redirect to the product page', function() {
                            expect(dispatch).toHaveBeenCalledWith(replace(`/dashboard/campaigns/${id}`));
                        });

                        it('should show a success notification', function() {
                            expect(notificationActions.notify).toHaveBeenCalledWith({ type: NOTIFICATION_TYPE.SUCCESS, message: jasmine.any(String), time: 6000 });
                            expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                        });

                        it('should fulfill the promise', function() {
                            expect(success).toHaveBeenCalledWith([id]);
                        });
                    });

                    describe('if there is a problem', function() {
                        let reason;

                        beforeEach(function(done) {
                            reason = new Error('It went wrong!');
                            reason.response = 'Something bad happened!';
                            dispatchDeferred.reject(reason);

                            dispatchDeferred = defer();
                            dispatch.calls.reset();
                            setTimeout(done);
                        });

                        it('should not redirect to the product page', function() {
                            expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                                type: replace('foo').type
                            }));
                        });

                        it('should show a failure notification', function() {
                            expect(notificationActions.notify).toHaveBeenCalledWith({ type: NOTIFICATION_TYPE.DANGER, message: `There was a problem: ${reason.response}` });
                            expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                        });

                        it('should reject the promise', function() {
                            expect(failure).toHaveBeenCalledWith(reason);
                        });
                    });

                });
            });

            describe('if no payment is specified', function() {
                beforeEach(function(done) {
                    dispatchDeferred = defer();
                    dispatch.calls.reset();
                    paymentMethod.create.calls.reset();

                    success.calls.reset();
                    failure.calls.reset();

                    spyOn(advertiser, 'query').and.callThrough();

                    getThunk(createCampaign({ productData, targeting }))(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should not create a paymentMethod', function() {
                    expect(paymentMethod.create).not.toHaveBeenCalled();
                });

                it('should get the advertiser', function() {
                    expect(advertiser.query).toHaveBeenCalledWith({
                        org: state.db.user[state.session.user].org,
                        limit: 1
                    });
                    expect(dispatch).toHaveBeenCalledWith(advertiser.query.calls.mostRecent().returnValue);
                });
            });
        });
    });

    describe('productSelected({ product })', function() {
        let product;
        let thunk;

        beforeEach(function() {
            product = {
                uri: 'https://itunes.apple.com/us/app/photo-coin-counter-photocoin/id763388830?mt=8&uo=4'
            };

            thunk = getThunk(productSelected({ product }));
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

            it('should dispatch a call to getProductData()', function() {
                expect(collateralActions.getProductData).toHaveBeenCalledWith({ uri: product.uri });
                expect(dispatch.calls.all()[0].args[0]).toBe(collateralActions.getProductData.calls.mostRecent().returnValue);
            });

            it('should dispatch PRODUCT_SELECTED', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(PRODUCT_SELECTED)(dispatch.calls.all()[0].returnValue));
            });

            describe('when the data is fetched', function() {
                let product;

                beforeEach(function(done) {
                    product = { extID: createUuid() };
                    dispatchDeferred.resolve({ value: product });

                    setTimeout(done);
                });

                it('should fulfill with the product', function() {
                    expect(success).toHaveBeenCalledWith(product);
                });
            });

            describe('if there is a problem', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('Something went wrong!');
                    dispatchDeferred.reject({ reason });
                    setTimeout(done);
                });

                it('should reject with the reason', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });
        });
    });

    describe('autofill()', function(){
        this.thunk;
        this.dispatch;
        beforeEach(function(done){
            this.dispatch = dispatch();
            this.thunk = getThunk(autofill());
            setTimeout(done);
        });
        afterEach(function(){
            localStorage.removeItem('appURI');
        });
        it('should return a thunk', function(){
            expect(this.thunk).toEqual(jasmine.any(Function));
        });
        describe('when executed', function() {
            beforeEach(function(done){
                localStorage.setItem('appURI', 's');
                this.uri = localStorage.getItem('appURI');
                this.thunk(this.dispatch);
                setTimeout(done);
            });
            it('should get the app data', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getProductData({ uri: this.uri }));
            });
            describe('if there is a URI in localstorage appURI', function(){
                beforeEach(function(done){
                    localStorage.setItem('appURI', 'testURI');
                    this.dispatch.getDeferred(getProductData({ uri: this.uri })).resolve({
                        id: this.uri,
                        name: 't',
                        images: [{type: 'thumbnail', uri: 'uri'}],
                        uri: this.uri 
                    });
                    setTimeout(done);
                });
                it('should return app data', function(){
                    expect(this.dispatch).toHaveBeenCalledWith(completeAutofill({
                        id: this.uri,
                        title: 't',
                        thumbnail: 'uri',
                        uri: this.uri
                    }));
                });
            });
            describe('if there is no URI in localstorage appURI', function(){
                beforeEach(function(done){
                    localStorage.removeItem('appURI');
                    this.uri = localStorage.getItem('appURI');
                    this.dispatch.calls.reset();
                    this.thunk(this.dispatch);
                    setTimeout(done);
                });
                it('should not dispatch', function(){
                    expect(this.dispatch).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('wizardComplete({ productData, targeting })', function() {
        let productData, targeting;
        let thunk;

        beforeEach(function() {
            productData = {
                name: 'App Name',
                description: 'App description.'
            };
            targeting = {
                age: TARGETING.AGE.YOUNG_ADULTS,
                gender: TARGETING.GENDER.MALE
            };

            thunk = getThunk(wizardComplete({ productData, targeting }));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let user;
            let success, failure;
            let state, dispatchDeferred;
            let dispatch, getState;

            beforeEach(function(done) {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                user = {
                    id: `u-${createUuid()}`
                };

                dispatchDeferred = defer();
                state = {
                    session: {
                        user: user.id,
                        paymentMethods: []
                    },
                    db: {
                        user: user
                    }
                };

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) {
                        return dispatchDeferred.promise;
                    }

                    if (action.payload instanceof Promise) {
                        return action.payload.then(value => ({ value, action }), reason => Promise.reject({ reason, action }));
                    }

                    return Promise.resolve(action.payload);
                });
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                spyOn(paymentMethod, 'list').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should list the paymentMethods', function() {
                expect(paymentMethod.list).toHaveBeenCalledWith();
                expect(dispatch).toHaveBeenCalledWith(paymentMethod.list.calls.mostRecent().returnValue);
            });

            describe('when the paymentMethods are fetched', function() {
                describe('if there is one', function() {
                    beforeEach(function(done) {
                        dispatch.calls.reset();
                        dispatchDeferred.resolve([createUuid()]);
                        dispatch.and.callFake(action => {
                            if (action.type === createThunk()().type) {
                                return Promise.resolve(action(dispatch, getState));
                            }

                            if (action.payload instanceof Promise) {
                                return action.payload.then(value => ({ value, action }), reason => Promise.reject({ reason, action }));
                            }

                            return Promise.resolve(action.payload);
                        });

                        setTimeout(done);
                    });

                    it('should dispatch createCampaign()', function() {
                        expect(dispatch).toHaveBeenCalledWith(createCampaign({ productData, targeting }));
                    });
                });

                describe('if there are none', function() {
                    beforeEach(function(done) {
                        dispatch.calls.reset();
                        dispatchDeferred.resolve([]);

                        setTimeout(done);
                    });

                    it('should dispatch GO_TO_STEP', function() {
                        expect(dispatch).toHaveBeenCalledWith(goToStep(3));
                    });
                });
            });

            describe('if the user has a payment method', function() {
                beforeEach(function(done) {
                    dispatch.calls.reset();
                    dispatch.and.callFake(action => {
                        if (action.type === createThunk()().type) {
                            return Promise.resolve(action(dispatch, getState));
                        }

                        if (action.payload instanceof Promise) {
                            return action.payload.then(value => ({ value, action }), reason => Promise.reject({ reason, action }));
                        }

                        return Promise.resolve(action.payload);
                    });
                    state.session.paymentMethods = [createUuid()];

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should dispatch createCampaign()', function() {
                    expect(dispatch).toHaveBeenCalledWith(createCampaign({ productData, targeting }));
                });
            });
        });
    });

    describe('goToStep(step)', function() {
        let step;
        let result;

        beforeEach(function() {
            step = 2;

            result = goToStep(step);
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(GO_TO_STEP)(step));
        });
    });

    describe('wizardDestroyed()', function() {
        let result;

        beforeEach(function() {
            result = wizardDestroyed();
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(WIZARD_DESTROYED)());
        });
    });

    describe('previewLoaded()', function() {
        beforeEach(function() {
            this.result = previewLoaded();
        });

        it('should return an FSA', function() {
            expect(this.result).toEqual({
                type: PREVIEW_LOADED
            });
        });
    });

    describe('collectPayment({ productData, targeting })', function() {
        beforeEach(function() {
            createCampaign = require('../../src/actions/product_wizard').createCampaign;
            this.productData = {
                name: 'My Awesome App',
                description: 'It really is the best.'
            };
            this.targeting = {
                age: [TARGETING.AGE.ALL],
                gender: []
            };
            this.thunk = getThunk(collectPayment({ productData: this.productData, targeting: this.targeting }));
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.state = {
                    db: {
                        promotion: {},
                        org: {}
                    }
                };
                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.callFake(() => this.state);

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should dispatch COLLECT_PAYMENT', function() {
                expect(this.dispatch).toHaveBeenCalledWith({
                    type: COLLECT_PAYMENT,
                    payload: jasmine.any(Promise)
                });
            });

            it('should get the user\'s promotions', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getPromotions());
            });

            it('should get the user\'s org', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getOrg());
            });

            describe('if the promotions cannot be fetched', function() {
                beforeEach(function(done) {
                    this.reason = new Error('I failed!');
                    this.dispatch.getDeferred(getPromotions()).reject(this.reason);
                    setTimeout(done);
                });

                it('should show a notification', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(notify({
                        type: NOTIFICATION_TYPE.DANGER,
                        message: `Unexpected error: ${this.reason.message}`,
                        time: 10000
                    }));
                });

                it('should reject the promise', function() {
                    expect(this.failure).toHaveBeenCalledWith(this.reason);
                });
            });

            describe('if the org cannot be fetched', function() {
                beforeEach(function(done) {
                    this.reason = new Error('I failed!');
                    this.dispatch.getDeferred(getOrg()).reject(this.reason);
                    setTimeout(done);
                });

                it('should show a notification', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(notify({
                        type: NOTIFICATION_TYPE.DANGER,
                        message: `Unexpected error: ${this.reason.message}`,
                        time: 10000
                    }));
                });

                it('should reject the promise', function() {
                    expect(this.failure).toHaveBeenCalledWith(this.reason);
                });
            });

            describe('if the user has no promotions', function() {
                beforeEach(function(done) {
                    this.org = {
                        id: `o-${createUuid()}`,
                        paymentPlanId: `pp-${createUuid()}`
                    };
                    this.promotions = [];

                    this.state = assign({}, this.state, {
                        db: assign({}, this.state.db, {
                            org: assign({}, this.state.db.org, {
                                [this.org.id]: this.org
                            })
                        })
                    });

                    this.dispatch.getDeferred(getPromotions()).resolve(this.promotions);
                    this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                    setTimeout(done);
                });

                it('should go to step 4', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(goToStep(4));
                });

                it('should fulfill with undefined', function() {
                    expect(this.success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('if the user has a promotion that does not require a payment method', function() {
                beforeEach(function(done) {
                    this.org = {
                        id: `o-${createUuid()}`,
                        paymentPlanId: `pp-${createUuid()}`
                    };
                    this.promotions = [
                        {
                            id: `pro-${createUuid()}`,
                            type: 'freeTrial',
                            data: {
                                [this.org.paymentPlanId]: {
                                    trialLength: 30,
                                    paymentMethodRequired: true
                                }
                            }
                        },
                        {
                            id: `pro-${createUuid()}`,
                            type: 'freeTrial',
                            data: {
                                [this.org.paymentPlanId]: {
                                    trialLength: 10,
                                    paymentMethodRequired: false
                                }
                            }
                        },
                        {
                            id: `pro-${createUuid()}`,
                            type: 'freeTrial',
                            data: {
                                [this.org.paymentPlanId]: {
                                    trialLength: 11,
                                    paymentMethodRequired: true
                                }
                            }
                        }
                    ];

                    this.state = assign({}, this.state, {
                        db: assign({}, this.state.db, {
                            promotion: assign({}, this.state.db.promotion, this.promotions.reduce((result, promotion) => {
                                result[promotion.id] = promotion;
                                return result;
                            }, {})),
                            org: assign({}, this.state.db.org, {
                                [this.org.id]: this.org
                            })
                        })
                    });

                    this.dispatch.getDeferred(getPromotions()).resolve(this.promotions.map(promotion => promotion.id));
                    setTimeout(done);
                });

                describe('and the org has no payment plan', function() {
                    beforeEach(function(done) {
                        delete this.org.paymentPlanId;
                        this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                        setTimeout(done);
                    });

                    it('should not ask for a payment method', function() {
                        expect(this.dispatch).not.toHaveBeenCalledWith(goToStep(jasmine.anything()));
                    });

                    it('should create the campaign', function() {
                        expect(this.dispatch).toHaveBeenCalledWith(createCampaign({ productData: this.productData, targeting: this.targeting }));
                    });

                    describe('if the campaign cannot be created', function() {
                        beforeEach(function(done) {
                            this.reason = new Error('I failed!');
                            this.dispatch.getDeferred(createCampaign({ productData: this.productData, targeting: this.targeting })).reject(this.reason);
                            setTimeout(done);
                        });

                        it('should show a notification', function() {
                            expect(this.dispatch).toHaveBeenCalledWith(notify({
                                type: NOTIFICATION_TYPE.DANGER,
                                message: `Unexpected error: ${this.reason.message}`,
                                time: 10000
                            }));
                        });

                        it('should reject the promise', function() {
                            expect(this.failure).toHaveBeenCalledWith(this.reason);
                        });
                    });

                    describe('when the campaign is created', function() {
                        beforeEach(function(done) {
                            this.campaign = {
                                id: `cam-${createUuid()}`,
                                product: this.productData
                            };
                            this.state = assign({}, this.state, {
                                db: assign({}, this.state.db, {
                                    campaign: assign({}, this.state.db.campaign, {
                                        [this.campaign.id]: this.campaign
                                    })
                                })
                            });
                            this.getState.and.returnValue(this.state);
                            this.dispatch.getDeferred(createCampaign({ productData: this.productData, targeting: this.targeting })).resolve([this.campaign.id]);
                            setTimeout(done);
                        });

                        it('should fulfill with undefined', function() {
                            expect(this.success).toHaveBeenCalledWith(undefined);
                        });
                    });
                });

                describe('if the org has a paymentPlanStart in the future', function() {
                    beforeEach(function(done) {
                        this.org.paymentPlanStart = moment().add(2, 'days').format();

                        this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                        setTimeout(done);
                    });

                    it('should not ask for a payment method', function() {
                        expect(this.dispatch).not.toHaveBeenCalledWith(goToStep(jasmine.anything()));
                    });

                    it('should create the campaign', function() {
                        expect(this.dispatch).toHaveBeenCalledWith(createCampaign({ productData: this.productData, targeting: this.targeting }));
                    });

                    describe('if the campaign cannot be created', function() {
                        beforeEach(function(done) {
                            this.reason = new Error('I failed!');
                            this.dispatch.getDeferred(createCampaign({ productData: this.productData, targeting: this.targeting })).reject(this.reason);
                            setTimeout(done);
                        });

                        it('should show a notification', function() {
                            expect(this.dispatch).toHaveBeenCalledWith(notify({
                                type: NOTIFICATION_TYPE.DANGER,
                                message: `Unexpected error: ${this.reason.message}`,
                                time: 10000
                            }));
                        });

                        it('should reject the promise', function() {
                            expect(this.failure).toHaveBeenCalledWith(this.reason);
                        });
                    });

                    describe('when the campaign is created', function() {
                        beforeEach(function(done) {
                            this.campaign = {
                                id: `cam-${createUuid()}`,
                                product: this.productData
                            };
                            this.state = assign({}, this.state, {
                                db: assign({}, this.state.db, {
                                    campaign: assign({}, this.state.db.campaign, {
                                        [this.campaign.id]: this.campaign
                                    })
                                })
                            });
                            this.getState.and.returnValue(this.state);
                            this.dispatch.getDeferred(createCampaign({ productData: this.productData, targeting: this.targeting })).resolve([this.campaign.id]);
                            setTimeout(done);
                        });

                        it('should fulfill with undefined', function() {
                            expect(this.success).toHaveBeenCalledWith(undefined);
                        });
                    });
                });

                describe('if the org has a paymentPlanStart in the past', function() {
                    beforeEach(function(done) {
                        this.org.paymentPlanStart = moment().subtract(2, 'days').format();

                        this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                        setTimeout(done);
                    });

                    it('should not create the campaign', function() {
                        expect(this.dispatch).not.toHaveBeenCalledWith(createCampaign(jasmine.any(Object)));
                    });

                    it('should ask for a credit card', function() {
                        expect(this.dispatch).toHaveBeenCalledWith(goToStep(4));
                    });

                    it('should fulfill with undefined', function() {
                        expect(this.success).toHaveBeenCalledWith(undefined);
                    });
                });
            });

            describe('if the promotions all require a paymentMethod', function() {
                beforeEach(function(done) {
                    this.org = {
                        id: `o-${createUuid()}`,
                        paymentPlanId: `pp-${createUuid()}`,
                        paymentPlanStart: moment().utcOffset(0).startOf('day').add(5, 'days').format()
                    };
                    this.promotions = [
                        {
                            id: `pro-${createUuid()}`,
                            type: 'freeTrial',
                            data: {
                                [this.org.paymentPlanId]: {
                                    trialLength: 30,
                                    paymentMethodRequired: true
                                }
                            }
                        },
                        {
                            id: `pro-${createUuid()}`,
                            type: 'freeTrial',
                            data: {
                                [this.org.paymentPlanId]: {
                                    trialLength: 10,
                                    paymentMethodRequired: true
                                }
                            }
                        },
                        {
                            id: `pro-${createUuid()}`,
                            type: 'freeTrial',
                            data: {
                                [this.org.paymentPlanId]: {
                                    trialLength: 11,
                                    paymentMethodRequired: true
                                }
                            }
                        }
                    ];
                    this.state = assign({}, this.state, {
                        db: assign({}, this.state.db, {
                            promotion: assign({}, this.state.db.promotion, this.promotions.reduce((result, promotion) => {
                                result[promotion.id] = promotion;
                                return result;
                            }, {})),
                            org: assign({}, this.state.db.org, {
                                [this.org.id]: this.org
                            })
                        })
                    });

                    this.dispatch.getDeferred(getPromotions()).resolve(this.promotions.map(promotion => promotion.id));
                    this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                    setTimeout(done);
                });

                it('should ask for a credit card', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(goToStep(4));
                });

                it('should fulfill with undefined', function() {
                    expect(this.success).toHaveBeenCalledWith(undefined);
                });
            });
        });
    });
});
