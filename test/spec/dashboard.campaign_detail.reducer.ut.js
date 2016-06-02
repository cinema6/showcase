import dashboardCampaignDetailReducer
    from '../../src/reducers/page/dashboard/campaign_detail';
import {
    LOAD_PAGE_DATA,
    SHOW_INSTALL_TRACKING_INSTRUCTIONS,
    SHOW_AD_PREVIEW
} from '../../src/actions/campaign_detail';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('dashboardCampaignDetailReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardCampaignDetailReducer(undefined, 'INIT')).toEqual({
            loading: true,
            showInstallTrackingInstructions: false,
            showAdPreview: false,
            activeChart: 'CAMPAIGN_DETAIL_CHART_TODAY',
            activeSeries: 'CAMPAIGN_DETAIL_SERIES_USERS'
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                loading: false,
                showInstallTrackingInstructions: false,
                showAdPreview: false
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

        describe(SHOW_INSTALL_TRACKING_INSTRUCTIONS, function() {
            beforeEach(function() {
                action = createAction(SHOW_INSTALL_TRACKING_INSTRUCTIONS)(true);

                newState = dashboardCampaignDetailReducer(state, action);
            });

            it('should set showInstallTrackingInstructions', function() {
                expect(newState).toEqual(assign({}, state, {
                    showInstallTrackingInstructions: true
                }));
            });
        });

        describe(SHOW_AD_PREVIEW, function() {
            beforeEach(function() {
                action = createAction(SHOW_AD_PREVIEW)(true);

                newState = dashboardCampaignDetailReducer(state, action);
            });

            it('should set showAdPreview', function() {
                expect(newState).toEqual(assign({}, state, {
                    showAdPreview: true
                }));
            });
        });
    });
});
