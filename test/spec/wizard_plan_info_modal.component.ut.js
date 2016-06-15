import WizardPlanInfoModal from '../../src/components/WizardPlanInfoModal';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { mount } from 'enzyme';
import {
    findRenderedComponentWithType,
    findRenderedDOMComponentWithTag
} from 'react-addons-test-utils';

describe('WizardPlanInfoModal', function() {
    beforeEach(function() {
        this.props = {
            show: true,
            onClose: jasmine.createSpy('onClose()'),
            onContinue: jasmine.createSpy('onContinue()'),
            actionPending: false
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
