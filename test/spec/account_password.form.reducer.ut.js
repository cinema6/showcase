'use strict';

import accountPasswordReducer from '../../src/reducers/form/account_password';
import { createAction } from 'redux-actions';
import { CHANGE_PASSWORD_SUCCESS } from '../../src/actions/account';

describe('accountPasswordReducer()', function() {
    let state;

    beforeEach(function() {
        state = {};
    });

    it('should return the state passed to it', function() {
        expect(accountPasswordReducer(state, createAction('FOO')())).toBe(state);
    });

    describe('handling actions', function() {
        let newState;

        describe(CHANGE_PASSWORD_SUCCESS, function() {
            beforeEach(function() {
                newState = accountPasswordReducer(state, createAction(CHANGE_PASSWORD_SUCCESS)('password@me.com'));
            });

            it('should return undefined', function() {
                expect(newState).toBeUndefined();
            });
        });
    });
});
