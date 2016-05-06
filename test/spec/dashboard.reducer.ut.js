import dashboardReducer from '../../src/reducers/page/dashboard';
import {
    SHOW_NAV,
    TOGGLE_NAV
} from '../../src/actions/dashboard';
import {
    LOCATION_CHANGE
} from 'react-router-redux';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('dashboardReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardReducer(undefined, 'INIT')).toEqual({
            showNav: false
        });
    });

    describe('handling actions', function() {
        let state;

        beforeEach(function() {
            state = {
                showNav: false
            };
        });

        describe(SHOW_NAV, function() {
            it('should set the showNav property', function() {
                state.showNav = false;
                expect(dashboardReducer(state, createAction(SHOW_NAV)(true))).toEqual(assign({}, state, {
                    showNav: true
                }));

                state.showNav = true;
                expect(dashboardReducer(state, createAction(SHOW_NAV)(false))).toEqual(assign({}, state, {
                    showNav: false
                }));
            });
        });

        describe(TOGGLE_NAV, function() {
            it('should Toggle the showNav property', function() {
                state.showNav = false;
                expect(dashboardReducer(state, createAction(TOGGLE_NAV)())).toEqual(assign({}, state, {
                    showNav: true
                }));

                state.showNav = true;
                expect(dashboardReducer(state, createAction(TOGGLE_NAV)())).toEqual(assign({}, state, {
                    showNav: false
                }));
            });
        });

        describe(LOCATION_CHANGE, function() {
            beforeEach(function() {
                state.showNav = true;
            });

            it('should set the showNav property to false', function() {
                expect(dashboardReducer(state, createAction(LOCATION_CHANGE)())).toEqual(assign({}, state, {
                    showNav: false
                }));
            });
        });
    });
});
