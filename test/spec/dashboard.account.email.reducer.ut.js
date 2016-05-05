import dashboardAccountEmailReducer from '../../src/reducers/page/dashboard/account/email';
import {
    CHANGE_EMAIL_START,
    CHANGE_EMAIL_SUCCESS,
    CHANGE_EMAIL_FAILURE
} from '../../src/actions/account';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('dashboardAccountEmailReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardAccountEmailReducer(undefined, 'INIT')).toEqual({
            updateSuccess: false
        });
    });

    describe('handling actions', function() {
        let state, newState;

        beforeEach(function() {
            state = {
                updateSuccess: false
            };
        });

        describe(CHANGE_EMAIL_START, function() {
            beforeEach(function() {
                state.updateSuccess = true;

                newState = dashboardAccountEmailReducer(state, createAction(CHANGE_EMAIL_START)());
            });

            it('should set update success to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    updateSuccess: false
                }));
            });
        });

        describe(CHANGE_EMAIL_SUCCESS, function() {
            beforeEach(function() {
                newState = dashboardAccountEmailReducer(state, createAction(CHANGE_EMAIL_SUCCESS)({}));
            });

            it('should set update success to true', function() {
                expect(newState).toEqual(assign({}, state, {
                    updateSuccess: true
                }));
            });
        });

        describe(CHANGE_EMAIL_FAILURE, function() {
            beforeEach(function() {
                state.updateSuccess = true;

                newState = dashboardAccountEmailReducer(state, createAction(CHANGE_EMAIL_FAILURE)({}));
            });

            it('should set update success to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    updateSuccess: false
                }));
            });
        });
    });
});
