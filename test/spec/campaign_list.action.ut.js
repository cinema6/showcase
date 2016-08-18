import {
    loadPageData,
    archiveCampaign,

    LOAD_PAGE_DATA,
    ARCHIVE_CAMPAIGN
} from '../../src/actions/campaign_list';
import { getThunk } from '../../src/middleware/fsa_thunk';
import * as stubs from '../helpers/stubs';
import { createAction } from 'redux-actions';
import campaigns from '../../src/actions/campaign';
import { createUuid } from 'rc-uuid';
import { getCampaignAnalytics } from '../../src/actions/analytics';
import { showAlert } from '../../src/actions/alert';
import { notify } from '../../src/actions/notification';
import { cancel as cancelCampaign } from '../../src/actions/campaign';
import * as NOTIFICATION from '../../src/enums/notification';

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

    describe('archiveCampaign(campaign)', () => {
        let campaign;
        let thunk;

        beforeEach(() => {
            campaign = {
                id: `cam-${createUuid()}`,
                product: {
                    name: 'My Awesome App!'
                }
            };
            thunk = getThunk(archiveCampaign(campaign));
        });

        afterEach(() => {
            campaign = null;
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

            it('should dispatch ARCHIVE_CAMPAIGN', () => {
                expect(dispatch).toHaveBeenCalledWith(createAction(ARCHIVE_CAMPAIGN)(jasmine.any(Promise)));
            });

            it('should show an alert', () => {
                expect(dispatch).toHaveBeenCalledWith((() => {
                    const action = showAlert({
                        title: jasmine.any(String),
                        description: jasmine.any(String),
                        buttons: [
                            {
                                text: jasmine.any(String),
                                type: 'danger btn-block',
                                onSelect: jasmine.any(Function)
                            },
                            {
                                text: jasmine.any(String),
                                type: 'default btn-block',
                                onSelect: jasmine.any(Function)
                            }
                        ]
                    });

                    action.payload.id = jasmine.any(String);
                    action.payload.buttons.forEach(button => button.id = jasmine.any(String));

                    return action;
                })());

                it('should fulfill with undefined', () => {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('the alert that is shown', () => {
                let alert;
                let dismiss;

                beforeEach(() => {
                    alert = dispatch.calls.mostRecent().args[0].payload;
                    dismiss = jasmine.createSpy('dismiss()');
                });

                afterEach(() => {
                    alert =  null;
                    dismiss = null;
                });

                describe('first button', () => {
                    let success;
                    let failure;

                    beforeEach(done => {
                        dispatch.calls.reset();

                        success = jasmine.createSpy('success()');
                        failure = jasmine.createSpy('failure()');

                        alert.buttons[0].onSelect(dismiss).then(success, failure);
                        setTimeout(done);
                    });

                    afterEach(() => {
                        success = null;
                        failure = null;
                    });

                    it('should cancel the campaign', () => {
                        expect(dispatch).toHaveBeenCalledWith(cancelCampaign(campaign.id));
                    });

                    describe('if the cancelation fails', () => {
                        let reason;

                        beforeEach(done => {
                            reason = new Error('500 SERVER ERROR');
                            reason.response = 'There was an unexpected error!';

                            dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).reject(reason);
                            setTimeout(done);

                            dispatch.calls.reset();
                        });

                        it('should notify the user of the failure', () => {
                            expect(dispatch).toHaveBeenCalledWith(notify({
                                type: NOTIFICATION.TYPE.DANGER,
                                message: jasmine.any(String),
                                time: 10000
                            }));
                        });

                        it('should fulfill the Promise', () => {
                            expect(success).toHaveBeenCalledWith(undefined);
                        });
                    });

                    describe('if cancelation succeeds', () => {
                        beforeEach(done => {
                            dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(null);
                            setTimeout(done);

                            dispatch.calls.reset();
                        });

                        it('should notify the user of the success', () => {
                            expect(dispatch).toHaveBeenCalledWith(notify({
                                type: NOTIFICATION.TYPE.SUCCESS,
                                message: jasmine.any(String)
                            }));
                        });

                        it('should dismiss the alert', () => {
                            expect(dismiss).toHaveBeenCalledWith();
                        });

                        it('should fulfill with undefined', () => {
                            expect(success).toHaveBeenCalledWith(undefined);
                        });
                    });
                });

                describe('second button', () => {
                    beforeEach(() => {
                        alert.buttons[1].onSelect(dismiss);
                    });

                    it('should dismiss the alert', () => {
                        expect(dismiss).toHaveBeenCalledWith();
                    });
                });

            });
        });
    });
});
