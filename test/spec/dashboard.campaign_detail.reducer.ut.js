import dashboardCampaignDetailReducer
    from '../../src/reducers/page/dashboard/campaign_detail';
import {
    LOAD_PAGE_DATA,

    GET_CAMPAIGN_ANALYTICS_START,
    GET_CAMPAIGN_ANALYTICS_SUCCESS,
    GET_CAMPAIGN_ANALYTICS_FAILURE
} from '../../src/actions/campaign_detail';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

fdescribe('dashboardCampaignDetailReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardCampaignDetailReducer(undefined, 'INIT')).toEqual({
            loading: false,
            analyticsError: null
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                loading: false
            };
        });

        describe(`${LOAD_PAGE_DATA}_PENDING`, function() {
            beforeEach(function() {
                state.loading = false;
                action = createAction(`${LOAD_PAGE_DATA}_PENDING`)();

                newState = dashboardCampaignDetailReducer(state, action);
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

                newState = dashboardCampaignDetailReducer(state, action);
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

                newState = dashboardCampaignDetailReducer(state, action);
            });

            it('should set loading to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    loading: false
                }));
            });
        });

        describe(`${GET_CAMPAIGN_ANALYTICS_FAILURE}`, function(){
            var err;
            beforeEach(function() {
                err = new Error('error');;
                action = createAction(`${GET_CAMPAIGN_ANALYTICS_FAILURE}`)(err);

                newState = dashboardCampaignDetailReducer(state, action);
            });
            
            it('should set analyticsError to payload', function() {
                expect(newState).toEqual(assign({}, state, {
                    loading: false,
                    analyticsError : err
                }));
            });

        });
    });
});
