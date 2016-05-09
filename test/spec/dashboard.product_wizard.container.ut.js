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
import { reducer as formReducer } from 'redux-form';
import { assign } from 'lodash';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';
import { findDOMNode, unmountComponentAtNode } from 'react-dom';
import { getClientToken } from '../../src/actions/payment';

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

            __esModule: true
        };
        searchActions = {
            findApps: jasmine.createSpy('findApps()').and.callFake(findApps),

            __esModule: true
        };

        ProductWizard = proxyquire('../../src/containers/Dashboard/ProductWizard', {
            'react': React,

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
            state = {

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
                }
            };

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
                                props.page.productData = { uri: product.uri };
                                productWizardActions.productSelected.calls.reset();

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
                component.props.page.step = 1;
                component.props.page.productData = {
                    extID: createUuid(),
                    name: 'My Awesome Product',
                    description: 'This is why it is awesome'
                };
                component.forceUpdate();
            });

            it('should not render a WizardSearch', function() {
                expect(scryRenderedComponentsWithType(component, WizardSearch).length).toBe(0, 'WizardSearch is rendered!');
            });

            it('should render a WizardEditProduct', function() {
                expect(scryRenderedComponentsWithType(component, WizardEditProduct).length).toBeGreaterThan(0, 'WizardEditProduct is not rendered!');
            });

            describe('WizardEditProduct', function() {
                let edit;

                beforeEach(function() {
                    edit = findRenderedComponentWithType(component, WizardEditProduct);
                });

                describe('props', function() {
                    describe('productData', function() {
                        it('should be the productData', function() {
                            expect(edit.props.productData).toEqual(props.page.productData);
                        });
                    });

                    describe('onFinish()', function() {
                        let values;

                        beforeEach(function() {
                            values = { title: 'My new name', description: 'The new, improved description.' };
                            edit.props.onFinish(values);
                        });

                        it('should call productEdited()', function() {
                            expect(productWizardActions.productEdited).toHaveBeenCalledWith({ data: { name: values.title, description: values.description } });
                        });
                    });
                });
            });
        });

        describe('on step 2', function() {
            beforeEach(function() {
                component.props.page.step = 2;
                component.props.page.targeting = {
                    age: TARGETING.AGE.ZERO_TO_TWELVE,
                    gender: TARGETING.GENDER.FEMALE
                };
                component.forceUpdate();
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
                            expect(targeting.props.targeting).toEqual(props.page.targeting);
                        });
                    });

                    describe('onFinish()', function() {
                        let values;

                        beforeEach(function() {
                            values = { age: TARGETING.AGE.EIGHTEEN_PLUS, gender: TARGETING.GENDER.MALE };
                            targeting.props.onFinish(values);
                        });

                        it('should call targetingEdited()', function() {
                            expect(productWizardActions.targetingEdited).toHaveBeenCalledWith({ data: values });
                        });
                    });
                });
            });
        });

        describe('on step 3', function() {
            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));

                component.props.page.step = 3;
                component.props.page.targeting = {
                    age: TARGETING.AGE.ZERO_TO_TWELVE,
                    gender: TARGETING.GENDER.FEMALE
                };
                component.forceUpdate();
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
                            expect(productWizardActions.createCampaign).toHaveBeenCalledWith({ payment, productData: props.page.productData, targeting: props.page.targeting });
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

            describe('productEdited()', function() {
                let data;
                let result;

                beforeEach(function() {
                    data = { name: 'The name', description: 'the description' };
                    result = component.props.productEdited({ data });
                });

                it('should dispatch the productEdited action', function() {
                    expect(productWizardActions.productEdited).toHaveBeenCalledWith({ data });
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.productEdited.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });

            describe('targetingEdited()', function() {
                let data;
                let result;

                beforeEach(function() {
                    data = { age: TARGETING.AGE.EIGHTEEN_PLUS, gender: TARGETING.GENDER.MALE };
                    result = component.props.targetingEdited({ data });
                });

                it('should dispatch the targetingEdited action', function() {
                    expect(productWizardActions.targetingEdited).toHaveBeenCalledWith({ data });
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.targetingEdited.calls.mostRecent().returnValue);
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
