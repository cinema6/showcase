'use strict';

import resetPasswordReducer from '../../src/reducers/form/reset_password';
import { createAction } from 'redux-actions';
import { RESET_PASSWORD_SUCCESS } from '../../src/actions/auth';

describe('resetPasswordReducer()', function() {
    let state;

    beforeEach(function() {
        state = {};
    });

    it('should return the state passed to it', function() {
        expect(resetPasswordReducer(state, createAction('FOO')())).toBe(state);
    });

    describe('handling actions', function() {
        let newState;

        describe(RESET_PASSWORD_SUCCESS, function() {
            beforeEach(function() {
                newState = resetPasswordReducer(state, createAction(RESET_PASSWORD_SUCCESS)());
            });

            it('should return undefined', function() {
                expect(newState).toBeUndefined();
            });
        });
    });
});
