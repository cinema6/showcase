import {
    renderIntoDocument,
    findRenderedComponentWithType,
    Simulate
} from 'react-addons-test-utils';
import { findDOMNode } from 'react-dom';
import React from 'react';
import WizardConfirmationModal from '../../src/components/WizardConfirmationModal';
import BraintreeCreditCardForm from '../../src/components/BraintreeCreditCardForm';

describe('WizardConfirmationModal', function() {
    describe('when rendered', function() {
        let props;
        let component;

        beforeEach(function() {
            props = {
                handleClose: jasmine.createSpy('handleClose()'),
                getToken: jasmine.createSpy('getToken()').and.returnValue(new Promise(() => {})),
                onSubmit: jasmine.createSpy('onSubmit()')
            };

            component = renderIntoDocument(<WizardConfirmationModal {...props} />);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        describe('children', function() {
            let creditCardForm, close;

            beforeEach(function() {
                creditCardForm = findRenderedComponentWithType(component, BraintreeCreditCardForm);
                close = findDOMNode(component).querySelector('button[aria-label="Close"]');
            });

            describe('BraintreeCreditCardForm', function() {
                it('should exist', function() {
                    expect(creditCardForm).toEqual(jasmine.any(Object));
                });

                it('should be passed getToken() and onSubmit()', function() {
                    expect(creditCardForm.props.onSubmit).toBe(props.onSubmit);
                    expect(creditCardForm.props.getToken).toBe(props.getToken);
                });
            });

            describe('close button', function() {
                describe('when clicked', function() {
                    beforeEach(function() {
                        Simulate.click(close);
                    });

                    it('should call handleClose()', function() {
                        expect(props.handleClose).toHaveBeenCalledWith();
                    });
                });
            });
        });
    });
});
