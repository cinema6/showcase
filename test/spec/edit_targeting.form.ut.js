'use strict';

import EditTargeting from '../../src/forms/EditTargeting';
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
import { AGE, GENDER } from '../../src/enums/targeting';

describe('EditTargeting', function() {
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
                    gender: GENDER.ALL,
                    age: AGE.ALL
                },

                onSubmit: jasmine.createSpy('onSubmit()')
            };

            component = findAllInRenderedTree(renderIntoDocument(
                <Provider store={store}>
                    <EditTargeting {...props} />
                </Provider>
            ), component => component.constructor.name === 'EditTargeting')[0];

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should be a form', function() {
            expect(findRenderedDOMComponentWithTag(component, 'form')).toEqual(jasmine.any(Object));
            expect(store.getState().form.productWizard).toEqual(jasmine.any(Object));
            expect(component.props.fields).toEqual({
                gender: jasmine.objectContaining({
                    value: props.initialValues.gender
                }),
                age: jasmine.objectContaining({
                    value: props.initialValues.age
                })
            });
        });

        describe('age selection', function() {
            let radiogroup;

            beforeEach(function() {
                radiogroup = scryRenderedDOMComponentsWithTag(component, 'radiogroup')[0];
            });

            it('should change values', function() {
                let [all, zeroTo12, thirteenPlus, eitghteenPlus] = radiogroup.querySelectorAll('input');

                expect(all.checked).toBeTruthy('all');

                component.props.fields.age.value = AGE.ZERO_TO_TWELVE;
                component.forceUpdate();
                expect(zeroTo12.checked).toBeTruthy(AGE.ZERO_TO_TWELVE);

                component.props.fields.age.value = AGE.THIRTEEN_PLUS;
                component.forceUpdate();
                expect(thirteenPlus.checked).toBeTruthy(AGE.THIRTEEN_PLUS);

                component.props.fields.age.value = AGE.EIGHTEEN_PLUS;
                component.forceUpdate();
                expect(eitghteenPlus.checked).toBeTruthy(AGE.EIGHTEEN_PLUS);
            });
        });

        describe('gender selection', function() {
            let radiogroup;

            beforeEach(function() {
                radiogroup = scryRenderedDOMComponentsWithTag(component, 'radiogroup')[1];
            });

            it('should change values', function() {
                let [all, female, male] = radiogroup.querySelectorAll('input');

                expect(all.checked).toBeTruthy('all');

                component.props.fields.gender.value = GENDER.FEMALE;
                component.forceUpdate();
                expect(female.checked).toBeTruthy(GENDER.FEMALE);

                component.props.fields.gender.value = GENDER.MALE;
                component.forceUpdate();
                expect(male.checked).toBeTruthy(GENDER.MALE);
            });
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
