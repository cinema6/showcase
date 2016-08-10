import ChangePlanModal from '../../src/components/ChangePlanModal';
import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { mount, ReactWrapper } from 'enzyme';
import SelectPlan from '../../src/forms/SelectPlan';
import { createStore } from 'redux';
import moment from 'moment';
import { createUuid } from 'rc-uuid';

describe('ChangePlanModal', () => {
    let state;
    let store;
    let props;
    let component;
    let modal;

    function getModal() {
        return new ReactWrapper(component.find('Portal').prop('children'), null, {
            context: {
                $bs_modal: { onHide: () => {} },
                store
            },
            childContextTypes: {
                $bs_modal: PropTypes.object.isRequired,
                store: PropTypes.object.isRequired
            }
        });
    }

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
        component = mount(
            <ChangePlanModal {...props} />,
            {
                context: { store },
                childContextTypes: { store: PropTypes.object.isRequired }
            }
        );
        modal = getModal();
    });

    afterEach(() => {
        state = null;
        store = null;
        props = null;
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
        expect(modal.find('.modal-header p').text()).toBe(`Your billing cycle ends on ${props.cycleEnd.format('MMM DD')}`);
    });

    describe('the SelectPlan form', () => {
        let form;

        beforeEach(() => {
            form = modal.find(SelectPlan);
        });

        afterEach(() => {
            form = null;
        });

        it('should exist', () => {
            expect(form.length).toEqual(1, 'SelectPlan not rendered.');
            expect(form.prop('plans')).toEqual(props.plans);
            expect(form.prop('currentPlan')).toBe(props.currentPlan);
            expect(form.prop('formKey')).toBe('change');
            expect(form.prop('initialValues')).toEqual({ plan: props.currentPlan });
        });
    });

    describe('if the user has more apps than the selected plan', () => {
        beforeEach(() => {
            component.setProps({
                selectedPlan: props.plans[1].id,
                currentPlan: props.plans[2].id,
                amountOfCampaigns: 7
            });
            modal = getModal();
        });

        it('should show a warning', () => {
            expect(modal.find('.alert-warning').length).toBe(1);
            expect(modal.find('.alert').length).toBe(1);
        });
    });

    describe('if the user is upgrading', () => {
        beforeEach(() => {
            component.setProps({
                selectedPlan: props.plans[1].id,
                currentPlan: props.plans[0].id,
                amountOfCampaigns: 1
            });
            modal = getModal();
        });

        it('should show a message', () => {
            expect(modal.find('.alert-success').length).toBe(1);
            expect(modal.find('.alert').length).toBe(1);
        });
    });

    describe('if the user has no current plan', () => {
        beforeEach(() => {
            component.setProps({
                currentPlan: undefined,
                cycleEnd: undefined,
                amountOfCampaigns: 0
            });
            modal = getModal();
        });

        it('should show no messages', () => {
            expect(modal.find('.alert').length).toBe(0);
        });

        it('should show no subheader', () => {
            expect(modal.find('.modal-header p').length).toBe(0);
        });
    });

    describe('if there are no plans', () => {
        let button;
        beforeEach(() => {
            component.setProps({
                plans: undefined
            });
            modal = getModal();
            button = modal.find(Button);
        });

        it('should show no messages', () => {
            expect(modal.find('.alert').length).toBe(0);
        });
        it('should disable the button', () => {
            expect(button.prop('disabled')).toBe(true);
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

    describe('if the currentPlan is not in the plans Array', () => {
        let currentPlan;

        beforeEach(() => {
            currentPlan = `pp-${createUuid()}`;

            component.setProps({ currentPlan });
            modal = getModal();
        });

        afterEach(() => {
            currentPlan = null;
        });

        it('should set the middle plan as the initialValue', () => {
            expect(modal.find(SelectPlan).prop('initialValues')).toEqual({ plan: props.plans[1].id });
        });
    });

    describe('the confirm Button', () => {
        let button;

        beforeEach(() => {
            button = modal.find(Button);
        });

        afterEach(() => {
            button = null;
        });

        it('should exist', () => {
            expect(button.length).toBe(1);
        });

        it('should not be in a submitting state', () => {
            expect(button.prop('disabled')).toBe(false);
            expect(button.hasClass('btn-waiting')).toBe(false, 'Has .btn-waiting');
        });

        describe('if actionPending is true', () => {
            beforeEach(() => {
                component.setProps({
                    actionPending: true
                });

                modal = getModal();
                button = modal.find(Button);

            });

            it('should be in a submitting state', () => {
                expect(button.prop('disabled')).toBe(true);
                expect(button.prop('className').split(' ')).toContain('btn-waiting');
            });
        });
        describe('if the plans are not loaded', () => {
            beforeEach(() => {
                component.setProps({
                    plans: []
                });
                modal = getModal();
                button = modal.find(Button);
            });

            it('should show no messages', () => {
                expect(modal.find('.alert').length).toBe(0);
            });
            it('should disable the button', () => {
                expect(button.prop('disabled')).toBe(true);
            });
        });

        describe('when clicked', () => {
            beforeEach(() => {
                button.prop('onClick')();
            });

            it('should call onConfirm()', () => {
                expect(props.onConfirm).toHaveBeenCalledWith(props.selectedPlan);
            });
        });
    });

    describe('the cancel Button', () => {
        let button;

        beforeEach(() => {
            button = modal.find('.btn-link');
        });

        afterEach(() => {
            button = null;
        });

        describe('when clicked', () => {
            beforeEach(() => {
                button.simulate('click');
            });

            it('should call onCancel()', () => {
                expect(props.onCancel).toHaveBeenCalledWith();
            });
        });
    });
});
