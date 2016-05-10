import analyticsReducer
    from '../../src/reducers/analytics';
import {
    GET_CAMPAIGN_ANALYTICS_START,
    GET_CAMPAIGN_ANALYTICS_SUCCESS,
    GET_CAMPAIGN_ANALYTICS_FAILURE
} from '../../src/actions/analytics';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('analyticsReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(analyticsReducer(undefined, 'INIT')).toEqual({
            results: {},
            lastError: null
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                results: {},
                lastError : null
            };
        });

        describe(`${GET_CAMPAIGN_ANALYTICS_START}`, function(){
            beforeEach(function() {
                state.lastError = 'some error';
                action = createAction(`${GET_CAMPAIGN_ANALYTICS_START}`)({});
                newState = analyticsReducer(state, action);
            });
            
            it('should set lastError to null', function() {
                expect(newState).toEqual(assign({}, state, {
                    results : {},
                    lastError : null
                }));
            });

        });

        describe(`${GET_CAMPAIGN_ANALYTICS_FAILURE}`, function(){
            var err;
            beforeEach(function() {
                err = new Error('error');;
                action = createAction(`${GET_CAMPAIGN_ANALYTICS_FAILURE}`)(err);

                newState = analyticsReducer(state, action);
            });
            
            it('should set analyticsError to payload', function() {
                expect(newState).toEqual(assign({}, state, {
                    results : {},
                    lastError : err
                }));
            });

        });

        describe(`${GET_CAMPAIGN_ANALYTICS_SUCCESS}`, function(){
            var doc;
            beforeEach(function() {
                doc = { campaignId: 'abc' };
                action = createAction(`${GET_CAMPAIGN_ANALYTICS_SUCCESS}`)(doc);

                newState = analyticsReducer(state, action);
            });
            
            it('should set analyticsError to payload', function() {
                expect(newState).toEqual(assign({}, state, {
                    results : {
                        'abc' : { campaignId : 'abc' }
                    },
                    lastError : null
                }));
            });

        });
    });
});

