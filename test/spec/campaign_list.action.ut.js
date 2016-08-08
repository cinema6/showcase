import {
    loadPageData,

    LOAD_PAGE_DATA
} from '../../src/actions/campaign_list';
import { getThunk } from '../../src/middleware/fsa_thunk';
import * as stubs from '../helpers/stubs';
import { createAction } from 'redux-actions';
import campaigns from '../../src/actions/campaign';
import { createUuid } from 'rc-uuid';
import { getCampaignAnalytics } from '../../src/actions/analytics';

describe('campaign_list actions', () => {
    describe('loadPageData()', () => {
        let thunk;

        beforeEach(() => {
            thunk = getThunk(loadPageData());
        });

        afterEach(() => {
            thunk = null;
        });

        it('should return a thunk', () => {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', () => {
            let success;
            let failure;
            let dispatch;
            let getState;

            beforeEach(done => {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                dispatch = stubs.dispatch();
                getState = jasmine.createSpy('getState()').and.callFake(() => ({}));

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            afterEach(() => {
                success = null;
                failure = null;
                dispatch = null;
                getState = null;
            });

            it('should dispatch LOAD_PAGE_DATA', () => {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOAD_PAGE_DATA)(jasmine.any(Promise)));
            });

            it('should list the campaigns', () => {
                expect(dispatch).toHaveBeenCalledWith(campaigns.list());
            });

            describe('when the campaigns are fetched', () => {
                let campaigns;

                beforeEach(done => {
                    campaigns = Array.apply([], new Array(5)).map(() => ({
                        id: `cam-${createUuid()}`
                    }));

                    dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(campaigns);
                    setTimeout(done);

                    dispatch.calls.reset();
                });

                afterEach(() => {
                    campaigns = null;
                });

                it('should get analytics for the campaigns', () => {
                    expect(dispatch.calls.count()).toBe(campaigns.length);
                    campaigns.forEach(campaign => expect(dispatch).toHaveBeenCalledWith(getCampaignAnalytics(campaign.id)));
                });

                describe('when the analytics are fetched', () => {
                    beforeEach(done => {
                        dispatch.calls.all().forEach(call => dispatch.getDeferred(call.args[0]).resolve({
                            campaignId: call.args[0].payload.args[0],
                            summary: {

                            }
                        }));

                        setTimeout(done);
                    });

                    it('should fulfill with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });

                describe('if there is a problem fetching analytics', () => {
                    let reason;

                    beforeEach(done => {
                        reason = new Error('I failed!');

                        dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).reject(reason);
                        setTimeout(done);
                    });

                    afterEach(() => {
                        reason = null;
                    });

                    it('should reject with the reason', () => {
                        expect(failure).toHaveBeenCalledWith(reason);
                    });
                });
            });

            describe('if there is a problem', () => {
                let reason;

                beforeEach(done => {
                    reason = new Error('I failed!');

                    dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).reject(reason);
                    setTimeout(done);
                });

                afterEach(() => {
                    reason = null;
                });

                it('should reject with the reason', () => {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });
        });
    });
});
