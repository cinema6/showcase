import dashboardAccountPasswordReducer from '../../src/reducers/page/dashboard/account/password';
import {
    CHANGE_PASSWORD_START,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE
} from '../../src/actions/account';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('dashboardAccountPasswordReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardAccountPasswordReducer(undefined, 'INIT')).toEqual({
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

        describe(CHANGE_PASSWORD_START, function() {
            beforeEach(function() {
                state.updateSuccess = true;

                newState = dashboardAccountPasswordReducer(state, createAction(CHANGE_PASSWORD_START)());
            });

            it('should set update success to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    updateSuccess: false
                }));
            });
        });

        describe(CHANGE_PASSWORD_SUCCESS, function() {
            beforeEach(function() {
                newState = dashboardAccountPasswordReducer(state, createAction(CHANGE_PASSWORD_SUCCESS)({}));
            });

            it('should set update success to true', function() {
                expect(newState).toEqual(assign({}, state, {
                    updateSuccess: true
                }));
            });
        });

        describe(CHANGE_PASSWORD_FAILURE, function() {
            beforeEach(function() {
                state.updateSuccess = true;

                newState = dashboardAccountPasswordReducer(state, createAction(CHANGE_PASSWORD_FAILURE)({}));
            });

            it('should set update success to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    updateSuccess: false
                }));
            });
        });
    });
});
