const proxyquire = require('proxyquire');

describe('advertiser actions', function() {
    let realCreateDbActions, createDbActions;
    let actions;
    let advertiser;

    beforeEach(function() {
        realCreateDbActions = require('../../src/utils/db').createDbActions;
        createDbActions = jasmine.createSpy('createDbActions()').and.callFake(realCreateDbActions);
        Object.keys(realCreateDbActions).forEach(key => createDbActions[key] = realCreateDbActions[key]);

        actions = proxyquire('../../src/actions/advertiser', {
            '../utils/db': {
                createDbActions,

                __esModule: true
            },
            './api': {
                callAPI: require('../../src/actions/api').callAPI,

                __esModule: true
            }
        });
        advertiser = actions.default;
    });

    it('should create db actions for advertisers', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'advertiser',
            endpoint: '/api/account/advrs'
        });
        expect(advertiser).toEqual(createDbActions.calls.mostRecent().returnValue);
    });
});
