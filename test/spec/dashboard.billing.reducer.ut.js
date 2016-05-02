import dashboardBillingReducer from '../../src/reducers/page/dashboard/billing';
import {
    SHOW_CHANGE_MODAL,
    LOAD_PAGE_DATA
} from '../../src/actions/billing';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('dashboardBillingReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardBillingReducer(undefined, 'INIT')).toEqual({
            showChangeModal: false,
            loading: false
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                showChangeModal: false,
                loading: false
            };
        });

        describe(SHOW_CHANGE_MODAL, function() {
            beforeEach(function() {
                action = createAction(SHOW_CHANGE_MODAL)(true);

                newState = dashboardBillingReducer(state, action);
            });

            it('should update showChangeModal', function() {
                expect(newState).toEqual(assign({}, state, {
                    showChangeModal: true
                }));
            });
        });

        describe(`${LOAD_PAGE_DATA}_PENDING`, function() {
            beforeEach(function() {
                state.loading = false;
                action = createAction(`${LOAD_PAGE_DATA}_PENDING`)();

                newState = dashboardBillingReducer(state, action);
            });

            it('should udpate loading', function() {
                expect(newState).toEqual(assign({}, state, {
                    loading: true
                }));
            });
        });

        describe(`${LOAD_PAGE_DATA}_FULFILLED`, function() {
            beforeEach(function() {
                state.loading = true;
                action = createAction(`${LOAD_PAGE_DATA}_FULFILLED`)();

                newState = dashboardBillingReducer(state, action);
            });

            it('should udpate loading', function() {
                expect(newState).toEqual(assign({}, state, {
                    loading: false
                }));
            });
        });

        describe(`${LOAD_PAGE_DATA}_REJECTED`, function() {
            beforeEach(function() {
                state.loading = true;
                action = createAction(`${LOAD_PAGE_DATA}_REJECTED`)();

                newState = dashboardBillingReducer(state, action);
            });

            it('should set loading to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    loading: false
                }));
            });
        });
    });
});
