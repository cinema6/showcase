import defer from 'promise-defer';
import {
    logoutUser,
    showNav,
    toggleNav,
    checkIfPaymentMethodRequired,
    loadPageData,
    addApp,
    checkForSlots,
    promptUpgrade
} from '../../src/actions/dashboard';
import {
    getBillingPeriod,
    getPaymentPlan,
    getCampaigns
} from '../../src/actions/session';
import { getCampaignAnalytics } from '../../src/actions/analytics';
import { logoutUser as authLogoutUser } from '../../src/actions/auth';
import { trackLogout as intercomTrackLogout } from '../../src/actions/intercom';
import { createAction } from 'redux-actions';
import { showPlanModal } from '../../src/actions/billing';
import {
    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    SHOW_NAV,
    TOGGLE_NAV,
    CHECK_IF_PAYMENT_METHOD_REQUIRED,
    LOAD_PAGE_DATA
} from '../../src/actions/dashboard';
import { replace, push } from 'react-router-redux';
import { getThunk } from '../../src/middleware/fsa_thunk';
import { dispatch } from '../helpers/stubs';
import { paymentMethod } from '../../src/actions/payment';
import { getOrg } from '../../src/actions/session';
import { createUuid } from 'rc-uuid';
import { assign, pick } from 'lodash';
import { showAlert } from '../../src/actions/alert';
import { addNotification } from '../../src/actions/notification';
import moment from 'moment';
import { TYPE as NOTIFICATION } from '../../src/enums/notification';
import React from 'react';
import { Link } from 'react-router';

