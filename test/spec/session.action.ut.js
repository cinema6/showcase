'use strict';

import campaign from '../../src/actions/campaign';
import defer from 'promise-defer';
import {
    GET_CAMPAIGNS,
    GET_ORG,
    GET_PROMOTIONS,
    GET_BILLING_PERIOD
} from '../../src/actions/session';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { getThunk, createThunk } from '../../src/middleware/fsa_thunk';
import { getCampaigns, getOrg, getPromotions, getBillingPeriod } from '../../src/actions/session';
import { dispatch } from '../helpers/stubs';
import org from '../../src/actions/org';
import promotion from '../../src/actions/promotion';
import { assign } from 'lodash';
import moment from 'moment';

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

                    this.dispatch.getDeferred(promotion.get({ id: this.user.promotion })).resolve([this.promotion.id]);
                    setTimeout(done);
                });

                it('should fulfill with the promotion ids', function() {
                    expect(this.success).toHaveBeenCalledWith([this.promotion.id]);
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
                    expect(this.success).toHaveBeenCalledWith(this.state.session.promotions);
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

                it('should fulfill with the org\'s id', function() {
                    expect(this.success).toHaveBeenCalledWith([this.org.id]);
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
                expect(dispatch).toHaveBeenCalledWith(campaign.list());
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
                    expect(dispatch).not.toHaveBeenCalledWith(campaign.list());
                });

                it('should fulfill with the campaigns', function() {
                    expect(success).toHaveBeenCalledWith(state.session.campaigns);
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

            it('should fetch the org', function() {
                expect(this.dispatch).toHaveBeenCalledWith(getOrg());
            });

            describe('if there is a problem', function() {
                beforeEach(function(done) {
                    this.reason = new Error('I suck.');

                    this.dispatch.getDeferred(this.dispatch.calls.mostRecent().args[0]).reject(this.reason);
                    setTimeout(done);
                });

                it('should reject with the reason', function() {
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
                        this.org.paymentPlanStart = null;

                        this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                        setTimeout(done);
                    });

                    it('should fulfill with null', function() {
                        expect(this.success).toHaveBeenCalledWith(null);
                    });
                });

                describe('has a paymentPlanStart after today', function() {
                    beforeEach(function(done) {
                        this.org.paymentPlanStart = moment().add(3, 'days').format();
                        this.org.nextPaymentDate = this.org.paymentPlanStart;

                        this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                        setTimeout(done);
                    });

                    it('should query for all of the user\'s campaigns', function() {
                        expect(this.dispatch).toHaveBeenCalledWith(campaign.query({
                            org: this.org.id,
                            sort: 'created,1',
                            limit: 1
                        }));
                    });

                    describe('when the campaign is fetched', function() {
                        beforeEach(function(done) {
                            this.campaign = {
                                id: `cam-${createUuid()}`,
                                created: moment(this.org.paymentPlanStart).subtract(14, 'days').format()
                            };
                            this.state = assign({}, this.state, {
                                db: assign({}, this.state.db, {
                                    campaign: assign({}, this.state.db.campaign, {
                                        [this.campaign.id]: this.campaign
                                    })
                                })
                            });

                            this.dispatch.getDeferred(this.dispatch.calls.mostRecent().args[0]).resolve([this.campaign.id]);
                            setTimeout(done);
                        });

                        it('should fulfill with a billingPeriod Object', function() {
                            expect(this.success).toHaveBeenCalledWith({
                                start: this.campaign.created,
                                end: moment(this.org.paymentPlanStart).subtract(1, 'day').format()
                            });
                        });
                    });
                });

                describe('has a paymentPlanStart of today', function() {
                    beforeEach(function(done) {
                        this.org.paymentPlanStart = moment().subtract(45, 'minutes').format();
                        this.org.nextPaymentDate = this.org.paymentPlanStart;

                        this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                        setTimeout(done);
                    });

                    it('should not get any campaigns', function() {
                        expect(this.dispatch).not.toHaveBeenCalledWith(campaign.query(jasmine.any(Object)));
                    });

                    it('should fulfill with a billingPeriod Object', function() {
                        expect(this.success).toHaveBeenCalledWith({
                            start: this.org.paymentPlanStart,
                            end: moment(this.org.paymentPlanStart).add(1, 'month').subtract(1, 'day').format()
                        });
                    });
                });

                describe('has a paymentPlanStart before today', function() {
                    beforeEach(function() {
                        this.org.paymentPlanStart = moment().subtract(3, 'days').format();
                    });

                    describe('and a nextPaymentDate after today', function() {
                        beforeEach(function(done) {
                            this.org.nextPaymentDate = moment(this.org.paymentPlanStart).add(3, 'months').subtract(2, 'days');

                            this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                            setTimeout(done);
                        });

                        it('should not get any campaigns', function() {
                            expect(this.dispatch).not.toHaveBeenCalledWith(campaign.query(jasmine.any(Object)));
                        });

                        it('should fulfill with a billingPeriod Object', function() {
                            expect(this.success).toHaveBeenCalledWith({
                                start: moment(this.org.nextPaymentDate).subtract(1, 'month').format(),
                                end: moment(this.org.nextPaymentDate).subtract(1, 'day').format()
                            });
                        });
                    });

                    describe('and a nextPaymentDate of today', function() {
                        beforeEach(function(done) {
                            this.org.nextPaymentDate = moment().subtract(1, 'hour');

                            this.dispatch.getDeferred(getOrg()).resolve([this.org.id]);
                            setTimeout(done);
                        });

                        it('should not get any campaigns', function() {
                            expect(this.dispatch).not.toHaveBeenCalledWith(campaign.query(jasmine.any(Object)));
                        });

                        it('should fulfill with a billingPeriod Object', function() {
                            expect(this.success).toHaveBeenCalledWith({
                                start: moment(this.org.nextPaymentDate).format(),
                                end: moment(this.org.nextPaymentDate).add(1, 'month').subtract(1, 'day').format()
                            });
                        });
                    });
                });
            });

            describe('if there is already a billingPeriod', function() {
                beforeEach(function(done) {
                    this.state.session.billingPeriod = {
                        start: moment().format(),
                        end: moment().add(1, 'month').subtract(1, 'day')
                    };

                    this.dispatch.calls.reset();

                    this.success.calls.reset();
                    this.failure.calls.reset();

                    getThunk(getBillingPeriod())(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should not get the org', function() {
                    expect(this.dispatch).not.toHaveBeenCalledWith(getOrg());
                });

                it('should fulfill with the billingPeriod', function() {
                    expect(this.success).toHaveBeenCalledWith(this.state.session.billingPeriod);
                });
            });
        });
    });
});
