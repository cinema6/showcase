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

describe('WizardPlanInfoModal', function() {
    beforeEach(function() {
        this.props = {
            show: true,
            onClose: jasmine.createSpy('onClose()'),
            onContinue: jasmine.createSpy('onContinue()'),
            actionPending: false,
            trialLength: 17,
            freeViews: 2500
        };
        this.component = mount(
            <WizardPlanInfoModal {...this.props} />
        );
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

    describe('if the trialLength is 0', function() {
        beforeEach(function() {
            this.component.setProps({ trialLength: 0 });

            this.header = findDOMNode(this.modal).querySelector('.modal-header .modal-title');
            this.subheader = findDOMNode(this.modal).querySelector('.modal-header p');
            this.button = findDOMNode(this.modal).querySelector('button.btn-danger');
        });

        it('should hide the subheader', function() {
            expect(this.subheader).toBeNull();
            expect(this.header.nextSibling).toBeNull();
        });

        it('should use generic text', function() {
            expect(this.button.textContent).toBe('Continue');
        });
    });

    describe('if the freeViews is 0', function() {
        beforeEach(function() {
            this.component.setProps({ freeViews: 0 });

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
                this.component.setProps({ trialLength: 1 });
            });

            it('should use singular text', function() {
                expect(this.header.textContent).toBe('Your first 1 day of advertising is on us');
                expect(this.button.textContent).toBe('Get 1 day FREE trial');
            });
        });

        describe('if 7', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 7 });
            });

            it('should use singular week text', function() {
                expect(this.header.textContent).toBe('Your first 1 week of advertising is on us');
                expect(this.button.textContent).toBe('Get 1 week FREE trial');
            });
        });

        describe('if 30', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 30 });
            });

            it('should use singular month text', function() {
                expect(this.header.textContent).toBe('Your first 1 month of advertising is on us');
                expect(this.button.textContent).toBe('Get 1 month FREE trial');
            });
        });

        describe('if a multiple of 7', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 21 });
            });

            it('should use plural week text', function() {
                expect(this.header.textContent).toBe('Your first 3 weeks of advertising is on us');
                expect(this.button.textContent).toBe('Get 3 weeks FREE trial');
            });
        });

        describe('if a multiple of 30', function() {
            beforeEach(function() {
                this.component.setProps({ trialLength: 120 });
            });

            it('should use plural month text', function() {
                expect(this.header.textContent).toBe('Your first 4 months of advertising is on us');
                expect(this.button.textContent).toBe('Get 4 months FREE trial');
            });
        });
    });

    describe('the continue button', function() {
        beforeEach(function() {
            this.button = findRenderedComponentWithType(this.modal, Button);
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
            it('should be the onContinue() prop', function() {
                expect(this.button.props.onClick).toBe(this.props.onContinue);
            });
        });

        describe('when actionPending is true', function() {
            beforeEach(function() {
                this.component.setProps({ actionPending: true });
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
