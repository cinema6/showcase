import WizardPlanInfoModal from '../../src/components/WizardPlanInfoModal';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { mount } from 'enzyme';
import {
    findRenderedComponentWithType,
    findRenderedDOMComponentWithTag
} from 'react-addons-test-utils';
import { findDOMNode } from 'react-dom';
import numeral from 'numeral';
import SelectPlan from '../../src/forms/SelectPlan';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

describe('WizardPlanInfoModal', function() {
    beforeEach(function() {
        this.state = {
            form: {}
        };

        this.store = createStore(() => this.state);

        this.props = {
            show: true,
            onClose: jasmine.createSpy('onClose()'),
            onContinue: jasmine.createSpy('onContinue()'),
            actionPending: false,
            trialLength: 17,
            freeViews: 2500,
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
            selectedPlan: 'pp-0Ek6Vw0bWnqdlr61'
        };
        this.component = mount(
            <Provider store={this.store}>
                <WizardPlanInfoModal {...this.props} />
            </Provider>
        ).find(WizardPlanInfoModal);
        this.modal = this.component.find(Modal).node._modal;
    });

    it('should exist', function() {
        expect(this.component).toEqual(jasmine.any(Object));
    });

    it('should render a Modal', function() {
        const modal = this.component.find(Modal);

        expect(modal.length).toBe(1, 'Modal not rendered');
        expect(modal.props().show).toBe(this.props.show);
        expect(modal.props().onHide).toBe(this.props.onClose);
    });

    it('should only render one subheader', function() {
        expect(findDOMNode(this.modal).querySelectorAll('.modal-header p').length).toBe(1);
    });

    describe('if there are no plans', function() {
        beforeEach(function() {
            delete this.props.plans;
            this.component = mount(
                <Provider store={this.store}>
                    <WizardPlanInfoModal {...this.props} />
                </Provider>
            ).find(WizardPlanInfoModal);
            this.modal = this.component.find(Modal).node._modal;
            this.form = findRenderedComponentWithType(this.modal, SelectPlan);
        });

        it('should not set any initial form values', function() {
            expect(this.form.props.initialValues).toBeUndefined();
        });
    });

    describe('if the plan Array is empty', function() {
        beforeEach(function() {
            this.props.plans = [];
            this.component = mount(
                <Provider store={this.store}>
                    <WizardPlanInfoModal {...this.props} />
                </Provider>
            ).find(WizardPlanInfoModal);
            this.modal = this.component.find(Modal).node._modal;
            this.form = findRenderedComponentWithType(this.modal, SelectPlan);
        });

        it('should not set any initial form values', function() {
            expect(this.form.props.initialValues).toBeUndefined();
        });
    });

    describe('if the trialLength is 0', function() {
        beforeEach(function() {
            this.props.trialLength = 0;
            this.component = mount(
                <Provider store={this.store}>
                    <WizardPlanInfoModal {...this.props} />
                </Provider>
            ).find(WizardPlanInfoModal);
            this.modal = this.component.find(Modal).node._modal;

            this.header = findDOMNode(this.modal).querySelector('.modal-header .modal-title');
            this.subheader = findDOMNode(this.modal).querySelector('.modal-header p');
            this.button = findDOMNode(this.modal).querySelector('button.btn-danger');
        });

        it('should use generic text', function() {
            expect(this.subheader.textContent).toBe('Start promoting your app now');
            expect(this.button.textContent).toBe('Continue');
        });
    });

    describe('if the freeViews is 0', function() {
        beforeEach(function() {
            this.props.freeViews = 0;
            this.component = mount(
                <Provider store={this.store}>
                    <WizardPlanInfoModal {...this.props} />
                </Provider>
            ).find(WizardPlanInfoModal);
            this.modal = this.component.find(Modal).node._modal;

            this.header = findDOMNode(this.modal).querySelector('.modal-header .modal-title');
        });

        it('should use generic text', function() {
            expect(this.header.textContent).toBe('Reach thousands of people');
        });
    });

    describe('the number of impressions', function() {
        beforeEach(function() {
            this.header = findDOMNode(this.modal).querySelector('.modal-header .modal-title');
        });

        it('should be formatted', function() {
            expect(this.header.textContent).toBe(`Reach ${numeral(this.props.freeViews).format('0,0')} people for FREE`);
        });
    });

    describe('the length of the trial', function() {
        beforeEach(function() {
            this.header = findDOMNode(this.modal).querySelector('.modal-header p');
            this.button = findDOMNode(this.modal).querySelector('button.btn-danger');
        });

        it('should be formatted', function() {
            expect(this.header.textContent).toBe('Your first 17 days of advertising is on us');
            expect(this.button.textContent).toBe('Get 17 days FREE trial');
        });

        describe('if singular', function() {
            beforeEach(function() {
                this.props.trialLength = 1;
                this.component = mount(
                    <Provider store={this.store}>
                        <WizardPlanInfoModal {...this.props} />
                    </Provider>
                ).find(WizardPlanInfoModal);
                this.modal = this.component.find(Modal).node._modal;
                this.header = findDOMNode(this.modal).querySelector('.modal-header p');
                this.button = findDOMNode(this.modal).querySelector('button.btn-danger');
            });

            it('should use singular text', function() {
                expect(this.header.textContent).toBe('Your first 1 day of advertising is on us');
                expect(this.button.textContent).toBe('Get 1 day FREE trial');
            });
        });

        describe('if 7', function() {
            beforeEach(function() {
                this.props.trialLength = 7;
                this.component = mount(
                    <Provider store={this.store}>
                        <WizardPlanInfoModal {...this.props} />
                    </Provider>
                ).find(WizardPlanInfoModal);
                this.modal = this.component.find(Modal).node._modal;
                this.header = findDOMNode(this.modal).querySelector('.modal-header p');
                this.button = findDOMNode(this.modal).querySelector('button.btn-danger');
            });

            it('should use singular week text', function() {
                expect(this.header.textContent).toBe('Your first 1 week of advertising is on us');
                expect(this.button.textContent).toBe('Get 1 week FREE trial');
            });
        });

        describe('if 30', function() {
            beforeEach(function() {
                this.props.trialLength = 30;
                this.component = mount(
                    <Provider store={this.store}>
                        <WizardPlanInfoModal {...this.props} />
                    </Provider>
                ).find(WizardPlanInfoModal);
                this.modal = this.component.find(Modal).node._modal;
                this.header = findDOMNode(this.modal).querySelector('.modal-header p');
                this.button = findDOMNode(this.modal).querySelector('button.btn-danger');
            });

            it('should use singular month text', function() {
                expect(this.header.textContent).toBe('Your first 1 month of advertising is on us');
                expect(this.button.textContent).toBe('Get 1 month FREE trial');
            });
        });

        describe('if a multiple of 7', function() {
            beforeEach(function() {
                this.props.trialLength = 21;
                this.component = mount(
                    <Provider store={this.store}>
                        <WizardPlanInfoModal {...this.props} />
                    </Provider>
                ).find(WizardPlanInfoModal);
                this.modal = this.component.find(Modal).node._modal;
                this.header = findDOMNode(this.modal).querySelector('.modal-header p');
                this.button = findDOMNode(this.modal).querySelector('button.btn-danger');
            });

            it('should use plural week text', function() {
                expect(this.header.textContent).toBe('Your first 3 weeks of advertising is on us');
                expect(this.button.textContent).toBe('Get 3 weeks FREE trial');
            });
        });

        describe('if a multiple of 30', function() {
            beforeEach(function() {
                this.props.trialLength = 120;
                this.component = mount(
                    <Provider store={this.store}>
                        <WizardPlanInfoModal {...this.props} />
                    </Provider>
                ).find(WizardPlanInfoModal);
                this.modal = this.component.find(Modal).node._modal;
                this.header = findDOMNode(this.modal).querySelector('.modal-header p');
                this.button = findDOMNode(this.modal).querySelector('button.btn-danger');
            });

            it('should use plural month text', function() {
                expect(this.header.textContent).toBe('Your first 4 months of advertising is on us');
                expect(this.button.textContent).toBe('Get 4 months FREE trial');
            });
        });
    });

    describe('the SelectPlan form', function() {
        beforeEach(function() {
            this.form = findRenderedComponentWithType(this.modal, SelectPlan);
        });

        it('should exist', function() {
            expect(this.form).toEqual(jasmine.any(Object));
            expect(this.form.props.plans).toEqual(this.props.plans);
            expect(this.form.props.initialValues).toEqual({ plan: this.props.plans[1].id });
            expect(this.form.props.formKey).toBe('select');
        });

        describe('when submitted', function() {
            beforeEach(function() {
                this.values = { plan: this.props.plans[2].id };
                this.form.props.onSubmit(this.values);
            });

            it('should call onContinue()', function() {
                expect(this.props.onContinue).toHaveBeenCalledWith(this.values.plan);
            });
        });
    });

    describe('the continue button', function() {
        beforeEach(function() {
            this.button = findRenderedComponentWithType(this.modal, Button);
            this.form = findRenderedComponentWithType(this.modal, SelectPlan);
        });

        it('should exist', function() {
            expect(this.button).toEqual(jasmine.any(Object));
        });

        it('should not be disabled', function() {
            expect(this.button.props.disabled).toBe(false);
        });

        it('should not be waiting', function() {
            expect(findRenderedDOMComponentWithTag(this.button, 'button').classList).not.toContain('btn-waiting');
        });

        describe('onClick()', function() {
            beforeEach(function() {
                spyOn(this.form, 'submit');

                this.button.props.onClick();
            });

            it('should submit the form', function() {
                expect(this.form.submit).toHaveBeenCalledWith();
            });
        });

        describe('when actionPending is true', function() {
            beforeEach(function() {
                this.props.actionPending = true;
                this.component = mount(
                    <Provider store={this.store}>
                        <WizardPlanInfoModal {...this.props} />
                    </Provider>
                ).find(WizardPlanInfoModal);
                this.modal = this.component.find(Modal).node._modal;
                this.button = findRenderedComponentWithType(this.modal, Button);
            });

            it('should be disabled', function() {
                expect(this.button.props.disabled).toBe(true);
            });

            it('should be waiting', function() {
                expect(findRenderedDOMComponentWithTag(this.button, 'button').classList).toContain('btn-waiting');
            });
        });
    });
});
