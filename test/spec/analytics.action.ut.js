const proxyquire = require('proxyquire');

describe('analytics-actions',function(){
    let lib;
    let dispatch;
    let callAPI = jasmine.createSpy('callAPI');

    beforeEach(function(){
        lib = proxyquire('../../src/actions/analytics', {
            './api':  { callAPI },
            __esModule: true
        });

        dispatch = jasmine.createSpy('dispatch()').and.returnValue(new Promise(() => {}));
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
                    'ANALYTICS/GET_CAMPAIGN_ANALYTICS_START',
                    'ANALYTICS/GET_CAMPAIGN_ANALYTICS_SUCCESS',
                    'ANALYTICS/GET_CAMPAIGN_ANALYTICS_FAILURE'
                ],
                credentials: 'same-origin',
                endpoint: '/api/analytics/campaigns?ids=xyz'
            });
        });
    });
});

