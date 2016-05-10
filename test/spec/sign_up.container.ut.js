'use strict';

import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import SignUp from '../../src/containers/SignUp';
import { createStore } from 'redux';
import { signUp } from '../../src/actions/user';
import { Provider } from 'react-redux';
import defer from 'promise-defer';
import { cloneDeep as clone, assign } from 'lodash';
import SignUpForm from '../../src/forms/SignUp';
import APP_CONFIG from '../../config';

const proxyquire = require('proxyquire');

describe('SignUp', function() {
    let userActions;
    let SignUp;

    beforeEach(function() {
        userActions = {
            signUp: jasmine.createSpy('signUp()').and.callFake(signUp),

            __esModule: true
        };

        SignUp = proxyquire('../../src/containers/SignUp', {
            'react': React,

            '../forms/SignUp': {
                default: SignUpForm,

                __esModule: true
            },
            '../actions/user': userActions
        }).default;
    });

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
                        expect(userActions.signUp).toHaveBeenCalledWith(assign({}, values, {
                            paymentPlanId: APP_CONFIG.paymentPlans[0].id
                        }));
                    });
                });
            });
        });

        describe('dispatch props', function() {
            let dispatchDeferred;

            beforeEach(function() {
                store.dispatch.and.returnValue((dispatchDeferred = defer()).promise);
            });

            describe('signUp(data)', function() {
                let data;
                let result;

                beforeEach(function() {
                    data = {
                        foo: 'bar'
                    };

                    result = component.props.signUp(data);
                });

                it('should dispatch the signUp() action', function() {
                    expect(userActions.signUp).toHaveBeenCalledWith(data);
                    expect(store.dispatch).toHaveBeenCalledWith(userActions.signUp.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });
        });
    });
});
