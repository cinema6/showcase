import { createUuid } from 'rc-uuid';
import {
    showAlert
} from '../../src/actions/alert';
import {
    cancel as cancelCampaign
} from '../../src/actions/campaign';
import defer from 'promise-defer';
import { replace } from 'react-router-redux';
import { notify } from '../../src/actions/notification';
import { TYPE as NOTIFICATION_TYPE } from '../../src/enums/notification';
import {
    SHOW_INSTALL_TRACKING_INSTRUCTIONS
} from '../../src/actions/campaign_detail';

const proxyquire = require('proxyquire');

describe('campaign-detail-actions',function(){
    let lib;
    let dispatch;
    let callAPI, alertActions, campaignActions, notificationActions;

    beforeEach(function(){
        callAPI = jasmine.createSpy('callAPI()');

        alertActions = {
            showAlert: jasmine.createSpy('showAlert').and.callFake(showAlert),

            __esModule: true
        };

        campaignActions = {
            cancel: jasmine.createSpy('cancel()').and.callFake(cancelCampaign),

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
            './notification': notificationActions
        });

        dispatch = jasmine.createSpy('dispatch()').and.returnValue(new Promise(() => {}));
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
        let thunk;
        beforeEach(function(){
            thunk = lib.loadPageData('abc');
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        it('should create an action with a promise in the payload',function(){
            thunk(dispatch);
            expect(dispatch).toHaveBeenCalledWith({
                type : 'CAMPAIGN_DETAIL/LOAD_PAGE_DATA',
                payload : jasmine.any(Promise)
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
