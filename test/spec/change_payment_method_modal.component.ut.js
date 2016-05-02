import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import BraintreeCreditCardForm from '../../src/components/BraintreeCreditCardForm';

const proxyquire = require('proxyquire');

describe('ChangePaymentMethodModal', function() {
    let ChangePaymentMethodModal;

    beforeEach(function() {
        ChangePaymentMethodModal = proxyquire('../../src/components/ChangePaymentMethodModal', {
            './BraintreeCreditCardForm': {
                default: BraintreeCreditCardForm,

                __esModule: true
            }
        }).default;
    });

    describe('when rendered', function() {
        let props;
        let component;

        beforeEach(function() {
            props = {
                handleClose: jasmine.createSpy('handleClose()'),
                getToken: jasmine.createSpy('getToken()').and.returnValue(new Promise(() => {})),
                onSubmit: jasmine.createSpy('onSubmit()')
            };

            component = renderIntoDocument(<ChangePaymentMethodModal {...props} />);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        describe('children', function() {
            let creditCardForm;

            beforeEach(function() {
                creditCardForm = findRenderedComponentWithType(component, BraintreeCreditCardForm);
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
        });
    });
});
