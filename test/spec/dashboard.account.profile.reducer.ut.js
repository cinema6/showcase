import dashboardAccountProfileReducer from '../../src/reducers/page/dashboard/account/profile';
import {
    UPDATE_SUCCESS,
    UPDATE_FAILURE
} from '../../src/actions/account';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('dashboardAccountProfileReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardAccountProfileReducer(undefined, 'INIT')).toEqual({
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

        describe(UPDATE_SUCCESS, function() {
            beforeEach(function() {
                newState = dashboardAccountProfileReducer(state, createAction(UPDATE_SUCCESS)({}));
            });

            it('should set update success to true', function() {
                expect(newState).toEqual(assign({}, state, {
                    updateSuccess: true
                }));
            });
        });

        describe(UPDATE_FAILURE, function() {
            beforeEach(function() {
                state.updateSuccess = true;

                newState = dashboardAccountProfileReducer(state, createAction(UPDATE_FAILURE)({}));
            });

            it('should set update success to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    updateSuccess: false
                }));
            });
        });
    });
});
