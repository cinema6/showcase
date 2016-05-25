const proxyquire = require('proxyquire');

describe('promotion actions', function() {
    let realCreateDbActions, createDbActions;
    let actions;
    let promotion;

    beforeEach(function() {
        realCreateDbActions = require('../../src/utils/db').createDbActions;
        createDbActions = jasmine.createSpy('createDbActions()').and.callFake(realCreateDbActions);
        Object.keys(realCreateDbActions).forEach(key => createDbActions[key] = realCreateDbActions[key]);

        actions = proxyquire('../../src/actions/promotion', {
            '../utils/db': {
                createDbActions,

                __esModule: true
            },
            './api': {
                callAPI: require('../../src/actions/api').callAPI,

                __esModule: true
            }
        });
        promotion = actions.default;
    });

    it('should create db actions for promotions', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'promotion',
            endpoint: '/api/promotions'
        });
        expect(promotion).toEqual(createDbActions.calls.mostRecent().returnValue);
    });
});
