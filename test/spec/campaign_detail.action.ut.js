import { createUuid } from 'rc-uuid';
import {
    showAlert
} from '../../src/actions/alert';
import campaign, {
    cancel as cancelCampaign
} from '../../src/actions/campaign';
import defer from 'promise-defer';
import { replace } from 'react-router-redux';
import { notify } from '../../src/actions/notification';
import { TYPE as NOTIFICATION_TYPE } from '../../src/enums/notification';
import {
    LOAD_PAGE_DATA,
    SHOW_INSTALL_TRACKING_INSTRUCTIONS
} from '../../src/actions/campaign_detail';
import {
    getCampaignAnalytics
} from '../../src/actions/analytics';

const proxyquire = require('proxyquire');

describe('campaign-detail-actions',function(){
    let lib;
    let callAPI, alertActions, campaignActions, notificationActions, analyticsActions;

    beforeEach(function(){
        callAPI = jasmine.createSpy('callAPI()');

        analyticsActions = {
            getCampaignAnalytics: jasmine.createSpy('getCampaignAnalytics()').and.callFake(getCampaignAnalytics),

            __esModule: true
        };

        alertActions = {
            showAlert: jasmine.createSpy('showAlert').and.callFake(showAlert),

            __esModule: true
        };

        campaignActions = {
            cancel: jasmine.createSpy('cancel()').and.callFake(cancelCampaign),
            default: campaign,

            __esModule: true
        };

        notificationActions = {
            notify: jasmine.createSpy('notify()').and.callFake(notify),

            __esModule: true
        };

        lib = proxyquire('../../src/actions/campaign_detail', {
            './api':  { callAPI },
            './alert': alertActions,
            './campaign': campaignActions,
            './notification': notificationActions,
            './analytics': analyticsActions
        });
    });

    describe('showInstallTrackingInstructions(show)', function() {
        let result;

        beforeEach(function() {
            result = lib.showInstallTrackingInstructions(false);
        });

        it('should return an FSA', function() {
            expect(result).toEqual({
                type: SHOW_INSTALL_TRACKING_INSTRUCTIONS,
                payload: false
            });
        });
    });

    describe('loadPageData(campaignId)',function(){
        let campaignId;
        let thunk;

        beforeEach(function(){
            campaignId = `cam-${createUuid()}`;
            thunk = lib.loadPageData(campaignId);
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferreds, state;
            let success, failure;
            let dispatch, getState;

            beforeEach(function(done) {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                dispatchDeferreds = new WeakMap();
                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (typeof action === 'function') {
                        let deferred = defer();
                        dispatchDeferreds.set(action, deferred);
                        return deferred.promise;
                    }

                    if (action.payload instanceof Promise) {
                        return action.payload.then(value => ({ value, action }), reason => Promise.reject({ reason, action }));
                    }

                    return Promise.resolve(action.payload);
                });
                state = {
                    db: {
                        campaign: {}
                    }
                };
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                spyOn(campaign, 'get').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should create an action with a promise in the payload',function(){
                expect(dispatch).toHaveBeenCalledWith({
                    type : LOAD_PAGE_DATA,
                    payload : jasmine.any(Promise)
                });
            });

            it('should get the campaign', function() {
                expect(campaign.get).toHaveBeenCalledWith({ id: campaignId });
                expect(dispatch).toHaveBeenCalledWith(campaign.get.calls.mostRecent().returnValue);
            });

            it('should get the campaign analytics', function() {
                expect(analyticsActions.getCampaignAnalytics).toHaveBeenCalledWith(campaignId);
                expect(dispatch).toHaveBeenCalledWith(analyticsActions.getCampaignAnalytics.calls.mostRecent().returnValue);
            });

            describe('if getting both succeeds', function() {
                let campaignData, analyticsData;

                beforeEach(function(done) {
                    campaignData = {
                        id: campaignId,
                        product: {},
                        targeting: {}
                    };
                    analyticsData = {
                        data: {},
                        foo: 'bar'
                    };

                    dispatchDeferreds.get(campaign.get.calls.mostRecent().returnValue).resolve(campaignData);
                    dispatchDeferreds.get(analyticsActions.getCampaignAnalytics.calls.mostRecent().returnValue).resolve(analyticsData);

                    setTimeout(done);
                });

                it('should fulfill the Promise', function() {
                    expect(success).toHaveBeenCalledWith([campaignData, analyticsData]);
                });
            });

            describe('if getting analytics fails', function() {
                let reason, campaignData;

                beforeEach(function(done) {
                    campaignData = {
                        id: campaignId,
                        product: {},
                        targeting: {}
                    };
                    reason = new Error('It just didn\'t work...');

                    dispatchDeferreds.get(campaign.get.calls.mostRecent().returnValue).resolve(campaignData);
                    dispatchDeferreds.get(analyticsActions.getCampaignAnalytics.calls.mostRecent().returnValue).reject(reason);

                    setTimeout(done);
                });

                it('should show a warning', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION_TYPE.WARNING,
                        message: `Couldn't fetch analytics: ${reason.message}`,
                        time: 10000
                    });
                    expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                });

                it('should fulfill the promise', function() {
                    expect(success).toHaveBeenCalledWith([campaignData, null]);
                });
            });

            describe('if getting the campaign fails', function() {
                let reason, analyticsData;

                beforeEach(function() {
                    analyticsData = {
                        data: {},
                        foo: 'bar'
                    };
                    reason = new Error('There were issues.');

                    dispatchDeferreds.get(campaign.get.calls.mostRecent().returnValue).reject(reason);
                    dispatchDeferreds.get(analyticsActions.getCampaignAnalytics.calls.mostRecent().returnValue).resolve(analyticsData);
                });

                describe('if there is cached data', function() {
                    beforeEach(function(done) {
                        state.db.campaign[campaignId] = {
                            id: campaignId
                        };

                        setTimeout(done);
                    });

                    it('should not show a notification', function() {
                        expect(notificationActions.notify).not.toHaveBeenCalled();
                    });

                    it('should not redirect', function() {
                        expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                            type: replace('foo').type
                        }));
                    });

                    it('should fulfill with the cached data', function() {
                        expect(success).toHaveBeenCalledWith([state.db.campaign[campaignId], analyticsData]);
                    });
                });

                describe('if there is no cached data', function() {
                    beforeEach(function(done) {
                        delete state.db.campaign[campaignId];

                        setTimeout(done);
                    });

                    it('should show an error', function() {
                        expect(notificationActions.notify).toHaveBeenCalledWith({
                            type: NOTIFICATION_TYPE.DANGER,
                            message: `Failed to fetch campaign: ${reason.message}`,
                            time: 10000
                        });
                        expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                    });

                    it('should redirect', function() {
                        expect(dispatch).toHaveBeenCalledWith(replace('/dashboard'));
                    });

                    it('should reject', function() {
                        expect(failure).toHaveBeenCalledWith(reason);
                    });
                });
            });
        });
    });

    describe('removeCampaign(campaignId)', function() {
        let campaignId;
        let thunk;

        beforeEach(function() {
            campaignId = `cam-${createUuid()}`;

            thunk = lib.removeCampaign(campaignId);
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferred;
            let dispatch, getState;

            beforeEach(function(done) {
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

                thunk(dispatch, getState);
                setTimeout(done);
            });

            it('should show an alert', function() {
                expect(alertActions.showAlert).toHaveBeenCalledWith({
                    title: 'Woah There!',
                    description: 'Are you sure you want to delete your campaign? This cannot be un-done.',
                    buttons: [
                        {
                            text: 'Keep',
                            onSelect: jasmine.any(Function)
                        },
                        {
                            text: 'Delete',
                            type: 'danger',
                            onSelect: jasmine.any(Function)
                        }
                    ]
                });
                expect(dispatch).toHaveBeenCalledWith(alertActions.showAlert.calls.mostRecent().returnValue);
            });

            describe('when the user chooses', function() {
                let dismiss;
                let keep, remove;

                beforeEach(function() {
                    dismiss = jasmine.createSpy('dismiss()').and.returnValue(Promise.resolve({ id: createUuid() }));

                    keep = alertActions.showAlert.calls.mostRecent().args[0].buttons[0];
                    remove = alertActions.showAlert.calls.mostRecent().args[0].buttons[1];
                });

                describe('to keep their campaign', function() {
                    beforeEach(function() {
                        keep.onSelect(dismiss);
                    });

                    it('should dismiss the alert', function() {
                        expect(dismiss).toHaveBeenCalledWith();
                    });
                });

                describe('to remove their campaign', function() {
                    let success, failure;

                    beforeEach(function(done) {
                        dispatchDeferred = defer();
                        dispatch.calls.reset();

                        success = jasmine.createSpy('success()');
                        failure = jasmine.createSpy('failure()');

                        remove.onSelect(dismiss).then(success, failure);
                        setTimeout(done);
                    });

                    it('should cancel() the campaign', function() {
                        expect(campaignActions.cancel).toHaveBeenCalledWith(campaignId);
                        expect(dispatch).toHaveBeenCalledWith(campaignActions.cancel.calls.mostRecent().returnValue);
                    });

                    describe('when the campaign is canceled', function() {
                        beforeEach(function(done) {
                            dispatchDeferred.resolve([campaignId]);
                            dispatchDeferred = defer();

                            setTimeout(done);
                        });

                        it('should dismiss the alert', function() {
                            expect(dismiss).toHaveBeenCalledWith();
                        });

                        it('should go to the dashboard', function() {
                            expect(dispatch).toHaveBeenCalledWith(replace('/dashboard'));
                        });

                        it('should show a success message', function() {
                            expect(notificationActions.notify).toHaveBeenCalledWith({
                                type: NOTIFICATION_TYPE.SUCCESS,
                                message: 'Your app has been deleted.'
                            });
                            expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                        });

                        it('should fulfill the promise', function() {
                            expect(success).toHaveBeenCalledWith(undefined);
                        });
                    });

                    describe('if canceling fails', function() {
                        let reason;

                        beforeEach(function(done) {
                            reason = new Error('Something bad happened.');

                            dispatchDeferred.reject(reason);
                            dispatchDeferred = defer();

                            setTimeout(done);
                        });

                        it('should not dismiss the alert', function() {
                            expect(dismiss).not.toHaveBeenCalled();
                        });

                        it('should show a failure message', function() {
                            expect(notificationActions.notify).toHaveBeenCalledWith({
                                type: NOTIFICATION_TYPE.DANGER,
                                message: `Failed to delete: ${reason.message}`,
                                time: 10000
                            });
                            expect(dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                        });

                        it('should not redirect', function() {
                            expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                                type: replace('/foo').type
                            }));
                        });

                        it('should fulfill the Promise', function() {
                            expect(success).toHaveBeenCalledWith(undefined);
                        });
                    });
                });
            });
        });
    });
});
