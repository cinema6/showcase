import dashboardEditProductReducer from '../../src/reducers/page/dashboard/edit_product';
import { assign } from 'lodash';
import { createAction } from 'redux-actions';
import {
    GO_TO_STEP,
    LOAD_CAMPAIGN
} from '../../src/actions/product_wizard';
import { createUuid } from 'rc-uuid';

describe('dashboardEditProductReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardEditProductReducer(undefined, 'INIT')).toEqual({
            step: 1,
            loading: false
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                step: 1,
                loading: false
            };
        });

        describe(GO_TO_STEP, function() {
            let step;

            beforeEach(function() {
                step = 3;

                action = createAction(GO_TO_STEP)(step);
                newState = dashboardEditProductReducer(state, action);
            });

            it('should move to the specified step', function() {
                expect(newState).toEqual(assign({}, state, {
                    step
                }));
            });
        });

        describe(`${LOAD_CAMPAIGN}_PENDING`, function() {
            beforeEach(function() {
                action = createAction(`${LOAD_CAMPAIGN}_PENDING`)();

                newState = dashboardEditProductReducer(state, action);
            });

            it('should set loading to true', function() {
                expect(newState).toEqual(assign({}, state, {
                    loading: true
                }));
            });
        });

        describe(`${LOAD_CAMPAIGN}_FULFILLED`, function() {
            beforeEach(function() {
                state.loading = true;
                action = createAction(`${LOAD_CAMPAIGN}_FULFILLED`)([`cam-${createUuid()}`]);

                newState = dashboardEditProductReducer(state, action);
            });

            it('should set loading to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    loading: false
                }));
            });
        });

        describe(`${LOAD_CAMPAIGN}_REJECTED`, function() {
            beforeEach(function() {
                state.loading = true;
                action = createAction(`${LOAD_CAMPAIGN}_REJECTED`)(new Error('Something bad!'));

                newState = dashboardEditProductReducer(state, action);
            });

            it('will set loading to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    loading: false
                }));
            });
        });
    });
});
