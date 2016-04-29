'use strict';

import forgotPasswordReducer from '../../src/reducers/form/forgot_password';
import { createAction } from 'redux-actions';
import { FORGOT_PASSWORD_SUCCESS } from '../../src/actions/auth';

describe('forgotPasswordReducer()', function() {
    let state;

    beforeEach(function() {
        state = {};
    });

    it('should return the state passed to it', function() {
        expect(forgotPasswordReducer(state, createAction('FOO')())).toBe(state);
    });

    describe('handling actions', function() {
        let newState;

        describe(FORGOT_PASSWORD_SUCCESS, function() {
            beforeEach(function() {
                newState = forgotPasswordReducer(state, createAction(FORGOT_PASSWORD_SUCCESS)());
            });

            it('should return undefined', function() {
                expect(newState).toBeUndefined();
            });
        });
    });
});
