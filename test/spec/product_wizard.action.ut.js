'use strict';

import defer from 'promise-defer';
import { getProductData } from '../../src/actions/collateral';
import {
    PRODUCT_SELECTED,
    PRODUCT_EDITED,
    TARGETING_EDITED,
    GO_TO_STEP,
    WIZARD_DESTROYED,
    CREATE_CAMPAIGN
} from '../../src/actions/product_wizard';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';
import { paymentMethod } from '../../src/actions/payment';
import campaign from '../../src/actions/campaign';
import { replace } from 'react-router-redux';
import { notify } from '../../src/actions/notification';
import { TYPE as NOTIFICATION_TYPE } from '../../src/enums/notification';

const proxyquire = require('proxyquire');

describe('product wizard actions', function() {
    let collateralActions, notificationActions;
    let actions;
    let productSelected, productEdited, targetingEdited, goToStep, wizardDestroyed, createCampaign;

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
            }
        });
        productSelected = actions.productSelected;
        productEdited = actions.productEdited;
        targetingEdited = actions.targetingEdited;
        goToStep = actions.goToStep;
        wizardDestroyed = actions.wizardDestroyed;
        createCampaign = actions.createCampaign;
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
                age: TARGETING.AGE.ZERO_TO_TWELVE,
                gender: TARGETING.GENDER.FEMALE
            };
            payment = {
                cardholderName: 'Foo',
                nonce: createUuid()
            };

            thunk = createCampaign({ productData, targeting, payment });
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferred;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                dispatchDeferred = defer();

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (typeof action === 'function') { return dispatchDeferred.promise; }

                    if (!(action.payload instanceof Promise)) {
                        return Promise.resolve(action.payload);
                    } else {
                        return action.payload.then(value => ({ value, action }))
                            .catch(reason => Promise.reject({ reason, action }));
                    }
                });
                getState = jasmine.createSpy('getState()').and.returnValue({});

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
                    spyOn(campaign, 'create').and.callThrough();
                    dispatchDeferred.resolve([createUuid()]);

                    dispatchDeferred = defer();
                    dispatch.calls.reset();

                    setTimeout(done);
                });

                it('should create a campaign', function() {
                    expect(campaign.create).toHaveBeenCalledWith({ data: {
                        application: 'showcase',
                        cards: [],
                        name: productData.name,
                        status: 'outOfBudget',
                        product: productData,
                        targeting: {
                            demographics: {
                                age: [targeting.age],
                                gender: [targeting.gender]
                            },
                            appStoreCategory: productData.categories
                        }
                    } });
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
                        expect(notificationActions.notify).toHaveBeenCalledWith({ type: NOTIFICATION_TYPE.SUCCESS, message: 'Your app has been added!' });
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
    });

    describe('productSelected({ product })', function() {
        let product;
        let thunk;

        beforeEach(function() {
            product = {
                uri: 'https://itunes.apple.com/us/app/photo-coin-counter-photocoin/id763388830?mt=8&uo=4'
            };

            thunk = productSelected({ product });
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

    describe('productEdited({ data })', function() {
        let data;
        let result;

        beforeEach(function() {
            data = {
                name: 'The name',
                description: 'The description'
            };

            result = productEdited({ data });
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(PRODUCT_EDITED)(data));
        });
    });

    describe('targetingEdited({ data })', function() {
        let data;
        let result;

        beforeEach(function() {
            data = {
                gender: TARGETING.GENDER.FEMALE,
                age: TARGETING.AGE.EIGHTEEN_PLUS
            };

            result = targetingEdited({ data });
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(TARGETING_EDITED)(data));
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
});
