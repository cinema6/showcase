'use strict';

import {
    renderIntoDocument,
    findRenderedComponentWithType,
    scryRenderedComponentsWithType
} from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import defer from 'promise-defer';
import { findApps } from '../../src/actions/search';
import {
    productSelected,
    productEdited,
    targetingEdited,
    goToStep,
    wizardDestroyed,
    createCampaign,
    previewLoaded,
    collectPayment
} from '../../src/actions/product_wizard';
import WizardSearch from '../../src/components/WizardSearch';
import WizardEditProduct from '../../src/components/WizardEditProduct';
import WizardEditTargeting from '../../src/components/WizardEditTargeting';
import WizardConfirmationModal from '../../src/components/WizardConfirmationModal';
import { reducer as formReducer, getValues } from 'redux-form';
import { assign } from 'lodash';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';
import { findDOMNode, unmountComponentAtNode } from 'react-dom';
import { getClientToken } from '../../src/actions/payment';
import AdPreview from '../../src/components/AdPreview';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import { getPaymentPlanStart } from 'showcase-core/dist/billing';
import WizardPlanInfoModal from '../../src/components/WizardPlanInfoModal';

const proxyquire = require('proxyquire');

describe('ProductWizard', function() {
    let searchActions, productWizardActions, paymentActions;
    let ProductWizard;

    beforeEach(function() {
        paymentActions = {
            getClientToken: jasmine.createSpy('getClientToken()').and.callFake(getClientToken),

            __esModule: true
        };
        productWizardActions = {
            productSelected: jasmine.createSpy('productSelected()').and.callFake(productSelected),
            productEdited: jasmine.createSpy('productEdited()').and.callFake(productEdited),
            targetingEdited: jasmine.createSpy('targetingEdited()').and.callFake(targetingEdited),
            goToStep: jasmine.createSpy('goToStep()').and.callFake(goToStep),
            wizardDestroyed: jasmine.createSpy('wizardDestroyed()').and.callFake(wizardDestroyed),
            createCampaign: jasmine.createSpy('createCampaign()').and.callFake(createCampaign),
            collectPayment,

            __esModule: true
        };
        searchActions = {
            findApps: jasmine.createSpy('findApps()').and.callFake(findApps),

            __esModule: true
        };

        ProductWizard = proxyquire('../../src/containers/Dashboard/ProductWizard', {
            'react': React,
            'showcase-core/dist/factories/app': {
                createInterstitialFactory,

                __esModule: true
            },

            '../../components/WizardSearch': {
                default: WizardSearch,

                __esModule: true
            },
            '../../components/WizardEditProduct': {
                default: WizardEditProduct,

                __esModule: true
            },
            '../../components/WizardEditTargeting': {
                default: WizardEditTargeting,

                __esModule: true
            },
            '../../components/WizardPlanInfoModal': {
                default: WizardPlanInfoModal,

                __esModule: true
            },
            '../../components/WizardConfirmationModal': {
                default: WizardConfirmationModal,

                __esModule: true
            },
            '../../components/AdPreview': {
                default: AdPreview,

                __esModule: true
            },
            '../../actions/search': searchActions,
            '../../actions/product_wizard': productWizardActions,
            '../../actions/payment': paymentActions
        }).default;
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            jasmine.clock().install();
            jasmine.clock().mockDate();

            state = {
                form: {
                    productWizard: {
                        _submitting: false,

                        name: {
                            _isFieldValue: true,
                            value: 'I edited the Name!'
                        },
                        description: {
                            _isFieldValue: true,
                            value: 'My revised description!'
                        },
                        age: {
                            _isFieldValue: true,
                            value: ['13+']
                        },
                        gender: {
                            _isFieldValue: true,
                            value: 'Female'
                        }
                    }
                }
            };
            store = createStore(compose(
                (s, action) => assign({}, s, {
                    form: formReducer(s.form, action)
                }),
                s => assign({}, s, state)
            ));
            spyOn(store, 'dispatch').and.callThrough();

            props = {
                page: {
                    step: 0,
                    productData: null,
                    previewLoaded: false,
                    checkingIfPaymentRequired: false,
                    targeting: {
                        age: [TARGETING.AGE.ALL],
                        gender: TARGETING.GENDER.ALL
                    }
                },

                steps: [0, 1, 2, 3],

                promotions: [
                    {
                        id: `pro-${createUuid()}`,
                        type: 'freeTrial',
                        data: {
                            trialLength: 10
                        }
                    }
                ],

                loadData: jasmine.createSpy('loadData()').and.returnValue(Promise.resolve(undefined)),
                onFinish: jasmine.createSpy('onFinish()').and.returnValue(Promise.resolve(3))
            };
            props.productData = props.page.productData;
            props.targeting = props.page.targeting;

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <ProductWizard {...props} />
                </Provider>
            ), ProductWizard.WrappedComponent);

            spyOn(component, 'setState').and.callThrough();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should call loadData()', function() {
            expect(component.props.loadData).toHaveBeenCalledWith();
        });

        it('should have some props', function() {
            expect(component.props).toEqual(jasmine.objectContaining({
                formValues: getValues(store.getState().form.productWizard)
            }));
        });

        describe('and removed', function() {
            beforeEach(function() {
                unmountComponentAtNode(findDOMNode(component).parentNode);
            });

            it('should dispatch wizardDestroyed()', function() {
                expect(productWizardActions.wizardDestroyed).toHaveBeenCalledWith();
            });
        });

        describe('methods:', function() {
            beforeEach(function() {
                props.productData = {
                    extID: createUuid(),
                    name: 'My Awesome Product',
                    description: 'This is why it is awesome',
                    images: [
                        { uri: 'http://www.thumbs.com/foo', type: 'thumbnail' }
                    ],
                    price: 'Free'
                };
                props.targeting = {
                    age: [TARGETING.AGE.TEENS, TARGETING.AGE.ADULTS],
                    gender: TARGETING.GENDER.MALE
                };
                component = findRenderedComponentWithType(renderIntoDocument(
                    <Provider store={store}>
                        <ProductWizard {...props} />
                    </Provider>
                ), ProductWizard.WrappedComponent);
            });

            describe('getProductData()', function() {
                it('should combine the productData with the appropriate form values', function() {
                    expect(component.getProductData()).toEqual(assign({}, component.props.productData, {
                        name: component.props.formValues.name,
                        description: component.props.formValues.description
                    }));
                });

                describe('if there is no productData', function() {
                    beforeEach(function() {
                        props.productData = null;
                        component = findRenderedComponentWithType(renderIntoDocument(
                            <Provider store={store}>
                                <ProductWizard {...props} />
                            </Provider>
                        ), ProductWizard.WrappedComponent);
                    });

                    it('should return null', function() {
                        expect(component.getProductData()).toBeNull();
                    });
                });
            });

            describe('getTargeting()', function() {
                it('should return the appropriate form values', function() {
                    expect(component.getTargeting()).toEqual({
                        age: component.props.formValues.age,
                        gender: component.props.formValues.gender
                    });
                });
            });
        });

        describe('WizardPlanInfoModal', function() {
            beforeEach(function() {
                this.planInfoModal = findRenderedComponentWithType(component, WizardPlanInfoModal);
            });

            it('should exist', function() {
                expect(this.planInfoModal).toEqual(jasmine.any(Object));
            });
            describe('dynamic text', function(){
                function generatePromo(num){ 
                    return [
                        {
                            id: 'none',
                            type: 'freeTrial',
                            data: {
                                trialLength: num
                            }
                        }
                    ];
                }
                it('should calculate the correct promotion strings', function(){
                    expect(component.formatPromotionString(component.getPromotionLength(generatePromo(1)))).toEqual('1 day');
                    expect(component.formatPromotionString(component.getPromotionLength(generatePromo(7)))).toEqual('1 week');
                    expect(component.formatPromotionString(component.getPromotionLength(generatePromo(2)))).toEqual('2 days');
                    expect(component.formatPromotionString(component.getPromotionLength(generatePromo(14)))).toEqual('2 weeks');
                });
                it('should calculate the correct impression number', function(){
                    expect(component.getNumOfImpressions({paymentPlans: 
                        [{id: 'pp-0Ekdsm05KVZ43Aqj', price: 50, impressionsPerDollar: 50 }]},
                        component.getPromotionLength(generatePromo(60)))).toEqual(5000);
                });
            });
            describe('props', function() {
                describe('show', function() {
                    it('should be false', function() {
                        expect(this.planInfoModal.props.show).toBe(false);
                    });
                });

                describe('actionPending', function() {
                    it('should be the value of page.checkingIfPaymentRequired', function() {
                        expect(this.planInfoModal.props.actionPending).toBe(props.page.checkingIfPaymentRequired);
                    });
                });

                describe('onClose()', function() {
                    beforeEach(function() {
                        this.planInfoModal.props.onClose();
                    });

                    it('should go to step 2', function() {
                        expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.goToStep(2));
                    });
                });
                describe('promotionString', function() {
                    it('should be the value of the formatted promotion length', function() {
                        expect(this.planInfoModal.props.promotionString).toBe(component.formatPromotionString(component.getPromotionLength(props.promotions)));
                    });
                });
                describe('numOfImpressions', function() {
                    it('should be calculated from the value of the promotions and payment plan config', function() {
                        expect(this.planInfoModal.props.numOfImpressions).
                        toBe(component.getNumOfImpressions({paymentPlans: 
                            [{id: 'pp-0Ekdsm05KVZ43Aqj', price: 50, impressionsPerDollar: 50}]},
                            component.getPromotionLength(props.promotions)));
                    });
                });
            });
        });

        describe('on step 0', function() {
            beforeEach(function() {
                component.props.page.step = 0;
                component.forceUpdate();
            });

            it('should render a WizardSearch', function() {
                let search = findRenderedComponentWithType(component, WizardSearch);

                expect(search).toEqual(jasmine.any(Object));
                expect(search.props.findProducts).toBe(component.props.findApps);
            });

            describe('WizardSearch', function() {
                let search;

                beforeEach(function() {
                    search = findRenderedComponentWithType(component, WizardSearch);
                });

                describe('props', function() {
                    beforeEach(function() {
                        store.dispatch.and.returnValue(Promise.resolve({}));
                    });

                    describe('onProductSelected(product)', function() {
                        let product;

                        beforeEach(function() {
                            product = { uri: 'http://www.rc.com/my-product' };

                            search.props.onProductSelected(product);
                        });

                        it('should call productSelected', function() {
                            expect(productWizardActions.productSelected).toHaveBeenCalledWith({ product });
                        });

                        describe('if the product is already selected', function() {
                            beforeEach(function() {
                                props.productData = { uri: product.uri, name: 'Name', description: 'Description' };
                                productWizardActions.productSelected.calls.reset();
                                component = findRenderedComponentWithType(renderIntoDocument(
                                    <Provider store={store}>
                                        <ProductWizard {...props} />
                                    </Provider>
                                ), ProductWizard.WrappedComponent);
                                search = findRenderedComponentWithType(component, WizardSearch);

                                search.props.onProductSelected(product);
                            });

                            it('should not select the product', function() {
                                expect(productWizardActions.productSelected).not.toHaveBeenCalled();
                            });

                            it('should go to step 1', function() {
                                expect(productWizardActions.goToStep).toHaveBeenCalledWith(1);
                            });
                        });
                    });
                });
            });
        });

        describe('on step 1', function() {
            beforeEach(function() {
                props.page.step = 1;
                props.productData = {
                    extID: createUuid(),
                    name: 'My Awesome Product',
                    description: 'This is why it is awesome',
                    images: [
                        { uri: 'http://www.thumbs.com/foo', type: 'thumbnail' }
                    ],
                    price: 'Free'
                };
                component = findRenderedComponentWithType(renderIntoDocument(
                    <Provider store={store}>
                        <ProductWizard {...props} />
                    </Provider>
                ), ProductWizard.WrappedComponent);
            });

            it('should not render a WizardSearch', function() {
                expect(scryRenderedComponentsWithType(component, WizardSearch).length).toBe(0, 'WizardSearch is rendered!');
            });

            it('should render a WizardEditProduct', function() {
                expect(scryRenderedComponentsWithType(component, WizardEditProduct).length).toBeGreaterThan(0, 'WizardEditProduct is not rendered!');
            });

            it('should render an AdPreview', function() {
                expect(scryRenderedComponentsWithType(component, AdPreview).length).toBe(1, 'AdPreview is not rendered.');
            });

            describe('AdPreview', function() {
                let preview;

                beforeEach(function() {
                    preview = findRenderedComponentWithType(component, AdPreview);
                });

                describe('props', function() {
                    describe('cardOptions', function() {
                        it('should exist', function() {
                            expect(preview.props.cardOptions).toEqual({
                                cardType: 'showcase-app',
                                advanceInterval: 3,
                                description: {
                                    show: false
                                }
                            });
                        });
                    });

                    describe('placementOptions', function() {
                        it('should exist', function() {
                            expect(preview.props.placementOptions).toEqual({
                                type: 'mobile-card',
                                branding: 'showcase-app--interstitial'
                            });
                        });
                    });

                    describe('productData', function() {
                        it('should be the stored productData and the state of the form merged together', function() {
                            expect(preview.props.productData).toEqual(component.getProductData());
                        });
                    });

                    describe('factory', function() {
                        it('should be the interstitial factory', function() {
                            expect(preview.props.factory).toBe(createInterstitialFactory);
                        });
                    });

                    describe('showLoadingAnimation', function() {
                        it('should be true', function() {
                            expect(preview.props.showLoadingAnimation).toBe(true);
                        });
                    });

                    describe('loadDelay', function() {
                        it('should be some number above 0', function() {
                            expect(preview.props.loadDelay).toBeGreaterThan(0);
                        });
                    });

                    describe('onLoadComplete()', function() {
                        beforeEach(function() {
                            store.dispatch.calls.reset();

                            preview.props.onLoadComplete();
                        });

                        it('should dispatch() previewLoaded()', function() {
                            expect(store.dispatch).toHaveBeenCalledWith(previewLoaded());
                        });
                    });

                    describe('when the preview is loaded', function() {
                        beforeEach(function() {
                            component.props.page.previewLoaded = true;
                            component.forceUpdate();
                        });

                        describe('showLoadingAnimation', function() {
                            it('should be false', function() {
                                expect(preview.props.showLoadingAnimation).toBe(false);
                            });
                        });

                        describe('loadDelay', function() {
                            it('should be 0', function() {
                                expect(preview.props.loadDelay).toBe(0);
                            });
                        });

                        describe('describe cardOptions', function() {
                            it('should show the description', function() {
                                expect(preview.props.cardOptions).toEqual({
                                    cardType: 'showcase-app',
                                    advanceInterval: 3,
                                    description: {
                                        show: true,
                                        autoHide: 3
                                    }
                                });
                            });
                        });
                    });
                });
            });

            describe('WizardEditProduct', function() {
                let edit;

                beforeEach(function() {
                    edit = findRenderedComponentWithType(component, WizardEditProduct);
                });

                describe('props', function() {
                    describe('productData', function() {
                        it('should be the productData', function() {
                            expect(edit.props.productData).toEqual(props.productData);
                        });
                    });

                    describe('onFinish()', function() {
                        let values;

                        beforeEach(function() {
                            values = { name: 'My new name', description: 'The new, improved description.' };
                            edit.props.onFinish(values);
                        });

                        it('should call goToStep(2)', function() {
                            expect(productWizardActions.goToStep).toHaveBeenCalledWith(2);
                        });
                    });
                });
            });
        });

        describe('on step 2', function() {
            beforeEach(function() {
                props.page.step = 2;
                props.productData = {
                    extID: createUuid(),
                    name: 'My Awesome Product',
                    description: 'This is why it is awesome',
                    images: [
                        { uri: 'http://www.thumbs.com/foo', type: 'thumbnail' }
                    ],
                    price: 'Free',
                    categories: ['Games', 'Food & Drink']
                };
                props.targeting = {
                    age: [TARGETING.AGE.KIDS],
                    gender: TARGETING.GENDER.FEMALE
                };
                component = findRenderedComponentWithType(renderIntoDocument(
                    <Provider store={store}>
                        <ProductWizard {...props} />
                    </Provider>
                ), ProductWizard.WrappedComponent);
            });

            it('should not render a WizardEditProduct', function() {
                expect(scryRenderedComponentsWithType(component, WizardEditProduct).length).toBe(0, 'WizardEditProduct is rendered!');
            });

            it('should render a WizardEditTargeting', function() {
                expect(scryRenderedComponentsWithType(component, WizardEditTargeting).length).toBeGreaterThan(0, 'WizardEditTargeting is not rendered!');
            });

            describe('WizardEditTargeting', function() {
                let targeting;

                beforeEach(function() {
                    targeting = findRenderedComponentWithType(component, WizardEditTargeting);
                });

                describe('props', function() {
                    describe('targeting', function() {
                        it('should be the targeting', function() {
                            expect(targeting.props.targeting).toEqual(props.targeting);
                        });
                    });

                    describe('categories', function() {
                        it('should be the categories', function() {
                            expect(targeting.props.categories).toEqual(props.productData.categories);
                        });

                        describe('if there is no productData', function() {
                            beforeEach(function() {
                                props.productData = null;
                                component = findRenderedComponentWithType(renderIntoDocument(
                                    <Provider store={store}>
                                        <ProductWizard {...props} />
                                    </Provider>
                                ), ProductWizard.WrappedComponent);
                                targeting = findRenderedComponentWithType(component, WizardEditTargeting);
                            });

                            it('should be an empty Array', function() {
                                expect(targeting.props.categories).toEqual([]);
                            });
                        });
                    });

                    describe('onFinish()', function() {
                        let values;

                        beforeEach(function() {
                            values = { age: component.props.formValues.age, gender: component.props.formValues.gender };
                            targeting.props.onFinish(values);
                        });

                        it('should call onFinish()', function() {
                            expect(props.onFinish).toHaveBeenCalledWith({
                                targeting: component.getTargeting(),
                                productData: component.getProductData()
                            });
                        });
                    });
                });
            });
        });

        describe('on step 3', function() {
            beforeEach(function() {
                props.page.step = 3;
                props.targeting = {
                    age: [TARGETING.AGE.KIDS],
                    gender: TARGETING.GENDER.FEMALE
                };
                props.productData = {
                    extID: createUuid(),
                    name: 'My Awesome Product',
                    description: 'This is why it is awesome',
                    images: [
                        { uri: 'http://www.thumbs.com/foo', type: 'thumbnail' }
                    ],
                    price: 'Free',
                    categories: ['Games', 'Food & Drink']
                };
                this.component = findRenderedComponentWithType(renderIntoDocument(
                    <Provider store={store}>
                        <ProductWizard {...props} />
                    </Provider>
                ), ProductWizard.WrappedComponent);
                this.planInfoModal = findRenderedComponentWithType(this.component, WizardPlanInfoModal);
            });

            it('should show the WizardPlanInfoModal', function() {
                expect(this.planInfoModal.props.show).toBe(true);
            });

            describe('the WizardPlanInfoModal onContinue() prop', function() {
                beforeEach(function() {
                    store.dispatch.calls.reset();

                    this.planInfoModal.props.onContinue();
                });

                it('should dispatch() collectPayment()', function() {
                    expect(store.dispatch).toHaveBeenCalledWith(collectPayment({
                        productData: this.component.getProductData(),
                        targeting: this.component.getTargeting()
                    }));
                });
            });
        });

        describe('on step 4', function() {
            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));

                component.props.page.step = 4;
                props.targeting = {
                    age: [TARGETING.AGE.KIDS],
                    gender: TARGETING.GENDER.FEMALE
                };
                props.productData = {
                    extID: createUuid(),
                    name: 'My Awesome Product',
                    description: 'This is why it is awesome',
                    images: [
                        { uri: 'http://www.thumbs.com/foo', type: 'thumbnail' }
                    ],
                    price: 'Free',
                    categories: ['Games', 'Food & Drink']
                };
                component = findRenderedComponentWithType(renderIntoDocument(
                    <Provider store={store}>
                        <ProductWizard {...props} />
                    </Provider>
                ), ProductWizard.WrappedComponent);
            });

            it('should render a WizardEditTargeting', function() {
                expect(scryRenderedComponentsWithType(component, WizardEditTargeting).length).toBeGreaterThan(0, 'WizardEditTargeting is not rendered!');
            });

            it('should render a WizardConfirmationModal', function() {
                expect(scryRenderedComponentsWithType(component, WizardConfirmationModal).length).toBeGreaterThan(0, 'WizardConfirmationModal is not rendered!');
            });

            describe('WizardConfirmationModal', function() {
                let modal;

                beforeEach(function() {
                    store.dispatch.calls.reset();

                    modal = findRenderedComponentWithType(component, WizardConfirmationModal);
                });

                describe('props', function() {
                    describe('startDate', function() {
                        it('should be computed from the promotions', function() {
                            const expected = getPaymentPlanStart(props.promotions);

                            expect(modal.props.startDate.isSame(expected)).toBe(true, `Expected: ${expected.format()}; got: ${modal.props.startDate.format()}`);
                        });

                        describe('if there are no promotions', function() {
                            beforeEach(function() {
                                props.promotions = null;
                                component = findRenderedComponentWithType(renderIntoDocument(
                                    <Provider store={store}>
                                        <ProductWizard {...props} />
                                    </Provider>
                                ), ProductWizard.WrappedComponent);
                                modal = findRenderedComponentWithType(component, WizardConfirmationModal);
                            });

                            it('should be null', function() {
                                expect(modal.props.startDate).toBeNull();
                            });
                        });
                    });

                    describe('getToken()', function() {
                        it('should be the getClientToken action', function() {
                            expect(modal.props.getToken).toBe(component.props.getClientToken);
                        });
                    });

                    describe('handleClose()', function() {
                        beforeEach(function() {
                            modal.props.handleClose();
                        });

                        it('should go to step 2', function() {
                            expect(productWizardActions.goToStep).toHaveBeenCalledWith(2);
                            expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.goToStep.calls.mostRecent().returnValue);
                        });
                    });

                    describe('onSubmit()', function() {
                        let payment;

                        beforeEach(function() {
                            payment = { nonce: createUuid(), cardholderName: 'Buttface McGee' };

                            modal.props.onSubmit(payment);
                        });

                        it('should create a campaign', function() {
                            expect(store.dispatch).toHaveBeenCalledWith(createCampaign({
                                payment,
                                productData: component.getProductData(),
                                targeting: component.getTargeting()
                            }));
                        });
                    });
                });
            });
        });

        describe('dispatch props', function() {
            let dispatchDeferred;

            beforeEach(function() {
                store.dispatch.and.returnValue((dispatchDeferred = defer()).promise);
            });

            describe('findApps()', function() {
                let result;

                beforeEach(function() {
                    result = component.props.findApps({ query: 'foo', limit: 10 });
                });

                it('should dispatch the findApps action', function() {
                    expect(searchActions.findApps).toHaveBeenCalledWith({ query: 'foo', limit: 10 });
                    expect(store.dispatch).toHaveBeenCalledWith(searchActions.findApps.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });

            describe('productSelected()', function() {
                let product;
                let result;

                beforeEach(function() {
                    product = { uri: 'http://www.rc.com/my-product' };
                    result = component.props.productSelected({ product });
                });

                it('should dispatch the productSelected action', function() {
                    expect(productWizardActions.productSelected).toHaveBeenCalledWith({ product });
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.productSelected.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });

            describe('goToStep()', function() {
                let step;
                let result;

                beforeEach(function() {
                    step = 2;
                    result = component.props.goToStep(step);
                });

                it('should dispatch the goToStep action', function() {
                    expect(productWizardActions.goToStep).toHaveBeenCalledWith(step);
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.goToStep.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });

            describe('wizardDestroyed()', function() {
                let result;

                beforeEach(function() {
                    result = component.props.wizardDestroyed();
                });

                it('should dispatch the wizardDestroyed action', function() {
                    expect(productWizardActions.wizardDestroyed).toHaveBeenCalledWith();
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.wizardDestroyed.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });

            describe('createCampaign()', function() {
                let payment, productData, targeting;
                let result;

                beforeEach(function() {
                    payment = { nonce: createUuid(), cardholderName: 'foo' };
                    productData = { foo: 'bar' };
                    targeting = { age: 'foo', gender: 'foo' };

                    result = component.props.createCampaign({ payment, productData, targeting });
                });

                it('should dispatch the createCampaign action', function() {
                    expect(productWizardActions.createCampaign).toHaveBeenCalledWith({ payment, productData, targeting });
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.createCampaign.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });

            describe('getClientToken()', function() {
                let result;

                beforeEach(function() {
                    result = component.props.getClientToken();
                });

                it('should dispatch the getClientToken action', function() {
                    expect(paymentActions.getClientToken).toHaveBeenCalledWith();
                    expect(store.dispatch).toHaveBeenCalledWith(paymentActions.getClientToken.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });
        });
    });
});
