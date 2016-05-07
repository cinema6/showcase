const proxyquire = require('proxyquire');

fdescribe('campaign-detail-actions',function(){
    let lib;
    let dispatch;
    let callAPI = jasmine.createSpy('callAPI');

    beforeEach(function(){
        lib = proxyquire('../../src/actions/campaign_detail', {
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
                    'CAMPAIGN_DETAIL/GET_CAMPAIGN_ANALYTICS_START',
                    'CAMPAIGN_DETAIL/GET_CAMPAIGN_ANALYTICS_SUCCESS',
                    'CAMPAIGN_DETAIL/GET_CAMPAIGN_ANALYTICS_FAILURE'
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
                type : 'CAMPAIGN_DETAIL/LOAD_PAGE_DATA',
                payload : undefined
            });
        });
    });
});
