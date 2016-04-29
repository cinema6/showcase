import forgotPasswordReducer from '../../src/reducers/page/forgot_password';
import {
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE
} from '../../src/actions/auth';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('forgotPasswordReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(forgotPasswordReducer(undefined, 'INIT')).toEqual({
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

        describe(FORGOT_PASSWORD_SUCCESS, function() {
            beforeEach(function() {
                newState = forgotPasswordReducer(state, createAction(FORGOT_PASSWORD_SUCCESS)({}));
            });

            it('should set update success to true', function() {
                expect(newState).toEqual(assign({}, state, {
                    submitSuccess: true
                }));
            });
        });

        describe(FORGOT_PASSWORD_FAILURE, function() {
            beforeEach(function() {
                state.submitSuccess = true;

                newState = forgotPasswordReducer(state, createAction(FORGOT_PASSWORD_FAILURE)({}));
            });

            it('should set update success to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    submitSuccess: false
                }));
            });
        });
    });
});
