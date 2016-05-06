const proxyquire = require('proxyquire');

describe('stats-actions',function(){
    let lib;
    let dispatch;
    let callAPI = jasmine.createSpy('callAPI');

    beforeEach(function(){
        lib = proxyquire('../../src/actions/stats', {
            './api':  { callAPI },
            __esModule: true
        });

        dispatch = jasmine.createSpy('dispatch');
    });
    
    describe('getCampaignAnalytics(campaignId)', function() {
        let thunk;
        beforeEach(function(){
            thunk = lib.getCampaignAnalytics('xyz'); 
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        it('the thunk should call callAPI', function() {
            thunk(dispatch);
            expect(callAPI).toHaveBeenCalledWith({
                types : [
                    'STATS/GET_CAMPAIGN_ANALYTICS_START',
                    'STATS/GET_CAMPAIGN_ANALYTICS_SUCCESS',
                    'STATS/GET_CAMPAIGN_ANALYTICS_FAILURE'
                ],
                credentials: 'same-origin',
                endpoint: '/api/analytics/campaigns?ids=xyz'
            });
        });
    });

    describe('loadPageData(campaignId)',function(){
        let thunk;
        beforeEach(function(){
            thunk = lib.loadPageData('abc'); 
        });
        
        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        it('should create an action with a promise in the payload',function(){
            thunk(dispatch); 
            expect(dispatch).toHaveBeenCalledWith({
                type : 'STATS/LOAD_PAGE_DATA',
                payload : jasmine.any(Promise)
            });
        });
    });
});
