import resetPasswordReducer from '../../src/reducers/page/reset_password';
import {
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE
} from '../../src/actions/auth';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('resetPasswordReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(resetPasswordReducer(undefined, 'INIT')).toEqual({
            submitSuccess: false
        });
    });

    describe('handling actions', function() {
        let state, newState;

        beforeEach(function() {
            state = {
                submitSuccess: false
            };
        });

        describe(RESET_PASSWORD_SUCCESS, function() {
            beforeEach(function() {
                newState = resetPasswordReducer(state, createAction(RESET_PASSWORD_SUCCESS)({}));
            });

            it('should set update success to true', function() {
                expect(newState).toEqual(assign({}, state, {
                    submitSuccess: true
                }));
            });
        });

        describe(RESET_PASSWORD_FAILURE, function() {
            beforeEach(function() {
                state.submitSuccess = true;

                newState = resetPasswordReducer(state, createAction(RESET_PASSWORD_FAILURE)({}));
            });

            it('should set submitSuccess to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    submitSuccess: false
                }));
            });
        });
    });
});
