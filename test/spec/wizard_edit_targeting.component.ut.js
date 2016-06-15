'use strict';

import WizardEditTargeting from '../../src/components/WizardEditTargeting';
import { mount } from 'enzyme';
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
                categories: ['Food & Drink', 'Games'],

                onFinish: jasmine.createSpy('onFinish()')
            };

            component = mount(
                <Provider store={store}>
                    <WizardEditTargeting {...props} />
                </Provider>
            ).find(WizardEditTargeting);
        });

        it('should exist', function() {
            expect(component.length).toBe(1, 'WizardEditTargeting not rendered');
        });

        it('should render a EditTargetingForm', function() {
            expect(component.find(EditTargetingForm).length).toBeGreaterThan(0, 'Could not find an EditTargetingForm');
        });

        describe('the EditTargetingForm', function() {
            let form;

            beforeEach(function() {
                form = component.find(EditTargetingForm);
            });

            it('should be passed some initialValues', function() {
                expect(form.props().initialValues).toEqual({
                    age: props.targeting.age,
                    gender: props.targeting.gender
                });
            });

            it('should be passed the categories', function() {
                expect(form.props().categories).toEqual(props.categories);
            });

            describe('when submit', function() {
                let values;

                beforeEach(function() {
                    values = {
                        age: TARGETING.AGE.TEENS,
                        gender: TARGETING.AGE.MALE
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
