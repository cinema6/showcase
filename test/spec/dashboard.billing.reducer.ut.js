import dashboardBillingReducer from '../../src/reducers/page/dashboard/billing';
import {
    SHOW_CHANGE_MODAL,
    LOAD_PAGE_DATA,
    SHOW_PLAN_MODAL,
    CHANGE_PAYMENT_PLAN,
    SET_POST_PLAN_CHANGE_REDIRECT
} from '../../src/actions/billing';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('dashboardBillingReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardBillingReducer(undefined, 'INIT')).toEqual({
            showChangeModal: false,
            showPlanModal: false,
            loading: false,
            changingPlan: false,
            postPlanChangeRedirect: null
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                showChangeModal: false,
                showPlanModal: false,
                loading: false,
                changingPlan: false,
                postPlanChangeRedirect: null
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

        describe(SHOW_PLAN_MODAL, () => {
            beforeEach(() => {
                action = createAction(SHOW_PLAN_MODAL)(true);

                newState = dashboardBillingReducer(state, action);
            });

            it('should update showPlanModal', () => {
                expect(newState).toEqual(assign({}, state, {
                    showPlanModal: true
                }));
            });
        });

        describe(SET_POST_PLAN_CHANGE_REDIRECT, () => {
            let path;

            beforeEach(() => {
                path = '/dashboard/archive';

                action = createAction(SET_POST_PLAN_CHANGE_REDIRECT)(path);
                newState = dashboardBillingReducer(state, action);
            });

            it('should update the postPlanChangeRedirect', () => {
                expect(newState).toEqual(assign({}, state, {
                    postPlanChangeRedirect: path
                }));
            });
        });

        describe(`${CHANGE_PAYMENT_PLAN}_PENDING`, () => {
            beforeEach(() => {
                action = createAction(`${CHANGE_PAYMENT_PLAN}_PENDING`)();

                newState = dashboardBillingReducer(state, action);
            });

            it('should flip changingPlan to true', () => {
                expect(newState).toEqual(assign({}, state, {
                    changingPlan: true
                }));
            });
        });

        [`${CHANGE_PAYMENT_PLAN}_FULFILLED`, `${CHANGE_PAYMENT_PLAN}_REJECTED`].forEach(type => describe(type, () => {
            beforeEach(() => {
                state.changingPlan = true;
                action = createAction(type)();

                newState = dashboardBillingReducer(state, action);
            });

            it('should flip changingPlan to false', () => {
                expect(newState).toEqual(assign({}, state, {
                    changingPlan: false
                }));
            });
        }));

        describe(`${LOAD_PAGE_DATA}_PENDING`, function() {
            beforeEach(function() {
                state.loading = false;
                action = createAction(`${LOAD_PAGE_DATA}_PENDING`)();

                newState = dashboardBillingReducer(state, action);
            });

            it('should set loading', function() {
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
