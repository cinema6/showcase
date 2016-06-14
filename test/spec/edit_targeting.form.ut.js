'use strict';

import EditTargeting from '../../src/forms/EditTargeting';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer, getValues } from 'redux-form';
import { assign } from 'lodash';
import { AGE, GENDER } from '../../src/enums/targeting';
import { mount } from 'enzyme';

describe('EditTargeting', function() {
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
                    gender: GENDER.ALL,
                    age: AGE.ALL
                },
                categories: [],

                onSubmit: jasmine.createSpy('onSubmit()')
            };

            wrapper = mount(
                <Provider store={store}>
                    <EditTargeting {...props} />
                </Provider>,
                { attachTo: document.createElement('div') }
            );

            component = wrapper.findWhere(component => component.type().name === 'EditTargeting');
        });

        it('should exist', function() {
            expect(component.length).toEqual(1, 'EditTargeting is not rendered');
        });

        it('should be a form', function() {
            expect(component.find('form').length).toEqual(1, '<form> is not rendered');
            expect(store.getState().form.productWizard).toEqual(jasmine.any(Object));
            expect(component.props().fields).toEqual({
                gender: jasmine.objectContaining({
                    value: props.initialValues.gender
                }),
                age: jasmine.objectContaining({
                    value: props.initialValues.age
                })
            });
        });

        describe('when the form is submitted', function() {
            beforeEach(function() {
                component.find('form').first().simulate('submit');
            });

            it('should call onSubmit() with the values', function() {
                expect(props.onSubmit).toHaveBeenCalledWith({
                    gender: jasmine.anything(),
                    age: jasmine.anything()
                }, jasmine.any(Function));
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
