'use strict';

import SignUp from '../../src/forms/SignUp';
import {
    renderIntoDocument,
    findAllInRenderedTree,
    findRenderedDOMComponentWithTag,
    scryRenderedDOMComponentsWithTag,
    Simulate
} from 'react-addons-test-utils';
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

            component = findAllInRenderedTree(renderIntoDocument(
                <Provider store={store}>
                    <SignUp {...props} />
                </Provider>
            ), component => component.constructor.name === 'SignUp')[0];

            Simulate.focus(scryRenderedDOMComponentsWithTag(component, 'input')[0]);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should be a form', function() {
            expect(findRenderedDOMComponentWithTag(component, 'form')).toEqual(jasmine.any(Object));
            expect(store.getState().form.signUp).toEqual(jasmine.any(Object));
            expect(component.props.fields).toEqual({
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
            expect(component.props.submitSucceeded).toBe(store.getState().form.signUp._submitSucceeded);
        });

        describe('when the form is submitted', function() {
            let submitDeferred;

            beforeEach(function() {
                props.onSubmit.and.returnValue((submitDeferred = defer()).promise);

                Simulate.submit(findRenderedDOMComponentWithTag(component, 'form'));
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
                    expect(component.props.error).toBe(reason);
                });
            });
        });
    });
});
