import { mount } from 'enzyme';
import React from 'react';
import WizardConfirmationModal from '../../src/components/WizardConfirmationModal';
import BraintreeCreditCardForm from '../../src/components/BraintreeCreditCardForm';
import numeral from 'numeral';

describe('WizardConfirmationModal', function() {
    describe('when rendered', function() {
        let props;
        let component;

        beforeEach(function() {
            props = {
                handleClose: jasmine.createSpy('handleClose()'),
                getToken: jasmine.createSpy('getToken()').and.returnValue(new Promise(() => {})),
                onSubmit: jasmine.createSpy('onSubmit()'),
                freeViews: 5500
            };

            component = mount(<WizardConfirmationModal {...props} />);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should render the amount of free views', () => {
            expect(component.find('.modal-header h4').text()).toBe(`Get ${numeral(props.freeViews).format('0,0')} views for FREE. Cancel anytime.`);
        });

        describe('if the user is not getting any free views', () => {
            beforeEach(() => {
                component.setProps({
                    freeViews: undefined
                });
            });

            it('should render a generic message', () => {
                expect(component.find('.modal-header h4').text()).toBe('Reach thousands of potential app users');
            });
        });

        describe('children', function() {
            let creditCardForm, close;

            beforeEach(function() {
                creditCardForm = component.find(BraintreeCreditCardForm);
                close = component.find('button[aria-label="Close"]');
            });

            describe('BraintreeCreditCardForm', function() {
                it('should exist', function() {
                    expect(creditCardForm.length).toBe(1, 'BraintreeCreditCardForm not rendered');
                });

                it('should be passed getToken() and onSubmit()', function() {
                    expect(creditCardForm.props().onSubmit).toBe(props.onSubmit);
                    expect(creditCardForm.props().getToken).toBe(props.getToken);
                });
            });

            describe('close button', function() {
                describe('when clicked', function() {
                    beforeEach(function() {
                        close.simulate('click');
                    });

                    it('should call handleClose()', function() {
                        expect(props.handleClose).toHaveBeenCalledWith();
                    });
                });
            });
        });
    });
});
