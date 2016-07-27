import ChangePlanModal from '../../src/components/ChangePlanModal';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { mount } from 'enzyme';
import SelectPlan from '../../src/forms/SelectPlan';
import {
    findRenderedComponentWithType,
    scryRenderedDOMComponentsWithClass,
    Simulate
} from 'react-addons-test-utils';
import { findDOMNode } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import moment from 'moment';

describe('ChangePlanModal', () => {
    let state;
    let store;
    let props;
    let wrapper;
    let component;
    let modal;

    beforeEach(() => {
        state = {
            form: {}
        };

        store = createStore(() => state);

        props = {
            show: true,
            onClose: jasmine.createSpy('onClose()'),
            plans: [
                {
                    id: 'pp-0Ek6Vw0bWnqdlr61',
                    price: 10,
                    viewsPerMonth: 2000,
                    name: 'Baby',
                    maxCampaigns: 1
                },
                {
                    id: 'pp-0Ek6V-0bWnuhLfQl',
                    price: 24.99,
                    viewsPerMonth: 4000,
                    name: 'Kid',
                    maxCampaigns: 5
                },
                {
                    id: 'pp-0Ek6Ws0bWnxCV-B7',
                    price: 49.99,
                    viewsPerMonth: 10000,
                    name: 'Adult',
                    maxCampaigns: 10
                }
            ],
            currentPlan: 'pp-0Ek6V-0bWnuhLfQl',
            amountOfCampaigns: 5,
            selectedPlan: 'pp-0Ek6Vw0bWnqdlr61',
            actionPending: false,
            onConfirm: jasmine.createSpy('onChange()'),
            onCancel: jasmine.createSpy('onCancel()'),
            cycleEnd: moment().add(5, 'days').utcOffset(0).endOf('day')
        };
        wrapper = mount(
            <Provider store={store}>
                <ChangePlanModal {...props} />
            </Provider>
        );
        component = wrapper.find(ChangePlanModal);
        modal = component.find(Modal).node._modal;
    });

    afterEach(() => {
        state = null;
        store = null;
        props = null;
        wrapper = null;
        component = null;
        modal = null;
    });

    it('should exist', () => {
        expect(component).toEqual(jasmine.any(Object));
    });

    it('should render a Modal', () => {
        const modal = component.find(Modal);

        expect(modal.length).toBe(1, 'Modal not rendered');
        expect(modal.props().show).toBe(props.show);
        expect(modal.props().onHide).toBe(props.onClose);
    });

    it('should show the cycleEnd', () => {
        expect(findDOMNode(modal).querySelector('.modal-header p').textContent).toBe(`Your billing cycle ends on ${props.cycleEnd.format('MMM DD')}`);
    });

    describe('the SelectPlan form', () => {
        let form;

        beforeEach(() => {
            form = findRenderedComponentWithType(modal, SelectPlan);
        });

        afterEach(() => {
            form = null;
        });

        it('should exist', () => {
            expect(form).toEqual(jasmine.any(Object));
            expect(form.props.plans).toEqual(props.plans);
            expect(form.props.currentPlan).toBe(props.currentPlan);
            expect(form.props.formKey).toBe('change');
            expect(form.props.initialValues).toEqual({ plan: props.currentPlan });
        });
    });

    describe('if the user has more apps than the selected plan', () => {
        beforeEach(() => {
            props.selectedPlan = props.plans[1].id;
            props.currentPlan = props.plans[2].id;
            props.amountOfCampaigns = 7;

            wrapper = mount(
                <Provider store={store}>
                    <ChangePlanModal {...props} />
                </Provider>
            );
            component = wrapper.find(ChangePlanModal);
            modal = component.find(Modal).node._modal;
        });

        it('should show a warning', () => {
            expect(scryRenderedDOMComponentsWithClass(modal, 'alert-warning').length).toBe(1);
            expect(scryRenderedDOMComponentsWithClass(modal, 'alert').length).toBe(1);
        });
    });

    describe('if the user is upgrading', () => {
        beforeEach(() => {
            props.selectedPlan = props.plans[1].id;
            props.currentPlan = props.plans[0].id;
            props.amountOfCampaigns = 1;

            wrapper = mount(
                <Provider store={store}>
                    <ChangePlanModal {...props} />
                </Provider>
            );
            component = wrapper.find(ChangePlanModal);
            modal = component.find(Modal).node._modal;
        });

        it('should show a message', () => {
            expect(scryRenderedDOMComponentsWithClass(modal, 'alert-success').length).toBe(1);
            expect(scryRenderedDOMComponentsWithClass(modal, 'alert').length).toBe(1);
        });
    });

    describe('if the user has no current plan', () => {
        beforeEach(() => {
            delete props.currentPlan;
            delete props.cycleEnd;
            props.amountOfCampaigns = 0;

            wrapper = mount(
                <Provider store={store}>
                    <ChangePlanModal {...props} />
                </Provider>
            );
            component = wrapper.find(ChangePlanModal);
            modal = component.find(Modal).node._modal;
        });

        it('should show no messages', () => {
            expect(scryRenderedDOMComponentsWithClass(modal, 'alert').length).toBe(0);
        });

        it('should show no subheader', () => {
            expect(findDOMNode(modal).querySelector('.modal-header p')).toBeNull();
        });
    });

    describe('if there are no plans', () => {
        beforeEach(() => {
            delete props.plans;
            wrapper = mount(
                <Provider store={store}>
                    <ChangePlanModal {...props} />
                </Provider>
            );
            component = wrapper.find(ChangePlanModal);
            modal = component.find(Modal).node._modal;
        });

        it('should show no messages', () => {
            expect(scryRenderedDOMComponentsWithClass(modal, 'alert').length).toBe(0);
        });
    });

    describe('if there is no selectedPlan', () => {
        beforeEach(() => {
            component.setProps({
                selectedPlan: undefined
            });
            modal = getModal();
        });

        it('should show no messages', () => {
            expect(modal.find('.alert').length).toBe(0);
        });
    });

    describe('the confirm Button', () => {
        let button;

        beforeEach(() => {
            button = findRenderedComponentWithType(modal, Button);
        });

        afterEach(() => {
            button = null;
        });

        it('should exist', () => {
            expect(button).toEqual(jasmine.any(Object));
        });

        it('should not be in a submitting state', () => {
            expect(button.props.disabled).toBe(false);
            expect(findDOMNode(button).classList).not.toContain('btn-waiting');
        });

        describe('if actionPending is true', () => {
            beforeEach(() => {
                props.actionPending = true;

                wrapper = mount(
                    <Provider store={store}>
                        <ChangePlanModal {...props} />
                    </Provider>
                );
                component = wrapper.find(ChangePlanModal);
                modal = component.find(Modal).node._modal;
                button = findRenderedComponentWithType(modal, Button);
            });

            it('should be in a submitting state', () => {
                expect(button.props.disabled).toBe(true);
                expect(findDOMNode(button).classList).toContain('btn-waiting');
            });
        });

        describe('when clicked', () => {
            beforeEach(() => {
                button.props.onClick();
            });

            it('should call onConfirm()', () => {
                expect(props.onConfirm).toHaveBeenCalledWith(props.selectedPlan);
            });
        });
    });

    describe('the cancel Button', () => {
        let button;

        beforeEach(() => {
            button = findDOMNode(modal).querySelector('.btn-link');
        });

        afterEach(() => {
            button = null;
        });

        describe('when clicked', () => {
            beforeEach(() => {
                Simulate.click(button);
            });

            it('should call onCancel()', () => {
                expect(props.onCancel).toHaveBeenCalledWith();
            });
        });
    });
});
