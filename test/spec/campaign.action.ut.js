import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import {
    CANCEL
} from '../../src/actions/campaign';

const proxyquire = require('proxyquire');

describe('campaign actions', function() {
    let realCreateDbActions, createDbActions;
    let actions;
    let campaign, cancel;

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
        cancel = actions.cancel;
    });

    it('should create db actions for campaigns', function() {
        expect(createDbActions).toHaveBeenCalledWith({
            type: 'campaign',
            endpoint: '/api/campaigns',
            queries: {
                list: {
                    application: 'showcase',
                    statuses: [
                        'draft',
                        'new',
                        'pending',
                        'approved',
                        'rejected',
                        'active',
                        'paused',
                        'inactive',
                        'expired',
                        'outOfBudget',
                        'error'
                    ].join(',')
                }
            }
        });
        expect(campaign).toEqual(createDbActions.calls.mostRecent().returnValue);
    });

    describe('cancel(id)', function() {
        let id;
        let thunk;

        beforeEach(function() {
            id = `cam-${createUuid()}`;

            thunk = cancel(id);
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let success, failure;
            let dispatchDeferred;
            let dispatch, getState;

            beforeEach(function(done) {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                dispatchDeferred = defer();
                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (typeof action === 'function') {
                        return dispatchDeferred.promise;
                    }

                    if (action.payload instanceof Promise) {
                        return action.payload.then(value => ({ value, action }), reason => Promise.reject({ reason, action }));
                    }

                    return Promise.resolve(action.payload);
                });
                getState = jasmine.createSpy('getState()').and.returnValue({});

                spyOn(campaign, 'update').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should dispatch() CANCEL', function() {
                expect(dispatch).toHaveBeenCalledWith({
                    type: CANCEL,
                    payload: jasmine.any(Promise)
                });
            });

            it('should udpate the campaign', function() {
                expect(campaign.update).toHaveBeenCalledWith({
                    data: { id, status: 'canceled' }
                });
                expect(dispatch).toHaveBeenCalledWith(campaign.update.calls.mostRecent().returnValue);
            });

            describe('if the update succeeds', function() {
                beforeEach(function(done) {
                    dispatchDeferred.resolve([id]);
                    setTimeout(done);
                });

                it('should fulfill the promise', function() {
                    expect(success).toHaveBeenCalledWith([id]);
                });
            });

            describe('if the update fails', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('I failed!');
                    dispatchDeferred.reject(reason);
                    setTimeout(done);
                });

                it('should reject with the reason', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });
        });
    });
});
