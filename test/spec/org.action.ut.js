const proxyquire = require('proxyquire');

describe('org actions', function() {
    let realCreateDbActions, createDbActions;
    let actions;
    let org;

    beforeEach(function() {
        realCreateDbActions = require('../../src/utils/db').createDbActions;
        createDbActions = jasmine.createSpy('createDbActions()').and.callFake(realCreateDbActions);
        Object.keys(realCreateDbActions).forEach(key => createDbActions[key] = realCreateDbActions[key]);

        actions = proxyquire('../../src/actions/org', {
            '../utils/db': {
                createDbActions,

                __esModule: true
            },
            './api': {
                callAPI: require('../../src/actions/api').callAPI,

                __esModule: true
            }
        });
        org = actions.default;
    });

    it('should create db actions for orgs', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'org',
            endpoint: '/api/account/orgs'
        });
        expect(org).toEqual(createDbActions.calls.mostRecent().returnValue);
    });
});
