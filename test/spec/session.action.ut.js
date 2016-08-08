'use strict';

import campaign from '../../src/actions/campaign';
import defer from 'promise-defer';
import {
    GET_CAMPAIGNS,
    GET_ORG,
    GET_PROMOTIONS,
    GET_BILLING_PERIOD,
    GET_PAYMENT_PLAN
} from '../../src/actions/session';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { getThunk, createThunk } from '../../src/middleware/fsa_thunk';
import { getCampaigns, getOrg, getPromotions, getBillingPeriod, getPaymentPlan } from '../../src/actions/session';
import { dispatch } from '../helpers/stubs';
import org from '../../src/actions/org';
import promotion from '../../src/actions/promotion';
import paymentPlan from '../../src/actions/payment_plan';
import { assign, cloneDeep as clone } from 'lodash';
import moment from 'moment';
import { getCurrentPayment } from '../../src/actions/transaction';

describe('session actions', function() {
    describe('getPromotions()', function() {
        beforeEach(function() {
            this.thunk = getThunk(getPromotions());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.user = {
                    id: `u-${createUuid()}`,
                    promotion: `pro-${createUuid()}`
                };
                this.state = {
                    session: {
                        user: this.user.id,
                        promotions: null
                    },
                    db: {
                        user: {
                            [this.user.id]: this.user
                        },
                        promotion: {}
                    }
                };
                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.returnValue(this.state);

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should dispatch GET_PROMOTIONS', function() {
                expect(this.dispatch).toHaveBeenCalledWith(createAction(GET_PROMOTIONS)(jasmine.any(Promise)));
            });

            it('should get the promotion', function() {
                expect(this.dispatch).toHaveBeenCalledWith(promotion.get({ id: this.user.promotion }));
            });

            describe('when the promotion is fetched', function() {
                beforeEach(function(done) {
                    this.promotion = {
                        id: this.user.promotion,
                        type: 'freeTrial',
                        data: {
                            trialLength: 5
                        }
                    };
                    this.state = assign({}, this.state, {
                        db: assign({}, this.state.db, {
                            promotion: assign({}, this.state.db.promotion, {
                                [this.promotion.id]: this.promotion
                            })
                        })
                    });
                    this.getState.and.returnValue(this.state);

                    this.dispatch.getDeferred(promotion.get({ id: this.user.promotion })).resolve([this.promotion]);
                    setTimeout(done);
                });

                it('should fulfill with the promotion', function() {
                    expect(this.success).toHaveBeenCalledWith([this.promotion]);
                });
            });

            describe('if there is a problem fetching the promotions', function() {
                beforeEach(function(done) {
                    this.reason = new Error('Things failed!');
                    this.dispatch.getDeferred(promotion.get({ id: this.user.promotion })).reject(this.reason);
                    setTimeout(done);
                });

                it('should reject with the reason', function() {
                    expect(this.failure).toHaveBeenCalledWith(this.reason);
                });
            });

            describe('if the user has no promotion', function() {
                beforeEach(function(done) {
                    delete this.user.promotion;
                    this.dispatch.calls.reset();

                    this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should dispatch GET_PROMOTIONS', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(createAction(GET_PROMOTIONS)(jasmine.any(Promise)));
                });

                it('should not get any promotions', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(promotion.get(jasmine.any(Object)));
                });

                it('should fulfill with an empty Array', function() {
                    expect(this.success).toHaveBeenCalledWith([]);
                });
            });

            describe('if the promotions are already fetched', function() {
                beforeEach(function(done) {
                    this.promotions = Array.apply([], new Array(3)).map(() => ({
                        id: `pro-${createUuid()}`,
                        type: 'freeTrial',
                        data: {
                            trialLength: 10
                        }
                    }));
                    this.state.session.promotions = this.promotions.map(promotion => promotion.id);
                    this.state.db.promotion = this.promotions.reduce((result, promotion) => {
                        result[promotion.id] = promotion;
                        return result;
                    }, {});
                    this.dispatch.calls.reset();

                    this.success.calls.reset();
                    this.failure.calls.reset();

                    this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should dispatch GET_PROMOTIONS', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(createAction(GET_PROMOTIONS)(jasmine.any(Promise)));
                });

                it('should not get any promotions', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(promotion.get(jasmine.any(Object)));
                });

                it('should fulfill with the promotions', function() {
                    expect(this.success).toHaveBeenCalledWith(this.promotions);
                });
            });
        });
    });

    describe('getOrg()', function() {
        beforeEach(function() {
            this.thunk = getThunk(getOrg());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.user = {
                    id: `u-${createUuid()}`,
                    org: `o-${createUuid()}`
                };
                this.state = {
                    session: {
                        user: this.user.id
                    },
                    db: {
                        user: {
                            [this.user.id]: this.user
                        },
                        org: {}
                    }
                };
                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.returnValue(this.state);

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should dispatch GET_ORG', function() {
                expect(this.dispatch).toHaveBeenCalledWith(createAction(GET_ORG)(jasmine.any(Promise)));
            });

            it('should get the org', function() {
                expect(this.dispatch).toHaveBeenCalledWith(org.get({ id: this.user.org }));
            });

            describe('when the org is fetched', function() {
                beforeEach(function(done) {
                    this.org = {
                        id: this.user.org,
                        user: this.user.id
                    };
                    this.state = assign({}, this.state, {
                        db: assign({}, this.state.db, {
                            org: assign({}, this.state.db.org, {
                                [this.org.id]: this.org
                            })
                        })
                    });
                    this.getState.and.returnValue(this.state);

                    this.dispatch.getDeferred(org.get({ id: this.org.id })).resolve([this.org.id]);
                    setTimeout(done);
                });

                it('should fulfill with the org\'s id', function() {
                    expect(this.success).toHaveBeenCalledWith([this.org.id]);
                });
            });

            describe('if there is a problem fetching the org', function() {
                beforeEach(function(done) {
                    this.reason = new Error('I failed!');
                    this.dispatch.getDeferred(org.get({ id: this.user.org })).reject(this.reason);
                    setTimeout(done);
                });

                it('should reject with the reason', function() {
                    expect(this.failure).toHaveBeenCalledWith(this.reason);
                });
            });

            describe('if the org is already cached', function() {
                beforeEach(function(done) {
                    this.org = {
                        id: this.user.org,
                        user: this.user.id
                    };
                    this.state.db.org[this.org.id] = this.org;
                    this.dispatch.calls.reset();

                    this.success.calls.reset();
                    this.failure.calls.reset();

                    this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should dispatch GET_ORG', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(createAction(GET_ORG)(jasmine.any(Promise)));
                });

                it('should not get the org', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(org.get({ id: this.user.org }));
                });

                it('should fulfill with the org', function() {
                    expect(this.success).toHaveBeenCalledWith([this.org]);
                });
            });
        });
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
                    },
                    db: {
                        campaign: {}
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
                getState = jasmine.createSpy('getState()').and.callFake(() => clone(state));

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
                expect(dispatch).toHaveBeenCalledWith(campaign.list());
            });

            describe('when the campaigns are fetched', function() {
                let campaigns;

                beforeEach(function(done) {
                    campaigns = Array.apply([], new Array(3)).map(() => ({
                        id: `cam-${createUuid()}`,
                        product: {
                            name: 'Awesome Campaign',
                            id: createUuid()
                        }
                    }));
                    dispatchDeferred.resolve(campaigns);
                    setTimeout(done);
                });

                it('should fulfill with campaigns', function() {
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
                let campaigns;

                beforeEach(function(done) {
                    campaigns = Array.apply([], new Array(3)).map(() => ({
                        id: `cam-${createUuid()}`,
                        product: {
                            name: 'Awesome Campaign',
                            id: createUuid()
                        }
                    }));

                    state.session.campaigns = campaigns.map(campaign => campaign.id);
                    state.db.campaign = campaigns.reduce((cache, campaign) => assign(cache, {
                        [campaign.id]: campaign
                    }), {});

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
                    expect(dispatch).not.toHaveBeenCalledWith(campaign.list());
                });

                it('should fulfill with the campaigns', function() {
                    expect(success).toHaveBeenCalledWith(campaigns);
                });
            });
        });
    });

    describe('getBillingPeriod()', function() {
        beforeEach(function() {
            this.thunk = getThunk(getBillingPeriod());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.state = {
                    session: {
                        billingPeriod: null
                    },
                    db: {
                        org: {}
                    }
                };

                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.callFake(() => this.state);

                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should dispatch GET_BILLING_PERIOD', function() {
                expect(this.dispatch).toHaveBeenCalledWith({
                    type: GET_BILLING_PERIOD,
                    payload: jasmine.any(Promise)
                });
            });

            it('should fetch the current payment', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getCurrentPayment());
            });

            describe('if there is a problem GETting the current payment', function() {
                beforeEach(function(done) {
                    this.reason = new Error('I failed!');
                    this.reason.status = 500;

                    this.dispatch.getDeferred(getCurrentPayment()).reject(this.reason);
                    setTimeout(done);
                });

                it('should reject the Promise', function() {
                    expect(this.failure).toHaveBeenCalledWith(this.reason);
                });
            });

            describe('if the current payment cannot be found', function() {
                beforeEach(function(done) {
                    this.reason = new Error('I failed!');
                    this.reason.status = 404;

                    this.dispatch.getDeferred(getCurrentPayment()).reject(this.reason);
                    setTimeout(done);
                });

                it('should fulfill the Promise with null', function() {
                    expect(this.success).toHaveBeenCalledWith(null);
                });
            });

            describe('when the payment is fetched', function() {
                beforeEach(function(done) {
                    this.response = {
                        cycleStart: moment().utcOffset(0).startOf('day').format(),
                        cycleEnd: moment().utcOffset(0).add(1, 'month').subtract(1, 'day').endOf('day').format()
                    };

                    this.dispatch.getDeferred(getCurrentPayment()).resolve(this.response);
                    setTimeout(done);
                });

                it('should fulfill with the response', function() {
                    expect(this.success).toHaveBeenCalledWith(this.response);
                });
            });

            describe('if there is already a billingPeriod', function() {
                beforeEach(function(done) {
                    this.state.session.billingPeriod = {
                        cycleStart: moment().utcOffset(0).startOf('day').format(),
                        cycleEnd: moment().utcOffset(0).add(1, 'month').subtract(1, 'day').endOf('day').format()
                    };

                    this.dispatch.calls.reset();

                    this.success.calls.reset();
                    this.failure.calls.reset();

                    getThunk(getBillingPeriod())(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should not get the current payment', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(getCurrentPayment());
                });

                it('should fulfill with the billingPeriod', function() {
                    expect(this.success).toHaveBeenCalledWith(this.state.session.billingPeriod);
                });
            });
        });
    });

    describe('getPaymentPlan()', function() {
        beforeEach(function() {
            this.thunk = getThunk(getPaymentPlan());
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.state = {
                    session: {
                        paymentPlan: null
                    },
                    db: {
                        org: {},
                        paymentPlan: {}
                    }
                };

                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.callFake(() => this.state);

                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should dispatch GET_PAYMENT_PLAN', function() {
                expect(this.dispatch).toHaveBeenCalledWith({
                    type: GET_PAYMENT_PLAN,
                    payload: jasmine.any(Promise)
                });
            });

            it('should get the org', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getOrg());
            });

            describe('if there is a problem GETting the org', function() {
                beforeEach(function(done) {
                    this.reason = new Error('Bad news...');
                    this.dispatch.getDeferred(getOrg()).reject(this.reason);
                    setTimeout(done);
                });

                it('should reject the Promise', function() {
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

                describe('has no paymentPlanId', function() {
                    beforeEach(function(done) {
                        this.org.paymentPlanId = null;
                        this.dispatch.getDeferred(getOrg()).resolve([this.org]);
                        setTimeout(done);
                    });

                    it('should fulfill with null', function() {
                        expect(this.success).toHaveBeenCalledWith(null);
                    });
                });

                describe('has a paymentPlanId', function() {
                    beforeEach(function(done) {
                        this.org.paymentPlanId = `pp-${createUuid()}`;
                        this.dispatch.getDeferred(getOrg()).resolve([this.org]);
                        setTimeout(done);
                    });

                    it('should make a request for the paymentPlan', function() {
                        expect(this.dispatch).toHaveBeenCalledWith(paymentPlan.get({ id: this.org.paymentPlanId }));
                    });

                    describe('if the paymentPlan cannot be fetched', function() {
                        beforeEach(function(done) {
                            this.reason = new Error('Something bad happened.');
                            this.dispatch.getDeferred(paymentPlan.get({ id: this.org.paymentPlanId })).reject(this.reason);
                            setTimeout(done);
                        });

                        it('should reject the Promise', function() {
                            expect(this.failure).toHaveBeenCalledWith(this.reason);
                        });
                    });

                    describe('when the paymentPlan is fetched', function() {
                        beforeEach(function(done) {
                            this.paymentPlan = {
                                id: this.org.paymentPlanId,
                                viewsPerMonth: 200
                            };
                            this.state = assign({}, this.state, {
                                db: assign({}, this.state.db, {
                                    paymentPlan: assign({}, this.state.paymentPlan, {
                                        [this.paymentPlan.id]: this.paymentPlan
                                    })
                                })
                            });
                            this.dispatch.getDeferred(paymentPlan.get({ id: this.org.paymentPlanId })).resolve([this.paymentPlan]);
                            setTimeout(done);
                        });

                        it('should fulfill the Promise', function() {
                            expect(this.success).toHaveBeenCalledWith([this.paymentPlan]);
                        });
                    });
                });
            });

            describe('if the paymentPlan has already been fetched', function() {
                beforeEach(function(done) {
                    this.paymentPlan = {
                        id: `pp-${createUuid()}`,
                        viewsPerMonth: 2000
                    };

                    this.state = assign({}, this.state, {
                        session: assign({}, this.state.session, {
                            paymentPlan: this.paymentPlan.id
                        }),
                        db: assign({}, this.state.db, {
                            paymentPlan: assign({}, this.state.paymentPlan, {
                                [this.paymentPlan.id]: this.paymentPlan
                            })
                        })
                    });

                    this.dispatch.calls.reset();

                    this.success.calls.reset();
                    this.failure.calls.reset();

                    getThunk(getPaymentPlan())(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should not get the org', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(getOrg());
                });

                it('should fulfill the Promise', function() {
                    expect(this.success).toHaveBeenCalledWith([this.paymentPlan]);
                });
            });
        });
    });
});
