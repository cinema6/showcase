import {
    loadPageData,
    restoreCampaign,

    LOAD_PAGE_DATA,
    RESTORE_CAMPAIGN
} from '../../src/actions/archive';
import * as stubs from '../helpers/stubs';
import { getThunk } from '../../src/middleware/fsa_thunk';
import {
    cloneDeep as clone
} from 'lodash';
import { createAction } from 'redux-actions';
import campaign from '../../src/actions/campaign';
import { createUuid } from 'rc-uuid';
import {
    restore
} from '../../src/actions/campaign';
import {
    notify
} from '../../src/actions/notification';
import {
    checkForSlots,
    promptUpgrade
} from '../../src/actions/dashboard';
import * as NOTIFICATION from '../../src/enums/notification';

describe('archive actions', () => {
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
            let dispatch;
            let getState;
            let state;
            let success;
            let failure;

            beforeEach(done => {
                state = {};

                dispatch = stubs.dispatch();
                getState = jasmine.createSpy('getState()').and.callFake(() => clone(state));

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            afterEach(() => {
                dispatch = null;
                getState = null;
                state = null;
                success = null;
                failure = null;
            });

            it('should dispatch() LOAD_PAGE_DATA', () => {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOAD_PAGE_DATA)(jasmine.any(Promise)));
            });

            it('should query for canceled campaigns', () => {
                expect(dispatch).toHaveBeenCalledWith(campaign.query({ statuses: 'canceled' }));
            });

            describe('when the query succeeds', () => {
                let campaigns;

                beforeEach(done => {
                    campaigns = Array.apply([], new Array(5)).map(() => ({
                        id: `cam-${createUuid()}`
                    }));

                    dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(campaigns);
                    setTimeout(done);
                });

                afterEach(() => {
                    campaigns = null;
                });

                it('should fulfill with undefined', () => {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('if the query fails', () => {
                let reason;

                beforeEach(done => {
                    reason = new Error('I had a problem!');

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

    describe('restoreCampaign(id)', () => {
        let id;
        let thunk;

        beforeEach(() => {
            id = `cam-${createUuid()}`;
            thunk = getThunk(restoreCampaign(id));
        });

        afterEach(() => {
            thunk = null;
            id = null;
        });

        it('should return a thunk', () => {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', () => {
            let dispatch;
            let getState;
            let state;
            let success;
            let failure;

            beforeEach(done => {
                state = {};

                dispatch = stubs.dispatch();
                getState = jasmine.createSpy('getState()').and.callFake(() => clone(state));

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            afterEach(() => {
                dispatch = null;
                getState = null;
                state = null;
                success = null;
                failure = null;
            });

            it('should dispatch() RESTORE_CAMPAIGN', () => {
                expect(dispatch).toHaveBeenCalledWith(createAction(RESTORE_CAMPAIGN)(jasmine.any(Promise)));
            });

            it('should check for slots', () => {
                expect(dispatch).toHaveBeenCalledWith(checkForSlots());
            });

            describe('if the are slots', () => {
                beforeEach(done => {
                    dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(true);
                    setTimeout(done);
                    dispatch.calls.reset();
                });

                it('should restore() the campaign', () => {
                    expect(dispatch).toHaveBeenCalledWith(restore(id));
                });

                describe('when the campaign has been restored', () => {
                    let campaign;

                    beforeEach(done => {
                        campaign = {
                            id,
                            status: 'active',
                            product: {
                                name: 'Facebook'
                            }
                        };

                        dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve([campaign]);
                        setTimeout(done);
                        dispatch.calls.reset();
                    });

                    afterEach(() => {
                        campaign = null;
                    });

                    it('should show a success notification', () => {
                        expect(dispatch).toHaveBeenCalledWith(notify({
                            type: NOTIFICATION.TYPE.SUCCESS,
                            message: jasmine.any(String)
                        }));
                    });

                    it('should fulfill with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });

                describe('if the campaign cannot be restored', () => {
                    let reason;

                    beforeEach(done => {
                        reason = new Error('There was a problem!');

                        dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).reject(reason);
                        setTimeout(done);
                        dispatch.calls.reset();
                    });

                    afterEach(() => {
                        reason = null;
                    });

                    it('should show an error', () => {
                        expect(dispatch).toHaveBeenCalledWith(notify({
                            type: NOTIFICATION.TYPE.DANGER,
                            message: jasmine.any(String)
                        }));
                    });

                    it('should fulfill with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });
            });

            describe('if there are no slots', () => {
                beforeEach(done => {
                    dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(false);
                    setTimeout(done);
                    dispatch.calls.reset();
                });

                it('should not restore the campaign', () => {
                    expect(dispatch).not.toHaveBeenCalledWith(restore(jasmine.anything()));
                });

                it('should prompt the user to upgrade', () => {
                    expect(dispatch).toHaveBeenCalledWith(promptUpgrade('/dashboard/archive'));
                });

                it('should fulfill with undefined', () => {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('if a redirect is specified', () => {
                let redirect;

                beforeEach(done => {
                    dispatch.calls.reset();
                    dispatch.resetDeferreds();
                    success.calls.reset();
                    failure.calls.reset();

                    redirect = '/foo/bar';

                    getThunk(restoreCampaign(id, redirect))(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                afterEach(() => {
                    redirect = null;
                });

                describe('if there are no slots', () => {
                    beforeEach(done => {
                        dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(false);
                        setTimeout(done);
                        dispatch.calls.reset();
                    });

                    it('should not restore the campaign', () => {
                        expect(dispatch).not.toHaveBeenCalledWith(restore(jasmine.anything()));
                    });

                    it('should prompt the user to upgrade', () => {
                        expect(dispatch).toHaveBeenCalledWith(promptUpgrade(redirect));
                    });

                    it('should fulfill with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });
            });
        });
    });
});
