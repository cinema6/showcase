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
import { productSelected, productEdited, targetingEdited, goToStep, wizardDestroyed, createCampaign } from '../../src/actions/product_wizard';
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

const proxyquire = require('proxyquire');

describe('ProductWizard', function() {
    let searchActions, productWizardActions, paymentActions;
    let ProductWizard;

    beforeEach(function() {
        jasmine.clock().install();

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

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
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
                            value: '13+'
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
                    targeting: {
                        age: TARGETING.AGE.ALL,
                        gender: TARGETING.GENDER.ALL
                    }
                },

                steps: [0, 1, 2, 3],

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
                                cardType: 'showcase-app'
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
                            expect(preview.props.productData).toEqual(assign({}, props.productData, {
                                name: component.props.formValues.name,
                                description: component.props.formValues.description
                            }));
                        });
                    });

                    describe('factory', function() {
                        it('should be the interstitial factory', function() {
                            expect(preview.props.factory).toBe(createInterstitialFactory);
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
                    price: 'Free'
                };
                props.targeting = {
                    age: TARGETING.AGE.ZERO_TO_TWELVE,
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

                    describe('onFinish()', function() {
                        let values;

                        beforeEach(function() {
                            values = { age: TARGETING.AGE.EIGHTEEN_PLUS, gender: TARGETING.GENDER.MALE, name: 'The name', description: 'My app rules!' };
                            targeting.props.onFinish(values);
                        });

                        it('should call onFinish()', function() {
                            expect(props.onFinish).toHaveBeenCalledWith({
                                targeting: {
                                    age: values.age,
                                    gender: values.gender
                                },
                                productData: {
                                    name: values.name,
                                    description: values.description
                                }
                            });
                        });
                    });
                });
            });
        });

        describe('on step 3', function() {
            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));

                component.props.page.step = 3;
                props.targeting = {
                    age: TARGETING.AGE.ZERO_TO_TWELVE,
                    gender: TARGETING.GENDER.FEMALE
                };
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
                            expect(productWizardActions.createCampaign).toHaveBeenCalledWith({ payment, productData: props.productData, targeting: props.targeting });
                            expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.createCampaign.calls.mostRecent().returnValue);
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
