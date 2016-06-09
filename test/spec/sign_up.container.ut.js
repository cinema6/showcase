'use strict';

import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import SignUp from '../../src/containers/SignUp';
import { createStore } from 'redux';
import { signUp } from '../../src/actions/user';
import { Provider } from 'react-redux';
import { cloneDeep as clone, assign } from 'lodash';
import SignUpForm from '../../src/forms/SignUp';
import APP_CONFIG from '../../config';
import { createUuid } from 'rc-uuid';

describe('SignUp', function() {
    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            state = {
                form: {
                    signUp: {
                        _submitting: false,
                        _submitFailed: false,
                        _submitSucceeded: false
                    }
                },
                page: {
                    signUp: {}
                }
            };
            store = createStore(() => clone(state));
            spyOn(store, 'dispatch').and.callThrough();

            props = {
                location: {
                    query: {
                        ref: 'ref-0GK6Z407ZL0uII1B'
                    }
                }
            };

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <SignUp {...props} />
                </Provider>
            ), SignUp.WrappedComponent.WrappedComponent);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should be a page', function() {
            expect(component.props.page).toEqual(state.page.signUp);
        });

        describe('SignUpForm', function() {
            let form;

            beforeEach(function() {
                form = findRenderedComponentWithType(component, SignUpForm);
            });

            it('should exist', function() {
                expect(form).toEqual(jasmine.any(Object));
            });

            describe('props', function() {
                describe('onSubmit', function() {
                    let values;

                    beforeEach(function() {
                        values = {
                            firstName: 'Foo',
                            lastName: 'bar',
                            email: 'foo@bar.com',
                            company: 'this company',
                            password: 'hey'
                        };

                        store.dispatch.and.stub();

                        form.props.onSubmit(values);
                    });

                    it('should call signUp()', function() {
                        expect(store.dispatch).toHaveBeenCalledWith(signUp(assign({}, values, {
                            company: `${values.firstName} ${values.lastName}`,
                            paymentPlanId: APP_CONFIG.paymentPlans[0].id,
                            promotion: APP_CONFIG.defaultPromotion,
                            referralCode: props.location.query.ref
                        })));
                    });

                    describe('with a promotion in the query param', function() {
                        beforeEach(function() {
                            props.location.query.promotion = `pro-${createUuid()}`;
                            store.dispatch.calls.reset();

                            form.props.onSubmit(values);
                        });

                        it('should use the specified promotion', function() {
                            expect(store.dispatch).toHaveBeenCalledWith(signUp(assign({}, values, {
                                company: `${values.firstName} ${values.lastName}`,
                                paymentPlanId: APP_CONFIG.paymentPlans[0].id,
                                promotion: props.location.query.promotion,
                                referralCode: props.location.query.ref
                            })));
                        });
                    });
                });
            });
        });
    });
});
