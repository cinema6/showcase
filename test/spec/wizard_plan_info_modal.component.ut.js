import WizardPlanInfoModal from '../../src/components/WizardPlanInfoModal';
import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

describe('WizardPlanInfoModal', function() {
    beforeEach(function() {
        this.props = {
            show: true,
            onClose: jasmine.createSpy('onClose()'),
            onContinue: jasmine.createSpy('onContinue()')
        };
        this.component = renderIntoDocument(
            <WizardPlanInfoModal {...this.props} />
        );
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

        describe('onClick()', function() {
            it('should be the onContinue() prop', function() {
                expect(this.button.props.onClick).toBe(this.props.onContinue);
            });
        });
    });
});
