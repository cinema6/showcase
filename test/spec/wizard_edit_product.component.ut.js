'use strict';

import WizardEditProduct from '../../src/components/WizardEditProduct';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import React from 'react';
import { reducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import EditProductForm from '../../src/forms/EditProduct';

describe('WizardEditProduct', function() {
    describe('when rendered', function() {
        let store;
        let props, component;

        beforeEach(function() {
            store = createStore(combineReducers({
                form: reducer
            }), {});

            props = {
                productData: {
                    name: 'My App',
                    description: 'Is the best!'
                },

                onFinish: jasmine.createSpy('onFinish()')
            };

            component = mount(
                <Provider store={store}>
                    <WizardEditProduct {...props} />
                </Provider>
            ).find(WizardEditProduct);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component.length).toBe(1, 'WizardEditProduct not rendered.');
        });

        it('should render a EditProductForm', function() {
            expect(component.find(EditProductForm).length).toBeGreaterThan(0, 'Could not find an EditProductForm');
        });

        describe('the EditProductForm', function() {
            let form;

            beforeEach(function() {
                form = component.find(EditProductForm);
            });

            it('should be passed some initialValues', function() {
                expect(form.props().initialValues).toEqual({
                    name: props.productData.name,
                    description: props.productData.description
                });
            });

            describe('when submit', function() {
                let values;

                beforeEach(function() {
                    values = {
                        name: 'My Modified Title',
                        description: 'My modified description. Yay!'
                    };

                    form.props().onSubmit(values, store.dispatch);
                });

                it('should call props.onFinish() with the values', function() {
                    expect(component.props().onFinish).toHaveBeenCalledWith(values);
                });
            });
        });
    });
});
