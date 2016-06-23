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

function type(input, text = '') {
    input.simulate('focus');
    input.simulate('change', {
        target: {
            value: text
        }
    });
    input.simulate('blur');
}

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
            let firstName, lastName, email, password;

            beforeEach(function() {
                firstName = component.find('input').at(0);
                lastName = component.find('input').at(1);
                email = component.find('input').at(2);
                password = component.find('input').at(3);

                props.onSubmit.and.returnValue((submitDeferred = defer()).promise);
            });

            describe('without the required values', function() {
                beforeEach(function() {
                    [firstName, lastName, email, password].forEach(input => input.simulate('blur'));

                    component.find('form').simulate('submit');
                });

                it('should show all of the errors', function() {
                    [firstName, lastName, email, password].forEach(input => {
                        const group = input.parent();
                        const help = group.find('.help-block');

                        expect(group.hasClass('has-error')).toBe(true, `${input.prop('name')} has no "has-error" class.`);
                        expect(help.length).toBe(1, `${input.prop('name')} has no .help-block.`);
                    });
                });
            });

            describe('with all of the required values', function() {
                beforeEach(function() {
                    type(firstName, 'Jason');
                    type(lastName, 'Glickman');
                    type(email, 'jason@ceospace.com');
                    type(password, 'banana');

                    component.find('form').simulate('submit');
                });

                it('should call onSubmit() with the values', function() {
                    expect(props.onSubmit).toHaveBeenCalledWith({
                        firstName: 'Jason',
                        lastName: 'Glickman',
                        email: 'jason@ceospace.com',
                        password: 'banana'
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

        ['firstName', 'lastName', 'email', 'password'].forEach((field, index) => {
            describe(`the ${field} field`, function() {
                beforeEach(function() {
                    this.group = component.find('.form-group').at(index);
                    this.input = this.group.find('input.form-control');
                });

                it('should not have the has-error class', function() {
                    expect(this.group.hasClass('has-error')).toBe(false, `${field} has "has-error" class.`);
                });

                it('should not render a .help-block', function() {
                    expect(this.group.find('.help-block').length).toBe(0, 'A .help-block is rendered.');
                });

                describe('if the user types in the field', function() {
                    beforeEach(function() {
                        this.input.simulate('focus');
                        this.input.simulate('change', {
                            target: {
                                value: 'f'
                            }
                        });
                    });

                    it('should not have the has-error class', function() {
                        expect(this.group.hasClass('has-error')).toBe(false, `${field} has "has-error" class.`);
                    });

                    it('should not render a .help-block', function() {
                        expect(this.group.find('.help-block').length).toBe(0, 'A .help-block is rendered.');
                    });

                    describe('and deletes their input', function() {
                        beforeEach(function() {
                            this.input.simulate('change', {
                                target: {
                                    value: ''
                                }
                            });
                            this.input.simulate('blur');
                            this.input.simulate('focus');
                        });

                        it('should have the has-error class', function() {
                            expect(this.group.hasClass('has-error')).toBe(true, `${field} has no "has-error" class.`);
                        });

                        it('should render a .help-block', function() {
                            expect(this.group.find('.help-block').length).toBe(1, 'A .help-block is not rendered.');
                        });
                    });
                });
            });
        });
    });
});
