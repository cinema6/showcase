const proxyquire = require('proxyquire');

describe('campaign actions', function() {
    let realCreateDbActions, createDbActions;
    let actions;
    let campaign;

    beforeEach(function() {
        realCreateDbActions = require('../../src/utils/db').createDbActions;
        createDbActions = jasmine.createSpy('createDbActions()').and.callFake(realCreateDbActions);
        Object.keys(realCreateDbActions).forEach(key => createDbActions[key] = realCreateDbActions[key]);

        actions = proxyquire('../../src/actions/campaign', {
            '../utils/db': {
                createDbActions,

                __esModule: true
            },
            './api': {
                callAPI: require('../../src/actions/api').callAPI,

                __esModule: true
            }
        });
        campaign = actions.default;
    });

    it('should create db actions for campaigns', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'campaign',
            endpoint: '/api/campaigns'
        });
        expect(campaign).toEqual(createDbActions.calls.mostRecent().returnValue);
    });
});
