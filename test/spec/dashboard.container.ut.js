'use strict';

import { mount } from 'enzyme';
import React from 'react';
import Dashboard from '../../src/containers/Dashboard';
import { createStore } from 'redux';
import { logoutUser,
    toggleNav,
    checkIfPaymentMethodRequired,
    loadPageData
} from '../../src/actions/dashboard';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import { compact, get, cloneDeep as clone } from 'lodash';
import moment from 'moment';

const proxyquire = require('proxyquire');

describe('Dashboard', function() {
    let dashboardActions;
    let Dashboard;

    beforeEach(function() {
        dashboardActions = {
            logoutUser: jasmine.createSpy('logoutUser()').and.callFake(logoutUser),
            toggleNav: jasmine.createSpy('toggleNav()').and.callFake(toggleNav),
            checkIfPaymentMethodRequired,
            loadPageData,

            __esModule: true
        };

        Dashboard = proxyquire('../../src/containers/Dashboard', {
            'react': React,
            '../../actions/dashboard': dashboardActions
        }).default;
    });

    describe('when rendered', function() {
        let user, campaign, plan;
        let store, state;
        let props;
        let wrapper, component;

        beforeEach(function() {
            user = {
                id: createUuid(),
                firstName: 'Your',
                lastName: 'Mom'
            };
            plan = {
                id: createUuid()
            };
            campaign = {
                id: createUuid()
            };
            state = {
                db: {
                    user: {
                        [user.id]: user
                    },
                    paymentPlan: plan.id
                },
                session: {
                    user: user.id,
                    billingPeriod: {
                        cycleStart: '2016-06-17T00:00:00.000Z',
                        cycleEnd: '2016-12-14T23:59:59.000Z',
                        totalViews: 800
                    },
                    campaigns: [campaign.id],
                    paymentPlan: {
                        [plan.id]: {
                            maxCampaigns: 1
                        }
                    }
                },
                page: {
                    dashboard: {
                        showNav: false
                    }
                },
                analytics: {
                    results: {
                        [campaign.id]: {
                            summary: {
                                views: 400
                            }
                        }
                    }
                }
            };

            store = createStore(() => clone(state));
            spyOn(store, 'dispatch').and.callThrough();

            props = {
                children: <div />
            };

            wrapper = mount(
                <Dashboard {...props} />,
                {
                    context: { store }
                }
            );
            component = wrapper.find(Dashboard.WrappedComponent.WrappedComponent);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component.length).toEqual(1);
        });

        it('should be a page', function() {
            expect(component.props().page).toEqual(state.page.dashboard);
        });

        it('should pass in the props', function() {
            const user = state.db.user[state.session.user];
            const billingPeriod = get(state, 'session.billingPeriod');
            const paymentPlan = get(state, `db.paymentPlan[${get(state, 'session.paymentPlan')}]`);
            const campaigns = state.session.campaigns &&
                state.session.campaigns.map(id => state.db.campaign[id]);
            const analytics = state.session.campaigns &&
                state.session.campaigns.map(id => state.analytics.results[id]);

            expect(component.props()).toEqual(jasmine.objectContaining({
                user: user,
                billingPeriod: billingPeriod,
                paymentPlan: paymentPlan,
                campaigns: campaigns,
                analytics: analytics
            }));
        });

        it('should dispatch checkIfPaymentMethodRequired()', function() {
            expect(store.dispatch).toHaveBeenCalledWith(checkIfPaymentMethodRequired());
        });
        it('should dispatch loadPageData()', function() {
            expect(store.dispatch).toHaveBeenCalledWith(loadPageData());
        });

        describe('if no user is logged in', function() {
            beforeEach(function() {
                state.session.user = null;
                store.dispatch({ type: 'foo' });
            });

            it('should pass in null', function() {
                expect(component.props()).toEqual(jasmine.objectContaining({
                    user: null
                }));
            });
        });
        describe('before data loads', function() {
            beforeEach(function() {
                state.session.paymentPlan = null;
                state.session.billingPeriod = null;
                state.db.paymentPlan = null;
                state.analytics.results = null;
                state.session.campaigns = null;
                store.dispatch({ type: 'foo' });
            });

            it('should pass in null', function() {
                expect(component.props()).toEqual(jasmine.objectContaining({
                    billingPeriod: null,
                    paymentPlan: null,
                    campaigns: null,
                    analytics: null
                }));
            });
        });
        describe('StatsSummaryBar', function() {
            beforeEach(function() {
                this.info = component.find('StatsSummaryBar');
            });

            it('should be passed props', function() {
                const info = this.info;

                const billingPeriod = get(state, 'session.billingPeriod');
                const paymentPlan = get(state, `db.paymentPlan[${get(state, 'session.paymentPlan')}]`);
                const campaigns = state.session.campaigns &&
                    state.session.campaigns.map(id => state.db.campaign[id]);
                const analytics = state.session.campaigns &&
                    state.session.campaigns.map(id => state.analytics.results[id]);
                let views = 0;
                if (compact(analytics).length > 0) {
                    analytics.forEach(campaign => {
                        views += campaign.summary.views;
                    });
                }

                expect((info.prop('startDate')).format()).toBe((moment(get(billingPeriod, 'cycleStart'))).format());
                expect((info.prop('endDate')).format()).toBe((moment(get(billingPeriod, 'cycleEnd'))).format());
                expect(info.prop('views')).toBe(views);
                expect(info.prop('viewGoals')).toBe(get(billingPeriod, 'totalViews'));
                expect(info.prop('appsUsed')).toBe(get(campaigns, '.length'));
                expect(info.prop('maxApps')).toBe(get(paymentPlan, '.maxCampaigns'));

            });
        });

        describe('dispatch props', function() {
            let dispatchDeferred;

            beforeEach(function() {
                store.dispatch.and.returnValue((dispatchDeferred = defer()).promise);
            });

            describe('logoutUser()', function() {
                let result;

                beforeEach(function() {
                    result = component.props().logoutUser();
                });

                it('should dispatch the logoutUser action', function() {
                    expect(dashboardActions.logoutUser).toHaveBeenCalledWith();
                    expect(store.dispatch).toHaveBeenCalledWith(dashboardActions.logoutUser.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });

            describe('toggleNav()', function() {
                let result;

                beforeEach(function() {
                    result = component.props().toggleNav();
                });

                it('should dispatch the toggleNav action', function() {
                    expect(dashboardActions.toggleNav).toHaveBeenCalledWith();
                    expect(store.dispatch).toHaveBeenCalledWith(dashboardActions.toggleNav.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });
        });
    });
});
