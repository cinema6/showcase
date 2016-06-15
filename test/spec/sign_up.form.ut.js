'use strict';

import SignUp from '../../src/forms/SignUp';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from 'redux-form';
import { assign } from 'lodash';
import  defer from 'promise-defer';
import signUpReducer from '../../src/reducers/form/sign_up';

describe('SignUp', function() {
    describe('when rendered', function() {
        let state, formReducer, store;
        let props, component;

        beforeEach(function() {
            state = {

            };
            formReducer = reducer.plugin({
                signUp: signUpReducer
            });
            store = createStore((s, action) => assign({}, s, state, {
                form: formReducer(s.form, action)
            }), {});

            props = {
                onSubmit: jasmine.createSpy('submit()')
            };

            component = mount(
                <Provider store={store}>
                    <SignUp {...props} />
                </Provider>
            ).findWhere(component => component.type().name === 'SignUp');
            component.find('input').first().simulate('focus');
        });

        it('should exist', function() {
            expect(component.length).toEqual(1, 'SignUp not rendered');
        });

        it('should be a form', function() {
            expect(component.find('form').length).toEqual(1, '<form> not rendered');
            expect(store.getState().form.signUp).toEqual(jasmine.any(Object));
            expect(component.props().fields).toEqual({
                firstName: jasmine.objectContaining({
                    value: ''
                }),
                lastName: jasmine.objectContaining({
                    value: ''
                }),
                email: jasmine.objectContaining({
                    value: ''
                }),
                password: jasmine.objectContaining({
                    value: ''
                })
            });
        });

        it('should pass in a submitSucceeded prop', function() {
            expect(component.props().submitSucceeded).toBe(store.getState().form.signUp._submitSucceeded);
        });

        describe('when the form is submitted', function() {
            let submitDeferred;

            beforeEach(function() {
                props.onSubmit.and.returnValue((submitDeferred = defer()).promise);

                component.find('form').simulate('submit');
            });

            it('should call onSubmit() with the values', function() {
                expect(props.onSubmit).toHaveBeenCalledWith({
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    password: undefined
                });
            });

            describe('if the promise is returns is rejected', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('It went wrong!');

                    submitDeferred.reject(reason);
                    setTimeout(done);
                });

                it('should return an error with an _error property', function() {
                    expect(component.props().error).toBe(reason);
                });
            });
        });
    });
});
