'use strict';

import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import ProductWizard from '../../src/containers/Dashboard/ProductWizard';
import { reducer as formReducer } from 'redux-form';
import { assign } from 'lodash';
import { wizardComplete } from '../../src/actions/product_wizard';

const proxyquire = require('proxyquire');

describe('AddProduct', function() {
    let productWizardActions;
    let AddProduct;

    beforeEach(function() {
        productWizardActions = {
            wizardComplete: jasmine.createSpy('wizardComplete()').and.callFake(wizardComplete),

            __esModule: true
        };

        AddProduct = proxyquire('../../src/containers/Dashboard/AddProduct', {
            'react': React,

            '../../actions/product_wizard': productWizardActions,
            './ProductWizard': {
                default: ProductWizard,

                __esModule: true
            }
        }).default;
    });

    it('should wrap the ProductWizard component', function() {
        expect(AddProduct.WrappedComponent.WrappedComponent).toBe(ProductWizard.WrappedComponent);
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            state = {
                page: {
                    'dashboard.add_product': {
                        step: 0,
                        productData: {
                            name: 'Awesome App',
                            description: 'It is the best.'
                        },
                        targeting: { age: 'foo', gender: 'foo' }
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

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <AddProduct {...props} />
                </Provider>
            ), ProductWizard);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should inject the dashboard.add_product page', function() {
            expect(component.props.page).toEqual(state.page['dashboard.add_product']);
        });

        it('should map the state to some props', function() {
            expect(component.props).toEqual(jasmine.objectContaining({
                steps: [0, 1, 2, 3],

                productData: state.page['dashboard.add_product'].productData,
                targeting: state.page['dashboard.add_product'].targeting
            }));
        });

        describe('dispatch props', function() {
            let result;

            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));
            });

            describe('loadData()', function() {
                let success, failure;

                beforeEach(function(done) {
                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    component.props.loadData().then(success, failure);
                    setTimeout(done);
                });

                it('should fulfill with undefined', function() {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('onFinish()', function() {
                let targeting, productData;

                beforeEach(function() {
                    targeting = {
                        age: '0-12',
                        gender: 'Female'
                    };
                    productData = {
                        name: 'My awesome product!',
                        description: 'It is really great!'
                    };

                    result = component.props.onFinish({ targeting, productData });
                });

                it('should dispatch wizardComplete()', function() {
                    expect(productWizardActions.wizardComplete).toHaveBeenCalledWith({ targeting, productData });
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.wizardComplete.calls.mostRecent().returnValue);
                    expect(result).toBe(store.dispatch.calls.mostRecent().returnValue);
                });
            });
        });
    });
});
