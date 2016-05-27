import WizardPlanInfoModal from '../../src/components/WizardPlanInfoModal';
import {
    findRenderedComponentWithType,
    findRenderedDOMComponentWithTag
} from 'react-addons-test-utils';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { render } from 'react-dom';

describe('WizardPlanInfoModal', function() {
    function renderComponent() {
        return render(
            <WizardPlanInfoModal {...this.props} />,
            this.root
        );
    }

    beforeEach(function() {
        this.root = document.createElement('div');
        this.props = {
            show: true,
            onClose: jasmine.createSpy('onClose()'),
            onContinue: jasmine.createSpy('onContinue()'),
            actionPending: false
        };
        this.component = renderComponent.call(this);
        this.modal = findRenderedComponentWithType(this.component, Modal)._modal;
    });

    it('should exist', function() {
        expect(this.component).toEqual(jasmine.any(Object));
    });

    it('should render a Modal', function() {
        const modal = findRenderedComponentWithType(this.component, Modal);

        expect(modal).toEqual(jasmine.any(Object));
        expect(modal.props.show).toBe(this.props.show);
        expect(modal.props.onHide).toBe(this.props.onClose);
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
                this.props.actionPending = true;
                renderComponent.call(this);
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
