import sessionReducer from '../../src/reducers/session';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS,
    LOGOUT_SUCCESS
} from '../../src/actions/auth';
import payment, { paymentMethod } from '../../src/actions/payment';
import campaign, {
    CANCEL
} from '../../src/actions/campaign';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';
import { createUuid } from 'rc-uuid';
import {
    GET_PROMOTIONS,
    GET_BILLING_PERIOD,
    GET_PAYMENT_PLAN,
    GET_ORG
} from '../../src/actions/session';
import moment from 'moment';
import {
    CHANGE_PAYMENT_PLAN_SUCCESS
} from '../../src/actions/org';

describe('sessionReducer()', function() {
    it('should return some initial state', function() {
        expect(sessionReducer(undefined, 'INIT')).toEqual({
            user: null,
            promotions: null,
            paymentPlan: null,
            org: null,
            campaigns: null,
            payments: [],
            paymentMethods: [],
            billingPeriod: null
        });
    });

    describe('handling actions', function() {
        let state;
        let newState;

        beforeEach(function() {
            state = {
                user: null,

                promotions: null,

                payments: Array.apply([], new Array(5)).map(() => createUuid()),
                paymentMethods: Array.apply([], new Array(3)).map(() => createUuid()),
                campaigns: Array.apply([], new Array(10)).map(() => createUuid()),

                billingPeriod: null,
                paymentPlan: null
            };
        });

        [LOGIN_SUCCESS, STATUS_CHECK_SUCCESS].forEach(ACTION => {
            describe(ACTION, function() {
                let user;

                beforeEach(function() {
                    user = {
                        id: 'u-' + createUuid(),
                        name: 'Johnny Testmonkey',
                        email: 'johnny@bananas.com'
                    };

                    newState = sessionReducer(state, createAction(ACTION)(user));
                });

                it('should add the user to the session', function() {
                    expect(newState).toEqual(assign({}, state, {
                        user: user.id
                    }));
                });
            });
        });

        describe(LOGOUT_SUCCESS, function() {
            beforeEach(function() {
                state.user = 'u-' + createUuid();

                newState = sessionReducer(state, createAction(LOGOUT_SUCCESS)());
            });

            it('should restore the initial state', function() {
                expect(newState).toEqual(sessionReducer(undefined, {}));
            });
        });

        describe(`${GET_PROMOTIONS}_FULFILLED`, function() {
            beforeEach(function() {
                this.promotions = Array.apply([], new Array(3)).map(() => `pro-${createUuid()}`);

                newState = sessionReducer(state, createAction(`${GET_PROMOTIONS}_FULFILLED`)(this.promotions));
            });

            it('should update the promotions', function() {
                expect(newState).toEqual(assign({}, state, {
                    promotions: this.promotions
                }));
            });
        });

        describe(`${GET_BILLING_PERIOD}_FULFILLED`, function() {
            beforeEach(function() {
                this.billingPeriod = {
                    start: moment().format(),
                    end: moment().add(1, 'month').subtract(1, 'day').format()
                };

                newState = sessionReducer(state, createAction(`${GET_BILLING_PERIOD}_FULFILLED`)(this.billingPeriod));
            });

            it('should update the billingPeriod', function() {
                expect(newState).toEqual(assign({}, state, {
                    billingPeriod: this.billingPeriod
                }));
            });
        });

        describe(`${GET_PAYMENT_PLAN}_FULFILLED`, function() {
            beforeEach(function() {
                this.paymentPlanId = `pp-${createUuid()}`;

                newState = sessionReducer(state, createAction(`${GET_PAYMENT_PLAN}_FULFILLED`)([this.paymentPlanId]));
            });

            it('should update the paymentPlan', function() {
                expect(newState).toEqual(assign({}, state, {
                    paymentPlan: this.paymentPlanId
                }));
            });
        });

        describe(CHANGE_PAYMENT_PLAN_SUCCESS, () => {
            let paymentPlanId;

            beforeEach(() => {
                paymentPlanId = `pp-${createUuid()}`;

                newState = sessionReducer(state, createAction(CHANGE_PAYMENT_PLAN_SUCCESS)({ paymentPlanId }));
            });

            afterEach(() => {
                paymentPlanId = null;
            });

            it('should update the paymentPlan with the new paymentPlanId', () => {
                expect(newState).toEqual(assign({}, state, {
                    paymentPlan: paymentPlanId
                }));
            });
        });

        describe(`${GET_ORG}_FULFILLED`, function() {
            beforeEach(function() {
                this.orgId = `o-${createUuid()}`;

                newState = sessionReducer(state, createAction(`${GET_ORG}_FULFILLED`)([this.orgId]));
            });

            it('should add the org to the state', function() {
                expect(newState).toEqual(assign({}, state, {
                    org: this.orgId
                }));
            });
        });

        describe(campaign.list.SUCCESS, function() {
            let campaigns;

            beforeEach(function() {
                campaigns = [`cam-${createUuid()}`];

                newState = sessionReducer(state, createAction(campaign.list.SUCCESS)(campaigns));
            });

            it('should update the campaigns', function() {
                expect(newState).toEqual(assign({}, state, {
                    campaigns
                }));
            });
        });

        describe(campaign.create.SUCCESS, function() {
            let campaigns;

            beforeEach(function() {
                campaigns = [`cam-${createUuid()}`];

                newState = sessionReducer(state, createAction(campaign.create.SUCCESS)(campaigns));
            });

            it('should add the campaign', function() {
                expect(newState).toEqual(assign({}, state, {
                    campaigns: state.campaigns.concat(campaigns)
                }));
            });

            describe('if there are no campaigns', function() {
                beforeEach(function() {
                    state.campaigns = null;

                    newState = sessionReducer(state, createAction(campaign.create.SUCCESS)(campaigns));
                });

                it('should update the campaigns', function() {
                    expect(newState).toEqual(assign({}, state, {
                        campaigns
                    }));
                });
            });
        });

        describe(campaign.remove.SUCCESS, function() {
            let campaigns;

            beforeEach(function() {
                campaigns = [state.campaigns[4]];

                newState = sessionReducer(state, createAction(campaign.remove.SUCCESS)(campaigns));
            });

            it('should remove the campaign', function() {
                expect(newState).toEqual(assign({}, state, {
                    campaigns: state.campaigns.filter(id => campaigns.indexOf(id) < 0)
                }));
            });

            describe('if there are no campaigns in the state', function() {
                beforeEach(function() {
                    state.campaigns = null;

                    newState = sessionReducer(state, createAction(campaign.remove.SUCCESS)(campaigns));
                });

                it('should do nothing', function() {
                    expect(newState).toEqual(state);
                });
            });
        });

        describe(`${CANCEL}_FULFILLED`, function() {
            let campaign;

            beforeEach(function() {
                campaign = state.campaigns[3];

                newState = sessionReducer(state, createAction(`${CANCEL}_FULFILLED`)([campaign]));
            });

            it('should remove the campaign from the session', function() {
                expect(newState).toEqual(assign({}, state, {
                    campaigns: state.campaigns.filter(id => id !== campaign)
                }));
            });

            describe('if there are no campaigns in the session', function() {
                beforeEach(function() {
                    state.campaigns = null;

                    newState = sessionReducer(state, createAction(`${CANCEL}_FULFILLED`)([campaign]));
                });

                it('should do nothing', function() {
                    expect(newState).toEqual(state);
                });
            });
        });

        describe(payment.list.SUCCESS, function() {
            let payments;

            beforeEach(function() {
                payments = Array.apply([], new Array(7)).map(() => createUuid());

                newState = sessionReducer(state, createAction(payment.list.SUCCESS)(payments));
            });

            it('should update the payments', function() {
                expect(newState).toEqual(assign({}, state, {
                    payments
                }));
            });
        });

        describe(payment.create.SUCCESS, function() {
            let payments;

            beforeEach(function() {
                payments = [createUuid()];

                newState = sessionReducer(state, createAction(payment.create.SUCCESS)(payments));
            });

            it('should add the item to the payments', function() {
                expect(newState).toEqual(assign({}, state, {
                    payments: state.payments.concat(payments)
                }));
            });
        });

        describe(payment.remove.SUCCESS, function() {
            let payments;

            beforeEach(function() {
                payments = [state.payments[1]];

                newState = sessionReducer(state, createAction(payment.remove.SUCCESS)(payments));
            });

            it('should remove the items from its list', function() {
                expect(newState).toEqual(assign({}, state, {
                    payments: state.payments.filter(id => id !== payments[0])
                }));
            });
        });

        describe(paymentMethod.list.SUCCESS, function() {
            let paymentMethods;

            beforeEach(function() {
                paymentMethods = Array.apply([], new Array(3)).map(() => createUuid());

                newState = sessionReducer(state, createAction(paymentMethod.list.SUCCESS)(paymentMethods));
            });

            it('should update the paymentMethods', function() {
                expect(newState).toEqual(assign({}, state, {
                    paymentMethods
                }));
            });
        });

        describe(paymentMethod.create.SUCCESS, function() {
            let paymentMethods;

            beforeEach(function() {
                paymentMethods = [createUuid()];

                newState = sessionReducer(state, createAction(paymentMethod.create.SUCCESS)(paymentMethods));
            });

            it('should add the item to the paymentMethods', function() {
                expect(newState).toEqual(assign({}, state, {
                    paymentMethods: state.paymentMethods.concat(paymentMethods)
                }));
            });
        });

        describe(paymentMethod.remove.SUCCESS, function() {
            let paymentMethods;

            beforeEach(function() {
                paymentMethods = [state.paymentMethods[1]];

                newState = sessionReducer(state, createAction(paymentMethod.remove.SUCCESS)(paymentMethods));
            });

            it('should remove the paymentMethod from its list', function() {
                expect(newState).toEqual(assign({}, state, {
                    paymentMethods: state.paymentMethods.filter(id => id !== paymentMethods[0])
                }));
            });
        });
    });
});
