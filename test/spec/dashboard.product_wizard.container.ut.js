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
import { productSelected, productEdited } from '../../src/actions/product_wizard';
import WizardSearch from '../../src/components/WizardSearch';
import WizardEditProduct from '../../src/components/WizardEditProduct';
import { reducer as formReducer } from 'redux-form';
import { assign } from 'lodash';
import { createUuid } from 'rc-uuid';

const proxyquire = require('proxyquire');

describe('ProductWizard', function() {
    let searchActions, productWizardActions;
    let ProductWizard;

    beforeEach(function() {
        productWizardActions = {
            productSelected: jasmine.createSpy('productSelected()').and.callFake(productSelected),
            productEdited: jasmine.createSpy('productEdited()').and.callFake(productEdited),

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
            '../../actions/search': searchActions,
            '../../actions/product_wizard': productWizardActions
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
                    productData: null
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

                it('should dispatch the productSelected action', function() {
                    expect(productWizardActions.productEdited).toHaveBeenCalledWith({ data });
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.productEdited.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });
        });
    });
});
