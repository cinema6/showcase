import WizardPlanInfoModal from '../../src/components/WizardPlanInfoModal';
import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { mount, ReactWrapper } from 'enzyme';
import numeral from 'numeral';
import SelectPlan from '../../src/forms/SelectPlan';
import { createStore } from 'redux';

describe('WizardPlanInfoModal', function() {
    beforeEach(function() {
        this.getModal = function getModal() {
            return new ReactWrapper(this.component.find('Portal').prop('children'), null, {
                context: {
                    $bs_modal: { onHide: () => {} },
                    store: this.store
                },
                childContextTypes: {
                    $bs_modal: PropTypes.object.isRequired,
                    store: PropTypes.object.isRequired
                }
            });
        };

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
            <WizardPlanInfoModal {...this.props} />,
            {
                context: {
                    store: this.store
                },
                childContextTypes: {
                    store: PropTypes.object.isRequired
                }
            }
        );
        this.modal = this.getModal();
    });

    it('should exist', function() {
        expect(this.component.length).toEqual(1);
    });

    it('should render a Modal', function() {
        const modal = this.component.find(Modal);

        expect(modal.length).toBe(1, 'Modal not rendered');
        expect(modal.props().show).toBe(this.props.show);
        expect(modal.props().onHide).toBe(this.props.onClose);
    });

    it('should only render one subheader', function() {
        expect(this.modal.find('.modal-header p').length).toBe(1);
    });

    describe('if there are no plans', function() {
        beforeEach(function() {
            this.component.setProps({ plans: undefined });
            this.modal = this.getModal();
            this.form = this.modal.find(SelectPlan);
        });

        it('should not set any initial form values', function() {
            expect(this.form.prop('initialValues')).toBeUndefined();
        });
    });

    describe('if the plan Array is empty', function() {
        beforeEach(function() {
            this.component.setProps({ plans: [] });
            this.modal = this.getModal();
            this.form = this.modal.find(SelectPlan);
        });

        it('should not set any initial form values', function() {
            expect(this.form.prop('initialValues')).toBeUndefined();
        });
    });

    describe('if the trialLength is 0', function() {
        beforeEach(function() {
            this.component.setProps({ trialLength: 0 });
            this.modal = this.getModal();

            this.header = this.modal.find('.modal-header .modal-title');
            this.subheader = this.modal.find('.modal-header p');
            this.button = this.modal.find('button.btn-danger');
        });

        it('should use generic text', function() {
            expect(this.subheader.text()).toBe('Start promoting your app now');
            expect(this.button.text()).toBe('Continue');
        });
    });

    describe('if the freeViews is 0', function() {
        beforeEach(function() {
            this.component.setProps({ freeViews: 0 });
            this.modal = this.getModal();

            this.header = this.modal.find('.modal-header .modal-title');
        });

        it('should use generic text', function() {
            expect(this.header.text()).toBe('Reach thousands of people');
        });
    });

    describe('the number of impressions', function() {
        beforeEach(function() {
            this.header = this.modal.find('.modal-header .modal-title');
        });

        it('should be formatted', function() {
            expect(this.header.text()).toBe(`Reach ${numeral(this.props.freeViews).format('0,0')} people for FREE`);
        });
    });

    describe('the length of the trial', function() {
        beforeEach(function() {
            this.header = this.modal.find('.modal-header p');
            this.button = this.modal.find('button.btn-danger');
        });

        it('should be formatted', function() {
            expect(this.header.text()).toBe('Your first 17 days of advertising is on us');
            expect(this.button.text()).toBe('Get 17 days FREE trial');
        });

        describe('if singular', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 1 });
                this.modal = this.getModal();
                this.header = this.modal.find('.modal-header p');
                this.button = this.modal.find('button.btn-danger');
            });

            it('should use singular text', function() {
                expect(this.header.text()).toBe('Your first 1 day of advertising is on us');
                expect(this.button.text()).toBe('Get 1 day FREE trial');
            });
        });

        describe('if 7', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 7 });
                this.modal = this.getModal();
                this.header = this.modal.find('.modal-header p');
                this.button = this.modal.find('button.btn-danger');
            });

            it('should use singular week text', function() {
                expect(this.header.text()).toBe('Your first 1 week of advertising is on us');
                expect(this.button.text()).toBe('Get 1 week FREE trial');
            });
        });

        describe('if 30', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 30 });
                this.modal = this.getModal();
                this.header = this.modal.find('.modal-header p');
                this.button = this.modal.find('button.btn-danger');
            });

            it('should use singular month text', function() {
                expect(this.header.text()).toBe('Your first 1 month of advertising is on us');
                expect(this.button.text()).toBe('Get 1 month FREE trial');
            });
        });

        describe('if a multiple of 7', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 21 });
                this.modal = this.getModal();
                this.header = this.modal.find('.modal-header p');
                this.button = this.modal.find('button.btn-danger');
            });

            it('should use plural week text', function() {
                expect(this.header.text()).toBe('Your first 3 weeks of advertising is on us');
                expect(this.button.text()).toBe('Get 3 weeks FREE trial');
            });
        });

        describe('if a multiple of 30', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 120 });
                this.modal = this.getModal();
                this.header = this.modal.find('.modal-header p');
                this.button = this.modal.find('button.btn-danger');
            });

            it('should use plural month text', function() {
                expect(this.header.text()).toBe('Your first 4 months of advertising is on us');
                expect(this.button.text()).toBe('Get 4 months FREE trial');
            });
        });
    });

    describe('the SelectPlan form', function() {
        beforeEach(function() {
            this.form = this.modal.find(SelectPlan);
        });

        it('should exist', function() {
            expect(this.form.length).toEqual(1);
            expect(this.form.prop('plans')).toEqual(this.props.plans);
            expect(this.form.prop('initialValues')).toEqual({ plan: this.props.plans[1].id });
            expect(this.form.prop('formKey')).toBe('select');
        });

        describe('when submitted', function() {
            beforeEach(function() {
                this.values = { plan: this.props.plans[2].id };
                this.form.prop('onSubmit')(this.values);
            });

            it('should call onContinue()', function() {
                expect(this.props.onContinue).toHaveBeenCalledWith(this.values.plan);
            });
        });
    });

    describe('the continue button', function() {
        beforeEach(function() {
            this.button = this.modal.find(Button);
            this.form = this.modal.find(SelectPlan);
        });

        it('should exist', function() {
            expect(this.button.length).toEqual(1);
        });

        it('should not be disabled', function() {
            expect(this.button.prop('disabled')).toBe(false);
        });

        it('should not be waiting', function() {
            expect(this.button.prop('className').split(' ')).not.toContain('btn-waiting');
        });

        describe('onClick()', function() {
            beforeEach(function() {
                spyOn(this.form.node, 'submit');

                this.button.prop('onClick')();
            });

            it('should submit the form', function() {
                expect(this.form.node.submit).toHaveBeenCalledWith();
            });
        });

        describe('when actionPending is true', function() {
            beforeEach(function() {
                this.component.setProps({ actionPending: true });
                this.modal = this.getModal();
                this.button = this.modal.find(Button);
            });

            it('should be disabled', function() {
                expect(this.button.prop('disabled')).toBe(true);
            });

            it('should be waiting', function() {
                expect(this.button.prop('className').split(' ')).toContain('btn-waiting');
            });
        });
    });
});
