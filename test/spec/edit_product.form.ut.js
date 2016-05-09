'use strict';

import EditProduct from '../../src/forms/EditProduct';
import {
    renderIntoDocument,
    findAllInRenderedTree,
    findRenderedDOMComponentWithTag,
    scryRenderedDOMComponentsWithTag,
    Simulate
} from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer, getValues } from 'redux-form';
import { assign } from 'lodash';
import { unmountComponentAtNode, findDOMNode } from 'react-dom';

describe('EditProduct', function() {
    describe('when rendered', function() {
        let state, store;
        let props, component;

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

            component = findAllInRenderedTree(renderIntoDocument(
                <Provider store={store}>
                    <EditProduct {...props} />
                </Provider>
            ), component => component.constructor.name === 'EditProduct')[0];

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should be a form', function() {
            expect(findRenderedDOMComponentWithTag(component, 'form')).toEqual(jasmine.any(Object));
            expect(store.getState().form.productWizard).toEqual(jasmine.any(Object));
            expect(component.props.fields).toEqual({
                name: jasmine.objectContaining({
                    value: props.initialValues.name
                }),
                description: jasmine.objectContaining({
                    value: props.initialValues.description
                })
            });
        });

        it('should contain inputs for the name and description', function() {
            let [name] = scryRenderedDOMComponentsWithTag(component, 'input');
            let [description] = scryRenderedDOMComponentsWithTag(component, 'textarea');

            expect(name.value).toBe(props.initialValues.name);
            expect(description.value).toBe(props.initialValues.description);
        });

        describe('when the form is submitted', function() {
            beforeEach(function() {
                Simulate.submit(findRenderedDOMComponentWithTag(component, 'form'));
            });

            it('should call onSubmit() with the values', function() {
                expect(props.onSubmit).toHaveBeenCalledWith(getValues(store.getState().form.productWizard), jasmine.any(Function));
            });
        });

        describe('when the component is destroyed', function() {
            beforeEach(function() {
                unmountComponentAtNode(findDOMNode(component).parentNode);
            });

            it('should not wipe out the form state', function() {
                expect(getValues(store.getState().form.productWizard)).toEqual(props.initialValues);
            });
        });
    });
});