describe('dashboard actions', function() {
    describe('logoutUser()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(logoutUser());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            let dispatch, getState;
            let dispatchDeferred;
            let success, failure;

            beforeEach(function(done) {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should dispatch LOGOUT_START', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_START)());
            });

            it('should logout the user', function() {
                expect(dispatch).toHaveBeenCalledWith(authLogoutUser());
            });

            describe('when logging out succeeds', function() {
                beforeEach(function(done) {
                    dispatch.calls.reset();
                    dispatch.and.returnValue(Promise.resolve(undefined));

                    dispatchDeferred.resolve(null);
                    setTimeout(done);
                });

                it('should dispatch LOGOUT_SUCCESS', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_SUCCESS)(null));
                });

                it('should redirect to the homepage', function() {
                    expect(dispatch).toHaveBeenCalledWith(replace('/login'));
                });

                it('should dispath intercomTrackLogout', function() {
                    expect(dispatch).toHaveBeenCalledWith(intercomTrackLogout());
                });

                it('should fulfill to undefined', function() {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('when logging out fails', function() {
                let reason;

                beforeEach(function(done) {
                    dispatch.calls.reset();
                    dispatch.and.returnValue(Promise.resolve(undefined));

                    reason = new Error('Something went wrong.');
                    dispatchDeferred.reject(reason);

                    setTimeout(done);
                });

                it('should dispatch LOGOUT_FAILURE', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_FAILURE)(reason));
                });

                it('should reject the promise', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });
        });
    });

    describe('showNav(show)', function() {
        let result;

        beforeEach(function() {
            result = showNav(true);
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(SHOW_NAV)(true));
        });
    });

    describe('toggleNav()', function() {
        let result;

        beforeEach(function() {
            result = toggleNav();
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(TOGGLE_NAV)());
        });
    });

    describe('checkIfPaymentMethodRequired()', function() {
        beforeEach(function() {
            this.thunk = getThunk(checkIfPaymentMethodRequired());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.state = {
                    db: {
                        org: {},
                        paymentMethod: {}
                    }
                };
                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.callFake(() => this.state);

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should dispatch() CHECK_IF_PAYMENT_METHOD_REQUIRED', function() {
                expect(this.dispatch).toHaveBeenCalledWith({
                    type: CHECK_IF_PAYMENT_METHOD_REQUIRED,
                    payload: jasmine.any(Promise)
                });
            });

            it('should get all the payment methods', function() {
                expect(this.dispatch).toHaveBeenCalledWith(paymentMethod.list());
            });

            describe('if the payment methods cannot be fetched', function() {
                beforeEach(function(done) {
                    this.reason = new Error('I failed to fetch the stuff you wanted.');
                    this.dispatch.getDeferred(paymentMethod.list()).reject(this.reason);
                    setTimeout(done);
                });

                it('should reject the promise', function() {
                    expect(this.failure).toHaveBeenCalledWith(this.reason);
                });
            });

            describe('if the user has a payment method', function() {
                beforeEach(function(done) {
                    this.paymentMethod = {
                        token: createUuid(),
                        last4: '5780'
                    };
                    this.state = assign({}, this.state, {
                        db: assign({}, this.state.db, {
                            paymentMethod: assign({}, this.state.db.paymentMethod, {
                                [this.paymentMethod.token]: this.paymentMethod
                            })
                        })
                    });
                    this.dispatch.getDeferred(paymentMethod.list()).resolve([this.paymentMethod.token]);
                    setTimeout(done);
                });

                it('should not get the user\'s org', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(getOrg());
                });

                it('should fulfill the promise', function() {
                    expect(this.success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('if the user has no payment method', function() {
                beforeEach(function(done) {
                    this.dispatch.getDeferred(paymentMethod.list()).resolve([]);
                    setTimeout(done);
                });

                it('should get the org', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(getOrg());
                });

                describe('if the org cannot be fetched', function() {
                    beforeEach(function(done) {
                        this.reason = new Error('I failed to fetch the thing you wanted.');
                        this.dispatch.getDeferred(getOrg()).reject(this.reason);
                        setTimeout(done);
                    });

                    it('should reject the promise', function() {
                        expect(this.failure).toHaveBeenCalledWith(this.reason);
                    });
                });

                describe('if the org', function() {
                    beforeEach(function() {
                        this.org = {
                            id: `o-${createUuid()}`
                        };
                        this.state = assign({}, this.state, {
                            db: assign({}, this.state.db, {
                                org: assign({}, this.state.db.org, {
                                    [this.org.id]: this.org
                                })
                            })
                        });
                    });

                    describe('has no paymentPlanStart', function() {
                        beforeEach(function(done) {
                            delete this.org.paymentPlanStart;

                            this.dispatch.getDeferred(getOrg()).resolve([this.org]);
                            setTimeout(done);
                        });

                        it('should not show a notification', function() {
                            expect(this.dispatch).not.toHaveBeenCalledWith(addNotification(jasmine.any(Object)));
                        });

                        it('should fulfill with undefined', function() {
                            expect(this.success).toHaveBeenCalledWith(undefined);
                        });
                    });

                    describe('has a paymentPlanStart in the future', function() {
                        beforeEach(function(done) {
                            this.org.paymentPlanStart = moment().add(5, 'days').format();

                            this.dispatch.getDeferred(getOrg()).resolve([this.org]);
                            setTimeout(done);
                        });

                        it('should not show a notification', function() {
                            expect(this.dispatch).not.toHaveBeenCalledWith(addNotification(jasmine.any(Object)));
                        });

                        it('should fulfill with undefined', function() {
                            expect(this.success).toHaveBeenCalledWith(undefined);
                        });
                    });

                    describe('has a paymentPlanStart in the past', function() {
                        beforeEach(function(done) {
                            this.org.paymentPlanStart = moment().subtract(5, 'days').format();

                            this.dispatch.getDeferred(getOrg()).resolve([this.org]);
                            setTimeout(done);
                        });

                        it('should show a notification', function() {
                            expect(this.dispatch).toHaveBeenCalledWith(jasmine.objectContaining(pick(addNotification({
                                type: NOTIFICATION.WARNING,
                                message: <span>Your trial period has expired. Please <Link to="/dashboard/billing">add a payment method</Link> to continue your service.</span>
                            }), ['type', 'message'])));
                        });

                        it('should fulfill with undefined', function() {
                            expect(this.success).toHaveBeenCalledWith(undefined);
                        });
                    });
                });
            });
        });
    });

    describe('loadPageData()', function() {

        beforeEach(function() {
            this.thunk = getThunk(loadPageData());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.dispatch = dispatch();
                this.thunk(this.dispatch).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should getBillingPeriod()', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getBillingPeriod());
            });

            it('should getPaymentPlan()', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getPaymentPlan());
            });

            it('should dispatch LOAD_PAGE_DATA', function() {
                expect(this.dispatch).toHaveBeenCalledWith(createAction(LOAD_PAGE_DATA)(jasmine.any(Promise)));
            });

            it('should getCampaigns()', function(){
                expect(this.dispatch).toHaveBeenCalledWith(getCampaigns());
            });

            describe('when the campaigns are fetched', function() {
                beforeEach(function(done) {
                    this.campaigns = Array.apply([], new Array(5)).map(() => ({
                        id: `cam-${createUuid()}`
                    }));

                    this.dispatch.getDeferred(getCampaigns()).resolve(this.campaigns);
                    setTimeout(done);

                    this.dispatch.calls.reset();
                });

                it('should getCampaignAnalytics()', function() {
                    this.campaigns.forEach(campaign => expect(this.dispatch).toHaveBeenCalledWith(getCampaignAnalytics(campaign.id)));
                });
            });
        });
    });
    describe('addApp()', function() {

        beforeEach(function() {
            this.thunk = getThunk(addApp());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.callFake(() => this.state);
                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);

                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');
                setTimeout(done);
            });

            it('should dispatch checkForSlots()', function(){
                expect(this.dispatch).toHaveBeenCalledWith(checkForSlots());
            });

            describe('if no more free apps are available', function(){
                beforeEach(function(done) {
                    this.dispatch.getDeferred(checkForSlots()).resolve(false);
                    setTimeout(done);
                });
                it('should dispatch promptUpgrade()', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(promptUpgrade());
                });

                it('shouldn\'t dispatch a push to /dashboard/add-product', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(push('/dashboard/add-product'));
                });
            });
            describe('if free apps are available', function(){
                beforeEach(function(done) {
                    this.dispatch.calls.reset();
                    this.dispatch.getDeferred(checkForSlots()).resolve(true);
                    setTimeout(done);
                });

                it('should dispatch a push to /dashboard/add-product', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(push('/dashboard/add-product'));
                });
            });
        });
    });
    describe('checkForSlots()', function() {

        beforeEach(function() {
            this.thunk = getThunk(checkForSlots());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.planId = createUuid();
                this.state = {
                    db: {
                        paymentPlan: {
                            [this.planId]: {
                                maxCampaigns: 1
                            }
                        }
                    }
                };

                this.dispatch = dispatch();

                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.getState = jasmine.createSpy('getState()').and.callFake(() => this.state);
                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should getPaymentPlan()', function(){
                expect(this.dispatch).toHaveBeenCalledWith(getPaymentPlan());
            });
            describe('once getPaymentPlan() resolves', () => {
                beforeEach(function(done) {
                    this.dispatch.getDeferred(getPaymentPlan()).resolve(this.planId);
                    setTimeout(done);
                });
                it('should getCampaigns()', function(){
                    expect(this.dispatch).toHaveBeenCalledWith(getCampaigns());
                });
                describe('once getCampaigns() resolves', function(){
                    beforeEach(function() {
                        let campaignId = createUuid();
                        this.campaigns = [campaignId];
                        this.paymentPlan = this.state.db.paymentPlan[this.planId];

                        this.appsAvailable = jasmine.createSpy().and.callFake( () => {
                            if (this.campaigns.length >= this.paymentPlan.maxCampaigns) {
                                return false;
                            }
                            return true;
                        });
                    });

                    describe('if no more free apps are available', function(){
                        beforeEach(function(done) {
                            this.dispatch.getDeferred(getCampaigns()).resolve(this.campaigns);
                            setTimeout(done);
                        });
                        it('should return false', () => {
                            expect(this.appsAvailable).toBeFalsy();
                        });
                    });
                    describe('if free apps are available', function(){
                        beforeEach(function(done) {
                            this.dispatch.calls.reset();
                            this.campaigns.pop();
                            this.dispatch.getDeferred(getCampaigns()).resolve(this.campaigns);

                            setTimeout(done);
                        });
                        it('should return true', function() {
                            expect(this.appsAvailable).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    describe('promptUpgrade()', function() {
        beforeEach(function() {
            this.thunk = getThunk(promptUpgrade());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.dispatch = dispatch();

                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.getState = jasmine.createSpy('getState()').and.callFake(() => this.state);
                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should showAlert()', function() {
                expect(this.dispatch).toHaveBeenCalledWith((function() {
                    const action = showAlert({
                        title: jasmine.any(String),
                        description: jasmine.any(String),
                        buttons: [
                            {
                                text: jasmine.any(String),
                                onSelect: jasmine.any(Function)
                            },
                            {
                                text: jasmine.any(String),
                                type: jasmine.any(String),
                                onSelect: jasmine.any(Function)

                            }
                        ]
                    });
                    action.payload.id = jasmine.any(String);
                    action.payload.buttons.forEach(button => button.id = jasmine.any(String));

                    return action;
                })());
            });
            describe('when the user chooses', function() {
                let dismiss;
                let upgrade, noUpgrade;
                let success, failure;

                beforeEach(function() {
                    dismiss = jasmine.createSpy('dismiss()').and.returnValue(Promise.resolve());
                    noUpgrade = this.dispatch.calls.mostRecent().args[0].payload.buttons[0];
                    upgrade = this.dispatch.calls.mostRecent().args[0].payload.buttons[1];

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');
                });

                describe('not to upgrade', function() {
                    beforeEach(function(done) {
                        noUpgrade.onSelect(dismiss).then(success, failure);
                        setTimeout(done);
                    });

                    it('should dismiss the alert', function() {
                        expect(dismiss).toHaveBeenCalled();
                    });
                });
                describe('to upgrade', function() {
                    beforeEach(function(done) {
                        upgrade.onSelect(dismiss).then(success, failure);
                        setTimeout(done);
                    });

                    it('should push to dashboard/billing', function() {
                        expect(this.dispatch).toHaveBeenCalledWith(push('/dashboard/billing'));
                    });
                    it('should dismiss the alert', function() {
                        expect(dismiss).toHaveBeenCalled();
                    });
                    it('should dispatch planModal', function() {
                        expect(this.dispatch).toHaveBeenCalledWith(showPlanModal(true));
                    });
                });
            });
        });
    });

});
