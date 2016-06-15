'use strict';

import EditProduct from '../../src/forms/EditProduct';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer, getValues } from 'redux-form';
import { assign } from 'lodash';

describe('EditProduct', function() {
    describe('when rendered', function() {
        let state, store;
        let props, wrapper, component;

        beforeEach(function() {
            state = {

            };
            store = createStore((s, action) => assign({}, s, state, {
                form: reducer(s.form, action)
            }), {});

            props = {
                initialValues: {
                    name: 'This is a great thing!',
                    description: 'My app is the greatest app to ever live!'
                },

                onSubmit: jasmine.createSpy('onSubmit()')
            };

            wrapper = mount(
                <Provider store={store}>
                    <EditProduct {...props} />
                </Provider>,
                { attachTo: document.createElement('div') }
            );
            component = wrapper.findWhere(component => component.type().name === 'EditProduct');
        });

        it('should exist', function() {
            expect(component.length).toEqual(1, 'EditProduct is not rendered');
        });

        it('should be a form', function() {
            expect(component.find('form').length).toEqual(1, '<form> is not rendered');
            expect(store.getState().form.productWizard).toEqual(jasmine.any(Object));
            expect(component.props().fields).toEqual({
                name: jasmine.objectContaining({
                    value: props.initialValues.name
                }),
                description: jasmine.objectContaining({
                    value: props.initialValues.description
                })
            });
        });

        it('should contain inputs for the name and description', function() {
            let name = component.find('input').first();
            let description = component.find('textarea').first();

            expect(name.prop('value')).toBe(props.initialValues.name);
            expect(description.prop('value')).toBe(props.initialValues.description);
        });

        describe('when the form is submitted', function() {
            beforeEach(function() {
                component.find('form').simulate('submit');
            });

            it('should call onSubmit() with the values', function() {
                expect(props.onSubmit).toHaveBeenCalledWith(getValues(store.getState().form.productWizard), jasmine.any(Function));
            });
        });

        describe('when the component is destroyed', function() {
            beforeEach(function() {
                wrapper.detach();
            });

            it('should not wipe out the form state', function() {
                expect(getValues(store.getState().form.productWizard)).toEqual(props.initialValues);
            });
        });
    });
});
