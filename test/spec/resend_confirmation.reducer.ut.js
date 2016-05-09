import resendConfirmationReducer from '../../src/reducers/page/resend_confirmation';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';
import {
    RESEND_CONFIRMATION_EMAIL_START,
    RESEND_CONFIRMATION_EMAIL_SUCCESS,
    RESEND_CONFIRMATION_EMAIL_FAILURE
} from '../../src/actions/user';

describe('resendConfirmationReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(resendConfirmationReducer(undefined, 'INIT')).toEqual({
            sending: false,
            success: false,
            error: null
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                sending: false,
                success: false,
                error: null
            };
        });

        describe(RESEND_CONFIRMATION_EMAIL_START, function() {
            beforeEach(function() {
                action = createAction(RESEND_CONFIRMATION_EMAIL_START)();

                state.success = true;
                state.error = new Error('foo!');

                newState = resendConfirmationReducer(state, action);
            });

            it('should reset the state and set sending to true', function() {
                expect(newState).toEqual(assign({}, state, {
                    success: false,
                    error: null,
                    sending: true
                }));
            });
        });

        describe(RESEND_CONFIRMATION_EMAIL_SUCCESS, function() {
            beforeEach(function() {
                action = createAction(RESEND_CONFIRMATION_EMAIL_SUCCESS)();

                state.sending = true;

                newState = resendConfirmationReducer(state, action);
            });

            it('should set success to true and sending to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    success: true,
                    sending: false
                }));
            });
        });

        describe(RESEND_CONFIRMATION_EMAIL_FAILURE, function() {
            beforeEach(function() {
                action = createAction(RESEND_CONFIRMATION_EMAIL_FAILURE)(new Error('Oh no!'));

                state.sending = true;

                newState = resendConfirmationReducer(state, action);
            });

            it('should set the error and sending to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    error: action.payload,
                    sending: false
                }));
            });
        });
    });
});
