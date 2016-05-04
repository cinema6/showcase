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

const proxyquire = require('proxyquire');

describe('AddProduct', function() {
    let AddProduct;

    beforeEach(function() {
        AddProduct = proxyquire('../../src/containers/Dashboard/AddProduct', {
            'react': React,

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
                        step: 0
                    }
                }
            };
            store = createStore(compose(
                (s, action) => assign({}, s, {
                    form: formReducer(s.form, action)
                }),
                s => assign({}, s, state)
            ));

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
                product: null
            }));
        });
    });
});