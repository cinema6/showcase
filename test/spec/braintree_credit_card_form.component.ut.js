import { renderIntoDocument, findRenderedDOMComponentWithTag, Simulate } from 'react-addons-test-utils';
import React from 'react';
import { assign } from 'lodash';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import braintree from 'braintree-web';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';

const proxyquire = require('proxyquire');

describe('BraintreeCreditCardForm', function() {
    let createUuidSpy;
    let BraintreeCreditCardForm;

    beforeEach(function() {
        spyOn(braintree, 'setup');
        createUuidSpy = jasmine.createSpy('createUuid()').and.callFake(createUuid);

        BraintreeCreditCardForm = proxyquire('../../src/components/BraintreeCreditCardForm', {
            'braintree-web': braintree,
            'react': React,

            'rc-uuid': {
                createUuid: createUuidSpy
            }
        }).default;
    });

    describe('when rendered', function() {
        let props, component;
        let getTokenDeferred, onSubmitDeferred;

        beforeEach(function() {
            props = {
                getToken: jasmine.createSpy('getToken()').and.returnValue((getTokenDeferred = defer()).promise),
                onSubmit: jasmine.createSpy('onSubmit()').and.returnValue((onSubmitDeferred = defer()).promise)
            };

            component = renderIntoDocument(
                <BraintreeCreditCardForm {...props} />
            );
        });

        it('should have an id', function() {
            expect(createUuidSpy).toHaveBeenCalledWith();
            expect(component.id).toBe(createUuidSpy.calls.mostRecent().returnValue);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should have some state', function() {
            expect(component.state).toEqual({
                braintree: null,

                loading: true,
                error: null,
                submitting: false,
                type: 'CREDIT_CARD',

                cardholderName: '',

                hostedFieldState: {
                    number: { focused: false, empty: true, valid: false, potentiallyValid: true },
                    cvv: { focused: false, empty: true, valid: false, potentiallyValid: true },
                    expirationDate: { focused: false, empty: true, valid: false, potentiallyValid: true },
                    postalCode: { focused: false, empty: true, valid: false, potentiallyValid: true }
                }
            });
        });

        it('should get a client token', function() {
            expect(props.getToken).toHaveBeenCalledWith();
        });

        describe('when the token is fetched', function() {
            let token;

            beforeEach(function(done) {
                token = createUuid();

                getTokenDeferred.resolve({ clientToken: token });
                setTimeout(done);
            });

            it('should setup braintree', function() {
                expect(braintree.setup).toHaveBeenCalledWith(token, 'custom', {
                    id: component.id,
                    onReady: jasmine.any(Function),
                    hostedFields: {
                        number: {
                            selector: `[data-braintree="${component.id}_number"]`
                        },
                        cvv: {
                            selector: `[data-braintree="${component.id}_cvv"]`
                        },
                        expirationDate: {
                            selector: `[data-braintree="${component.id}_expirationDate"]`
                        },
                        postalCode: {
                            selector: `[data-braintree="${component.id}_postalCode"]`
                        },
                        onFieldEvent: jasmine.any(Function)
                    },
                    onError: jasmine.any(Function),
                    onPaymentMethodReceived: jasmine.any(Function),
                    paypal: {
                        container: component.refs.paypal,
                        headless: true,
                        onSuccess: jasmine.any(Function)
                    }
                });
            });

            describe('when braintree', function() {
                let config;

                beforeEach(function() {
                    config = braintree.setup.calls.mostRecent().args[2];

                    spyOn(component, 'setState').and.callThrough();
                });

                describe('is ready', function() {
                    let api;

                    beforeEach(function() {
                        api = {
                            paypal: {
                                initAuthFlow: jasmine.createSpy('initAuthFlow()')
                            }
                        };

                        config.onReady(api);
                    });

                    it('should set loading to false and save the braintree api', function() {
                        expect(component.setState).toHaveBeenCalledWith({ loading: false, braintree: api });
                    });

                    describe('when the paypal button is clicked', function() {
                        beforeEach(function() {
                            Simulate.click(component.refs.paypal);
                        });

                        it('should start the paypal auth flow', function() {
                            expect(api.paypal.initAuthFlow).toHaveBeenCalledWith();
                        });
                    });
                });

                describe('encounters an error', function() {
                    let event;

                    beforeEach(function() {
                        event = { message: 'It went wrong.' };

                        component.state.loading = true;
                        component.state.submitting = true;
                        component.state.error = null;

                        config.onError(event);
                    });

                    it('should udpate the state', function() {
                        expect(component.setState).toHaveBeenCalledWith({ loading: false, submitting: false, error: event.message });
                    });
                });

                describe('recieves a field event', function() {
                    let event;

                    beforeEach(function() {
                        event = {
                            type: 'foo',
                            isEmtpy: false,
                            isFocused: true,
                            isPotentiallyValid: false,
                            isValid: true,
                            target: {
                                fieldKey: 'cvv'
                            }
                        };

                        config.hostedFields.onFieldEvent(event);
                    });

                    it('should udpate the hostedFieldState', function() {
                        expect(component.setState).toHaveBeenCalledWith({
                            error: null,

                            hostedFieldState: assign({}, component.state.hostedFieldState, {
                                [event.target.fieldKey]: {
                                    empty: false,
                                    focused: true,
                                    potentiallyValid: false,
                                    valid: true
                                }
                            })
                        });
                    });
                });

                describe('recieves the payment method', function() {
                    let method;

                    beforeEach(function(done) {
                        method = {
                            cardType: 'Visa',
                            lastTwo: '03'
                        };
                        component.state.cardholderName = 'Your Mom';
                        component.state.submitting = true;

                        config.onPaymentMethodReceived(method);
                        setTimeout(done);
                    });

                    it('should set submitting to true', function() {
                        expect(component.setState).toHaveBeenCalledWith({
                            submitting: true
                        });
                    });

                    it('should call onSubmit()', function() {
                        expect(props.onSubmit).toHaveBeenCalledWith(assign({}, method, {
                            cardholderName: component.state.cardholderName
                        }));
                    });

                    describe('if the promise is fulfilled', function() {
                        beforeEach(function(done) {
                            onSubmitDeferred.resolve([createUuid()]);
                            setTimeout(done);
                        });

                        it('should set submitting to false', function() {
                            expect(component.setState).toHaveBeenCalledWith({ submitting: false });
                        });
                    });

                    describe('if the promise is rejected', function() {
                        let reason;

                        beforeEach(function(done) {
                            reason = new Error('It went very wrong!');
                            onSubmitDeferred.reject(reason);
                            setTimeout(done);
                        });

                        it('should set submitting to false and the error', function() {
                            expect(component.setState).toHaveBeenCalledWith({
                                submitting: false,
                                error: reason.message
                            });
                        });
                    });
                });

                describe('gets a paypal account', function() {
                    let nonce, email;

                    beforeEach(function(done) {
                        nonce = createUuid();
                        email = 'you@foo.com';

                        config.paypal.onSuccess(nonce, email);
                        setTimeout(done);
                    });

                    it('should call onSubmit()', function() {
                        expect(props.onSubmit).toHaveBeenCalledWith({
                            nonce, email
                        });
                    });

                    it('should set submitting to true', function() {
                        expect(component.setState).toHaveBeenCalledWith({ submitting: true });
                    });

                    describe('if the promise is fulfilled', function() {
                        beforeEach(function(done) {
                            onSubmitDeferred.resolve([createUuid()]);
                            setTimeout(done);
                        });

                        it('should set submitting to false', function() {
                            expect(component.setState).toHaveBeenCalledWith({ submitting: false });
                        });
                    });

                    describe('if the promise is rejected', function() {
                        let reason;

                        beforeEach(function(done) {
                            reason = new Error('It went very wrong!');
                            onSubmitDeferred.reject(reason);
                            setTimeout(done);
                        });

                        it('should set submitting to false and the error', function() {
                            expect(component.setState).toHaveBeenCalledWith({
                                submitting: false,
                                error: reason.message
                            });
                        });
                    });
                });
            });
        });

        describe('getHostedFieldClassNames(field)', function() {
            it('should return class names for the hosted fields', function() {
                expect(component.getHostedFieldClassNames('number')).toEqual(classnames({
                    'cc_field--empty': component.state.hostedFieldState.number.empty,
                    'cc_field--focused': component.state.hostedFieldState.number.focused,
                    'cc_field--potentiallyValid': component.state.hostedFieldState.number.potentiallyValid,
                    'cc_field--valid': component.state.hostedFieldState.number.valid
                }));

                component.state.hostedFieldState.cvv.empty = false;
                component.state.hostedFieldState.cvv.focused = true;
                component.state.hostedFieldState.cvv.potentiallyValid = false;
                component.state.hostedFieldState.cvv.valid = true;
                expect(component.getHostedFieldClassNames('cvv')).toEqual(classnames({
                    'cc_field--empty': component.state.hostedFieldState.cvv.empty,
                    'cc_field--focused': component.state.hostedFieldState.cvv.focused,
                    'cc_field--potentiallyValid': component.state.hostedFieldState.cvv.potentiallyValid,
                    'cc_field--valid': component.state.hostedFieldState.cvv.valid
                }));
            });
        });

        describe('isValid()', function() {
            beforeEach(function() {
                component.state.cardholderName = 'Foo';
                Object.keys(component.state.hostedFieldState).forEach(field => component.state.hostedFieldState[field].valid = true);
            });

            describe('if not all hosted fields are valid', function() {
                beforeEach(function() {
                    component.state.hostedFieldState.cvv.valid = false;
                });

                it('should be false', function() {
                    expect(component.isValid()).toBe(false);
                });
            });

            describe('if the cardholder name is not specified', function() {
                beforeEach(function() {
                    component.state.cardholderName = '';
                });

                it('should be false', function() {
                    expect(component.isValid()).toBe(false);
                });
            });

            it('should be true', function() {
                expect(component.isValid()).toBe(true);
            });
        });

        describe('render()', function() {
            let form;

            beforeEach(function() {
                form = findRenderedDOMComponentWithTag(component, 'form');
                spyOn(component, 'setState').and.callThrough();
            });

            it('should create a form with an id of id', function() {
                expect(form.id).toBe(component.id);
            });

            it('should create divs to be populated by braintree', function() {
                expect(form.querySelector(`[data-braintree="${component.id}_number"]`)).not.toBeNull();
                expect(form.querySelector(`[data-braintree="${component.id}_cvv"]`)).not.toBeNull();
                expect(form.querySelector(`[data-braintree="${component.id}_expirationDate"]`)).not.toBeNull();
                expect(form.querySelector(`[data-braintree="${component.id}_postalCode"]`)).not.toBeNull();
            });

            it('should hide the paypal form', function() {
                expect(findDOMNode(component).querySelector('[data-test="paypal"]').classList).toContain('hidden');
            });

            it('should show the credit card form', function() {
                expect(form.classList).not.toContain('hidden');
            });

            it('should create a button for paypal', function() {
                expect(component.refs.paypal.tagName).toBe('BUTTON');
            });

            describe('when the toggle for', function() {
                let ccToggle, paypalToggle;

                beforeEach(function() {
                    let toggles = findDOMNode(component).querySelectorAll('.payment-options input');

                    ccToggle = toggles[0];
                    paypalToggle = toggles[1];
                });

                describe('paypal is clicked', function() {
                    beforeEach(function() {
                        Simulate.change(paypalToggle);
                    });

                    it('should show the paypal form', function() {
                        expect(findDOMNode(component).querySelector('[data-test="paypal"]').classList).not.toContain('hidden');
                    });

                    it('should hide the credit card form', function() {
                        expect(form.classList).toContain('hidden');
                    });

                    it('should check the paypal toggle', function() {
                        expect(paypalToggle.checked).toBe(true);
                    });
                });

                describe('credit card is clicked', function() {
                    beforeEach(function() {
                        component.setState({ type: 'PAYPAL' });

                        Simulate.change(ccToggle);
                    });

                    it('should show the credit card form', function() {
                        expect(form.classList).not.toContain('hidden');
                    });

                    it('should hide the paypal form', function() {
                        expect(findDOMNode(component).querySelector('[data-test="paypal"]').classList).toContain('hidden');
                    });

                    it('should check the credit card toggle', function() {
                        expect(ccToggle.checked).toBe(true);
                    });
                });
            });

            describe('when the cardholderName is changed', function() {
                let cardholderName;

                beforeEach(function() {
                    cardholderName = form.querySelector('input[data-test="cardholderName"]');

                    cardholderName.value = 'Johnny Testmonkey';
                    Simulate.change(cardholderName);
                });

                it('should update the state', function() {
                    expect(component.setState).toHaveBeenCalledWith({ cardholderName: cardholderName.value });
                });
            });

            describe('when the form is submitted', function() {
                beforeEach(function() {
                    Simulate.submit(form);
                });

                it('should set submitting to true', function() {
                    expect(component.setState).toHaveBeenCalledWith({ submitting: true });
                });
            });
        });
    });
});
