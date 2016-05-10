const proxyquire = require('proxyquire');

describe('campaign-detail-actions',function(){
    let lib;
    let dispatch;
    let callAPI = jasmine.createSpy('callAPI');

    beforeEach(function(){
        lib = proxyquire('../../src/actions/campaign_detail', {
            './api':  { callAPI },
            __esModule: true
        });

        dispatch = jasmine.createSpy('dispatch()').and.returnValue(new Promise(() => {}));
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
                payload : jasmine.any(Promise)
            });
        });
    });
});
