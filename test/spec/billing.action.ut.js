import {
    GET_PAYMENTS,
    GET_PAYMENT_METHODS,
    LOAD_PAGE_DATA,
    SHOW_CHANGE_MODAL,
    CHANGE_PAYMENT_METHOD,
    SHOW_PLAN_MODAL,
    CHANGE_PAYMENT_PLAN,
    CANCEL_SUBSCRIPTION,
    SET_POST_PLAN_CHANGE_REDIRECT,

    changePaymentPlan,
    cancelSubscription,
    setPostPlanChangeRedirect
} from '../../src/actions/billing';
import orgs, {
    changePaymentPlan as changeOrgPaymentPlan
} from '../../src/actions/org';
import { createAction } from 'redux-actions';
import { assign, find, cloneDeep as clone } from 'lodash';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import { getThunk, createThunk } from '../../src/middleware/fsa_thunk';
import { getBillingPeriod, getPaymentPlanStatus } from '../../src/actions/session';
import { getPaymentPlans } from '../../src/actions/system';
import * as stub from '../helpers/stubs';
import { notify } from '../../src/actions/notification';
import * as NOTIFICATION from '../../src/enums/notification';
import moment from 'moment';
import { push } from 'react-router-redux';

const proxyquire = require('proxyquire');

describe('billing actions', function() {
    let actions;
    let getPayments, getPaymentMethods, loadPageData, showChangeModal, changePaymentMethod, showPlanModal;
    let paymentActions;

    beforeEach(function() {
        paymentActions = require('../../src/actions/payment');

        actions = proxyquire('../../src/actions/billing', {
            './payment': paymentActions,
            './session': {
                getBillingPeriod,
                getPaymentPlanStatus,

                __esModule: true
            },
            './system': require('../../src/actions/system')
        });
        getPayments = actions.getPayments;
        getPaymentMethods = actions.getPaymentMethods;
        loadPageData = actions.loadPageData;
        showChangeModal = actions.showChangeModal;
        changePaymentMethod = actions.changePaymentMethod;
        showPlanModal = actions.showPlanModal;
    });

    describe('getPayments()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(getPayments());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                spyOn(paymentActions.default, 'list').and.callThrough();

                dispatch = jasmine.createSpy('dispatch()').and.returnValue(new Promise(() => {}));
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should get a list of payments', function() {
                expect(paymentActions.default.list).toHaveBeenCalledWith();
                expect(dispatch).toHaveBeenCalledWith(paymentActions.default.list.calls.all()[0].returnValue);
            });

            it('should dispatch GET_PAYMENTS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(GET_PAYMENTS)(dispatch.calls.all()[0].returnValue));
            });
        });
    });

    describe('getPaymentMethods()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(getPaymentMethods());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                spyOn(paymentActions.paymentMethod, 'list').and.callThrough();

                dispatch = jasmine.createSpy('dispatch()').and.returnValue(new Promise(() => {}));
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should get a list of payment methods', function() {
                expect(paymentActions.paymentMethod.list).toHaveBeenCalledWith();
                expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.list.calls.all()[0].returnValue);
            });

            it('should dispatch GET_PAYMENT_METHODS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(GET_PAYMENT_METHODS)(dispatch.calls.all()[0].returnValue));
            });
        });
    });

    describe('loadPageData()', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(loadPageData());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                spyOn(paymentActions.paymentMethod, 'list').and.callThrough();
                spyOn(paymentActions.default, 'list').and.callThrough();

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) { return getThunk(action)(dispatch, getState); }

                    return new Promise(() => {});
                });
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should get payments', function() {
                expect(dispatch).toHaveBeenCalledWith(getPayments());
            });

            it('should get payment methods', function() {
                expect(dispatch).toHaveBeenCalledWith(getPaymentMethods());
            });

            it('should getBillingPeriod()', function() {
                expect(dispatch).toHaveBeenCalledWith(getBillingPeriod());
            });

            it('should getPaymentPlanStatus()', function() {
                expect(dispatch).toHaveBeenCalledWith(getPaymentPlanStatus());
            });

            it('should getPaymentPlans()', () => {
                expect(dispatch).toHaveBeenCalledWith(getPaymentPlans());
            });

            it('should dispatch LOAD_PAGE_DATA', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOAD_PAGE_DATA)(jasmine.any(Promise)));
            });
        });
    });

    describe('showChangeModal()', function() {
        it('should dispatch an action', function() {
            expect(showChangeModal(true)).toEqual(createAction(SHOW_CHANGE_MODAL)(true));
            expect(showChangeModal(false)).toEqual(createAction(SHOW_CHANGE_MODAL)(false));
        });
    });

    describe('showPlanModal()', () => {
        it('should dispatch an action', () => {
            expect(showPlanModal(true)).toEqual(createAction(SHOW_PLAN_MODAL)(true));
            expect(showPlanModal(false)).toEqual(createAction(SHOW_PLAN_MODAL)(false));
        });
    });

    describe('setPostPlanChangeRedirect()', () => {
        it('should return an action', () => {
            const path = '/dashboard/campaigns';

            expect(setPostPlanChangeRedirect(path)).toEqual(createAction(SET_POST_PLAN_CHANGE_REDIRECT)(path));
        });
    });

    describe('changePaymentMethod(newMethod)', function() {
        let newMethod;
        let thunk;

        beforeEach(function() {
            newMethod = {
                cardholderName: 'Foo',
                nonce: createUuid()
            };

            thunk = getThunk(changePaymentMethod(newMethod));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferred, actionDeferred, state;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                state = {
                    db: {
                        paymentMethod: Array.apply([], new Array(4)).reduce(result => {
                            const method = {
                                token: createUuid(),
                                default: false,
                                last4: '2034',
                                type: 'creditCard'
                            };

                            result[method.token] = method;

                            return result;
                        }, {})
                    }
                };
                state.db.paymentMethod[Object.keys(state.db.paymentMethod)[2]].default = true;

                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => {
                    if (action.type === createThunk()().type) {
                        return (dispatchDeferred = defer()).promise;
                    } else {
                        return (actionDeferred = defer()).promise;
                    }
                });
                getState = jasmine.createSpy('getState()').and.returnValue(state);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(paymentActions.paymentMethod, 'create').and.callThrough();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should create a new paymentMethod', function() {
                expect(paymentActions.paymentMethod.create).toHaveBeenCalledWith({ data: { cardholderName: newMethod.cardholderName, paymentMethodNonce: newMethod.nonce, makeDefault: true } });
                expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.create.calls.mostRecent().returnValue);
            });

            it('should dispatch CHANGE_PAYMENT_METHOD', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_PAYMENT_METHOD)(jasmine.any(Promise)));
            });

            describe('if creating the payment method fails', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('403 - Forbidden');
                    reason.response = 'Something went really wrong.';

                    actionDeferred.reject({ reason, action: dispatch.calls.all()[0].args[0] });
                    setTimeout(done);
                });

                it('should reject with a plain error for the message', function() {
                    expect(failure).toHaveBeenCalledWith(new Error(reason.response));
                });
            });

            describe('when the new paymentMethod has been created', function() {
                let oldMethod, token, method;

                beforeEach(function(done) {
                    oldMethod = find(state.db.paymentMethod, { default: true });

                    token = createUuid();
                    method = assign({}, newMethod, {
                        token
                    });
                    state.db.paymentMethod[token] = method;

                    spyOn(paymentActions.paymentMethod, 'remove').and.callThrough();

                    dispatchDeferred.resolve(newMethod);
                    setTimeout(done);

                    dispatch.calls.reset();
                    dispatch.and.returnValue((dispatchDeferred = defer()).promise);
                });

                it('should remove the old paymentMethod', function() {
                    expect(paymentActions.paymentMethod.remove).toHaveBeenCalledWith({ id: oldMethod.token });
                    expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.remove.calls.mostRecent().returnValue);
                });

                describe('when the old payment method has been removed', function() {
                    beforeEach(function(done) {
                        spyOn(paymentActions.paymentMethod, 'list').and.callThrough();

                        dispatchDeferred.resolve([oldMethod.token]);
                        setTimeout(done);

                        dispatch.calls.reset();
                        dispatch.and.returnValue((dispatchDeferred = defer()).promise);
                    });

                    it('should get all of the payment methods', function() {
                        expect(paymentActions.paymentMethod.list).toHaveBeenCalledWith();
                        expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.list.calls.mostRecent().returnValue);
                    });

                    describe('when the list has been fetched', function() {
                        beforeEach(function(done) {
                            dispatchDeferred.resolve(Object.keys(state.db.paymentMethod));
                            setTimeout(done);

                            dispatch.calls.reset();
                            dispatch.and.returnValue((dispatchDeferred = defer()).promise);
                        });

                        it('should close the modal', function() {
                            expect(dispatch).toHaveBeenCalledWith(showChangeModal(false));
                        });
                    });
                });
            });

            describe('if the user has no payment methods', () => {
                beforeEach(done => {
                    success.calls.reset();
                    failure.calls.reset();
                    dispatch = stub.dispatch();

                    state.db.paymentMethod = {};

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                describe('when the paymentMethod has been created', () => {
                    let token;
                    let method;

                    beforeEach(done => {
                        token = createUuid();
                        method = assign({}, newMethod, {
                            token
                        });
                        state.db.paymentMethod[token] = method;

                        dispatch.getDeferred(dispatch.calls.first().args[0]).resolve(method);
                        setTimeout(done);

                        dispatch.calls.reset();
                    });

                    afterEach(() => {
                        token = null;
                        method = null;
                    });

                    it('should get all of the payment methods', function() {
                        expect(dispatch).toHaveBeenCalledWith(paymentActions.paymentMethod.list());
                    });

                    describe('when the list has been fetched', () => {
                        beforeEach(done => {
                            dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(Object.keys(state.db.paymentMethod));
                            setTimeout(done);

                            dispatch.calls.reset();
                        });

                        it('should close the modal', function() {
                            expect(dispatch).toHaveBeenCalledWith(showChangeModal(false));
                        });
                    });
                });
            });
        });
    });

    describe('changePaymentPlan(paymentPlanId, redirect)', () => {
        let paymentPlanId;
        let thunk;

        beforeEach(() => {
            paymentPlanId = `pp-${createUuid()}`;
            thunk = getThunk(changePaymentPlan(paymentPlanId));
        });

        afterEach(() => {
            paymentPlanId = null;
            thunk = null;
        });

        it('should return a thunk', () => {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', () => {
            let user;
            let state;
            let dispatch;
            let getState;

            let success;
            let failure;

            beforeEach(done => {
                user = {
                    id: `u-${createUuid()}`,
                    org: `o-${createUuid()}`
                };
                state = {
                    db: {
                        user: {
                            [user.id]: user
                        }
                    },
                    session: {
                        user: user.id
                    }
                };

                dispatch = stub.dispatch();
                getState = jasmine.createSpy('getState()').and.callFake(() => clone(state));

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            afterEach(() => {
                user = null;
                state = null;
                dispatch = null;
                getState = null;

                success = null;
                failure = null;
            });

            it('should dispatch CHANGE_PAYMENT_PLAN', () => {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_PAYMENT_PLAN)(jasmine.any(Promise)));
            });

            it('should change the payment plan of the user\'s org', () => {
                expect(dispatch).toHaveBeenCalledWith(changeOrgPaymentPlan({ paymentPlanId, orgId: user.org }));
            });

            describe('if the payment plan cannot be changed', () => {
                let reason;

                beforeEach(done => {
                    reason = new Error('foo');
                    reason.response = 'I failed hard.';

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
                        message: jasmine.any(String),
                        time: 10000
                    }));
                });

                it('should fulfill the Promise with undefined', () => {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('when the plan has been changed', () => {
                let response;

                beforeEach(done => {
                    response = {
                        paymentPlanId,
                        nextPaymentPlanId: null,
                        effectiveDate: moment().format()
                    };

                    dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(response);
                    setTimeout(done);

                    dispatch.calls.reset();
                });

                afterEach(() => {
                    response = null;
                });

                it('should re-fetch the org', () => {
                    expect(dispatch).toHaveBeenCalledWith(orgs.get({ id: user.org }));
                });

                describe('if the org cannot be changed', () => {
                    let reason;

                    beforeEach(done => {
                        reason = new Error('foo');
                        reason.response = 'I failed...';

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
                            message: jasmine.any(String),
                            time: 10000
                        }));
                    });

                    it('should fulfill the Promise with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });

                describe('when the org has been fetched', () => {
                    beforeEach(done => {
                        dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve([user.org]);
                        setTimeout(done);
                        dispatch.calls.reset();
                    });

                    it('should close the modal', () => {
                        expect(dispatch).toHaveBeenCalledWith(showPlanModal(false));
                    });

                    it('should show a success message', () => {
                        expect(dispatch).toHaveBeenCalledWith(notify({
                            type: NOTIFICATION.TYPE.SUCCESS,
                            message: 'You have successfully upgraded your account!',
                            time: 5000
                        }));
                    });

                    it('should not change URLs', () => {
                        dispatch.calls.all().forEach(call => expect(call.args[0].type).not.toBe(push('foo').type));
                    });

                    it('should fulfill with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });
            });

            describe('if the change will not take effect until a future date', () => {
                let response;

                beforeEach(done => {
                    response = {
                        paymentPlanId: `pp-${createUuid()}`,
                        nextPaymentPlanId: paymentPlanId,
                        effectiveDate: moment().add(2, 'days').utcOffset(0).endOf('day').format()
                    };

                    dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(response);
                    setTimeout(done);

                    dispatch.calls.reset();
                });

                it('should re-fetch the org', () => {
                    expect(dispatch).toHaveBeenCalledWith(orgs.get({ id: user.org }));
                });

                describe('when the org has been fetched', () => {
                    beforeEach(done => {
                        dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve([user.org]);
                        setTimeout(done);
                        dispatch.calls.reset();
                    });

                    it('should close the modal', () => {
                        expect(dispatch).toHaveBeenCalledWith(showPlanModal(false));
                    });

                    it('should show a success message', () => {
                        expect(dispatch).toHaveBeenCalledWith(notify({
                            type: NOTIFICATION.TYPE.SUCCESS,
                            message: `Your changes will take effect at the end of the current billing period: ${moment(response.effectiveDate).format('MMM D')}.`,
                            time: 10000
                        }));
                    });

                    it('should fulfill with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });
            });

            describe('if a redirect is specified', () => {
                let redirect;

                beforeEach(done => {
                    success.calls.reset();
                    failure.calls.reset();
                    dispatch.calls.reset();
                    dispatch.resetDeferreds();

                    redirect = '/dashboard/add-product';

                    getThunk(changePaymentPlan(paymentPlanId, redirect))(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                describe('when the plan has been changed', () => {
                    let response;

                    beforeEach(done => {
                        response = {
                            paymentPlanId,
                            nextPaymentPlanId: null,
                            effectiveDate: moment().format()
                        };

                        dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(response);
                        setTimeout(done);

                        dispatch.calls.reset();
                    });

                    describe('when the org has been fetched', () => {
                        beforeEach(done => {
                            dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve([user.org]);
                            setTimeout(done);
                            dispatch.calls.reset();
                        });

                        it('should close the modal', () => {
                            expect(dispatch).toHaveBeenCalledWith(showPlanModal(false));
                        });

                        it('should show a success message', () => {
                            expect(dispatch).toHaveBeenCalledWith(notify({
                                type: NOTIFICATION.TYPE.SUCCESS,
                                message: jasmine.any(String),
                                time: jasmine.any(Number)
                            }));
                        });

                        it('should navigate to the redirect', () => {
                            expect(dispatch).toHaveBeenCalledWith(push(redirect));
                        });

                        it('should fulfill with undefined', () => {
                            expect(success).toHaveBeenCalledWith(undefined);
                        });
                    });
                });
            });
        });
    });

    describe('cancelSubscription()', () => {
        let thunk;

        beforeEach(() => {
            thunk = getThunk(cancelSubscription());
        });

        afterEach(() => {
            thunk = null;
        });

        it('should return a thunk', () => {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', () => {
            let user;
            let state;
            let dispatch;
            let getState;

            let success;
            let failure;

            beforeEach(done => {
                user = {
                    id: `u-${createUuid()}`,
                    org: `o-${createUuid()}`
                };
                state = {
                    db: {
                        user: {
                            [user.id]: user
                        },
                        paymentPlan: {}
                    },
                    session: {
                        user: user.id
                    },
                    system: {
                        paymentPlans: null
                    }
                };

                dispatch = stub.dispatch();
                getState = jasmine.createSpy('getState()').and.callFake(() => clone(state));

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            afterEach(() => {
                user = null;
                state = null;
                dispatch = null;
                getState = null;

                success = null;
                failure = null;
            });

            it('should dispatch CANCEL_SUBSCRIPTION', () => {
                expect(dispatch).toHaveBeenCalledWith(createAction(CANCEL_SUBSCRIPTION)(jasmine.any(Promise)));
            });

            it('should get all the payment plans', () => {
                expect(dispatch).toHaveBeenCalledWith(getPaymentPlans());
            });

            describe('if the payment plans cannot be fetched', () => {
                let reason;

                beforeEach(done => {
                    reason = new Error('foo');
                    reason.response = 'I failed hard.';

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
                        message: jasmine.any(String),
                        time: 10000
                    }));
                });

                it('should fulfill the Promise with undefined', () => {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('when the plans are fetched', () => {
                let paymentPlans;

                beforeEach(done => {
                    paymentPlans = [
                        {
                            id: 'pp-0Ek9Sn0c02viEQGx',
                            price: 0,
                            viewsPerMonth: 0,
                            name: '--canceled--',
                            maxCampaigns: 0
                        },
                        {
                            id: 'pp-0Ek6Vw0bWnqdlr61',
                            price: 10,
                            viewsPerMonth: 2000,
                            name: 'Baby',
                            maxCampaigns: 1
                        },
                        {
                            id: 'pp-0Ek6V-0bWnuhLfQl',
                            price: 24.99,
                            viewsPerMonth: 4000,
                            name: 'Kid',
                            maxCampaigns: 5
                        },
                        {
                            id: 'pp-0Ek6Ws0bWnxCV-B7',
                            price: 49.99,
                            viewsPerMonth: 10000,
                            name: 'Adult',
                            maxCampaigns: 10
                        }
                    ];

                    assign(state.db.paymentPlan, paymentPlans.reduce((result, plan) => assign(result, {
                        [plan.id]: plan
                    }), {}));

                    dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(paymentPlans);
                    setTimeout(done);

                    dispatch.calls.reset();
                });

                it('should change the payment plan to the canceled one', () => {
                    expect(dispatch).toHaveBeenCalledWith(changeOrgPaymentPlan({ orgId: user.org, paymentPlanId: paymentPlans[0].id }));
                });

                describe('if the payment plan cannot be changed', () => {
                    let reason;

                    beforeEach(done => {
                        reason = new Error('foo');
                        reason.response = 'I failed!';

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
                            message: jasmine.any(String),
                            time: 10000
                        }));
                    });

                    it('should fulfill the Promise with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });

                describe('when the plan has been changed', () => {
                    let response;

                    beforeEach(done => {
                        response = {
                            paymentPlanId: paymentPlans[1].id,
                            nextPaymentPlanId: paymentPlans[0].id,
                            effectiveDate: moment().add(8, 'days').utcOffset(0).endOf('day').format()
                        };

                        dispatch.getDeferred(dispatch.calls.mostRecent().args[0]).resolve(response);
                        setTimeout(done);

                        dispatch.calls.reset();
                    });

                    afterEach(() => {
                        response = null;
                    });

                    it('should show a success message', () => {
                        expect(dispatch).toHaveBeenCalledWith(notify({
                            type: NOTIFICATION.TYPE.SUCCESS,
                            message: `Your subscription will be suspended at the end of current billing period (${moment(response.effectiveDate).format('MMM D')}).`,
                            time: 10000
                        }));
                    });

                    it('should fulfill with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });
            });
        });
    });
});
