'use strict';

import campaign from '../../src/actions/campaign';
import defer from 'promise-defer';
import {
    GET_CAMPAIGNS
} from '../../src/actions/session';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { getThunk, createThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

describe('session actions', function() {
    let actions;
    let getCampaigns;

    beforeEach(function() {
        actions = proxyquire('../../src/actions/session', {
            './campaign': {
                default: campaign,

                __esModule: true
            }
        });
        getCampaigns = actions.getCampaigns;
    });

    describe('getCampaigns()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(getCampaigns());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferred, state;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                dispatchDeferred = defer();
                state = {
                    session: {
                        campaigns: null
                    }
                };

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) { return dispatchDeferred.promise; }

                    if (!(action.payload instanceof Promise)) {
                        return Promise.resolve(action.payload);
                    } else {
                        return action.payload.then(value => ({ value, action }))
                            .catch(reason => Promise.reject({ reason, action }));
                    }
                });
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(campaign, 'list').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should dispatch GET_CAMPAIGNS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(GET_CAMPAIGNS)(jasmine.any(Promise)));
            });

            it('should get all the campaigns', function() {
                expect(campaign.list).toHaveBeenCalledWith();
                expect(dispatch).toHaveBeenCalledWith(campaign.list.calls.mostRecent().returnValue);
            });

            describe('when the campaigns are fetched', function() {
                let campaigns;

                beforeEach(function(done) {
                    campaigns = Array.apply([], new Array(3)).map(() => `cam-${createUuid()}`);
                    dispatchDeferred.resolve(campaigns);
                    setTimeout(done);
                });

                it('should fulfill with the ids', function() {
                    expect(success).toHaveBeenCalledWith(campaigns);
                });
            });

            describe('if there is a problem', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('I FAILED!');
                    dispatchDeferred.reject(reason);
                    setTimeout(done);
                });

                it('should reject with the reason', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });

            describe('if the campaigns have already been fetched', function() {
                beforeEach(function(done) {
                    state.session.campaigns = [`cam-${createUuid()}`];
                    success.calls.reset();
                    failure.calls.reset();
                    dispatch.calls.reset();
                    campaign.list.calls.reset();

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should dispatch GET_CAMPAIGNS', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(GET_CAMPAIGNS)(jasmine.any(Promise)));
                });

                it('should not get any campaigns', function() {
                    expect(campaign.list).not.toHaveBeenCalled();
                });

                it('should fulfill with the campaigns', function() {
                    expect(success).toHaveBeenCalledWith(state.session.campaigns);
                });
            });
        });
    });
});
