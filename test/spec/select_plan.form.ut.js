import React from 'react';
import SelectPlan from '../../src/forms/SelectPlan';
import { mount } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import { reducer } from 'redux-form';
import numeral from 'numeral';

describe('SelectPlan', () => {
    let store;

    let props;
    let wrapper;
    let component;

    beforeEach(() => {
        store = createStore(combineReducers({
            form: reducer
        }));

        props = {
            store,
            plans: [
                {
                    id: 'pp-0Ek6Vw0bWnqdlr61',
                    price: 10,
                    viewsPerMonth: 2000,
                    label: 'Baby',
                    maxCampaigns: 1
                },
                {
                    id: 'pp-0Ek6V-0bWnuhLfQl',
                    price: 24.99,
                    viewsPerMonth: 4000,
                    label: 'Kid',
                    maxCampaigns: 5
                },
                {
                    id: 'pp-0Ek6Ws0bWnxCV-B7',
                    price: 49.99,
                    viewsPerMonth: 10000,
                    label: 'Adult',
                    maxCampaigns: 10
                }
            ],
            currentPlan: 'pp-0Ek6V-0bWnuhLfQl',
            formKey: 'productWizard'
        };

        wrapper = mount(<SelectPlan {...props} />, { context: { store }, attachTo: document.createElement('div') });
        component = wrapper.findWhere(node => node.name() === 'SelectPlan');
    });

    afterEach(() => {
        store = null;

        props = null;
        wrapper = null;
        component = null;
    });

    it('should exist', () => {
        expect(component.length).toBe(1, '<SelectPlan> not rendered.');
    });

    it('should render a <form>', () => {
        expect(component.find('form').length).toBe(1, '<form> not rendered.');
    });

    it('should render a <div> for each plan', () => {
        expect(component.find('.payment-plan').length).toBe(props.plans.length);

        props.plans.forEach((plan, index) => {
            const element = component.find('.payment-plan').at(index);
            const label = element.find('label');
            const radio = element.find('input[type="radio"]');

            expect(radio.props()).toEqual(jasmine.objectContaining({ name: plan.id, id: plan.id }));
            expect(label.prop('htmlFor')).toBe(plan.id);
            expect(element.find('.plan-box-header h3').text()).toBe(plan.label);
            expect(element.find('.plan-box-item').at(0).find('h2').text()).toBe(numeral(plan.viewsPerMonth).format('0,0'));
            expect(element.find('.plan-box-item').at(1).find('h3').text()).toBe(numeral(plan.price).format('$0,0.00'));
            expect(element.find('.plan-box-item').at(2).text()).toBe(`Promote ${plan.maxCampaigns} App${plan.maxCampaigns > 1 ? 's' : ''}`);
        });
    });

    it('should use .choose-plan and .current-plan as appropriate', () => {
        const first = component.find('.plan-box-footer').at(0);
        const second = component.find('.plan-box-footer').at(1);

        expect(first.hasClass('choose-plan')).toBe(true, 'lacks class "choose-plan"');
        expect(first.hasClass('current-plan')).toBe(false, 'has class "current-plan"');

        expect(second.hasClass('current-plan')).toBe(true, 'lacks class "current-plan"');
        expect(second.hasClass('choose-plan')).toBe(false, 'has class "choose-plan"');
    });

    describe('when a radio is clicked', () => {
        let input;

        beforeEach(() => {
            input = component.find('input').at(1);

            input.simulate('change');
        });

        afterEach(() => {
            input = null;
        });

        it('should update the plan', () => {
            expect(store.getState()).toEqual(jasmine.objectContaining({
                form: jasmine.objectContaining({
                    selectPlan: jasmine.objectContaining({
                        productWizard: jasmine.objectContaining({
                            plan: jasmine.objectContaining({
                                value: props.plans[1].id
                            })
                        })
                    })
                })
            }));
        });

        it('should check the proper <input>', () => {
            expect(input.prop('checked')).toBe(true);
        });
    });

    describe('if there are no plans', () => {
        beforeEach(() => {
            wrapper.setProps({ plans: undefined });
        });

        it('should render nothing', () => {
            expect(component.find('.payment-plan').length).toBe(0);
        });
    });

    describe('when the component is unmounted', () => {
        beforeEach(() => {
            component.find('input').at(1).simulate('change');

            wrapper.unmount();
        });

        it('should not destroy the form', () => {
            expect(store.getState().form.selectPlan.productWizard.plan.value).toBe(props.plans[1].id);
        });
    });
});
