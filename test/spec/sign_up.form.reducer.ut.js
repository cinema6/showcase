'use strict';

import signUpReducer from '../../src/reducers/form/sign_up';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';
import {
    SIGN_UP_START,
    SIGN_UP_SUCCESS
} from '../../src/actions/user';

describe('signUpReducer()', function() {
    let state;

    beforeEach(function() {
        state = {
            firstName: { value: 'Your' },
            lastName: { value: 'Mom' },
            email: { value: 'yo@mamma.com' },
            password: { value: 'password' },
            _submitSucceeded: true
        };
    });

    it('should return the state passed to it', function() {
        expect(signUpReducer(state, createAction('FOO')())).toBe(state);
    });

    describe('if there is no _submitSucceeded prop', function() {
        beforeEach(function() {
            delete state._submitSucceeded;
        });

        it('should create one', function() {
            expect(signUpReducer(state, createAction('FOO')())).toEqual(assign({}, state, {
                _submitSucceeded: false
            }));
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                firstName: { value: 'Your' },
                lastName: { value: 'Mom' },
                email: { value: 'yo@mamma.com' },
                password: { value: 'password' },
                _submitSucceeded: false,
                _submitFailed: false,
                _submitting: false
            };
        });

        describe(SIGN_UP_START, function() {
            beforeEach(function() {
                state._submitSucceeded = true;
                action = createAction(SIGN_UP_START)();

                newState = signUpReducer(state, action);
            });

            it('should set _submitSucceeded to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    _submitSucceeded: false
                }));
            });
        });

        describe(SIGN_UP_SUCCESS, function() {
            beforeEach(function() {
                action = createAction(SIGN_UP_SUCCESS)();

                newState = signUpReducer(state, action);
            });

            it('should set _submitSucceeded to true and clear the fields', function() {
                expect(newState).toEqual({
                    _submitSucceeded: true,
                    _submitFailed: false,
                    _submitting: false
                });
            });
        });
    });
});
