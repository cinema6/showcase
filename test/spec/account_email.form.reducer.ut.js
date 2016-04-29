'use strict';

import accountEmailReducer from '../../src/reducers/form/account_email';
import { createAction } from 'redux-actions';
import { CHANGE_EMAIL_SUCCESS } from '../../src/actions/account';

describe('accountEmailReducer()', function() {
    let state;

    beforeEach(function() {
        state = {};
    });

    it('should return the state passed to it', function() {
        expect(accountEmailReducer(state, createAction('FOO')())).toBe(state);
    });

    describe('handling actions', function() {
        let newState;

        describe(CHANGE_EMAIL_SUCCESS, function() {
            beforeEach(function() {
                newState = accountEmailReducer(state, createAction(CHANGE_EMAIL_SUCCESS)('email@me.com'));
            });

            it('should return undefined', function() {
                expect(newState).toBeUndefined();
            });
        });
    });
});
