'use strict';

import WizardEditTargeting from '../../src/components/WizardEditTargeting';
import {
    renderIntoDocument,
    findRenderedComponentWithType,
    scryRenderedComponentsWithType
} from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import React from 'react';
import { reducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import EditTargetingForm from '../../src/forms/EditTargeting';
import * as TARGETING from '../../src/enums/targeting';

describe('WizardEditTargeting', function() {
    describe('when rendered', function() {
        let store;
        let props, component;

        beforeEach(function() {
            store = createStore(combineReducers({
                form: reducer
            }), {});

            props = {
                targeting: {
                    age: TARGETING.AGE.ALL,
                    gender: TARGETING.GENDER.ALL
                },

                onFinish: jasmine.createSpy('onFinish()')
            };

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <WizardEditTargeting {...props} />
                </Provider>
            ), WizardEditTargeting);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should render a EditTargetingForm', function() {
            expect(scryRenderedComponentsWithType(component, EditTargetingForm).length).toBeGreaterThan(0, 'Could not find an EditTargetingForm');
        });

        describe('the EditTargetingForm', function() {
            let form;

            beforeEach(function() {
                form = findRenderedComponentWithType(component, EditTargetingForm);
            });

            it('should be passed some initialValues', function() {
                expect(form.props.initialValues).toEqual({
                    age: props.targeting.age,
                    gender: props.targeting.gender
                });
            });

            describe('when submit', function() {
                let values;

                beforeEach(function() {
                    values = {
                        age: TARGETING.AGE.THIRTEEN_PLUS,
                        gender: TARGETING.AGE.MALE
                    };

                    form.props.onSubmit(values, store.dispatch);
                });

                it('should call props.onFinish() with the values', function() {
                    expect(component.props.onFinish).toHaveBeenCalledWith(values);
                });
            });
        });
    });
});
