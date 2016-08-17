'use strict';

import { mount } from 'enzyme';
import React from 'react';
import Dashboard from '../../src/containers/Dashboard';
import { createStore } from 'redux';
import { logoutUser,
    addApp,
    toggleNav,
    checkIfPaymentMethodRequired,
    loadPageData
} from '../../src/actions/dashboard';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import { get, cloneDeep as clone, compact } from 'lodash';
import moment from 'moment';

const proxyquire = require('proxyquire');

describe('Dashboard', function() {
    let dashboardActions;
    let Dashboard;

    beforeEach(function() {
        dashboardActions = {
            logoutUser: jasmine.createSpy('logoutUser()').and.callFake(logoutUser),
            toggleNav: jasmine.createSpy('toggleNav()').and.callFake(toggleNav),
            addApp: jasmine.createSpy('addApp()').and.callFake(addApp),
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
                    paymentPlan: {
                        [plan.id]: {
                            maxCampaigns: 1
                        }
                    },
                    campaign: {
                        [campaign.id] : {
                            id: campaign.id
                        }
                    }
                },
                session: {
                    user: user.id,
                    billingPeriod: {
                        cycleStart: '2016-06-17T00:00:00.000Z',
                        cycleEnd: '2016-12-14T23:59:59.000Z',
                        totalViews: 800
                    },
                    archive: [],
                    campaigns: [campaign.id],
                    paymentPlanStatus: {
                        paymentPlanId: plan.id
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
                            cycle: {
                                users: 400
                            }
                        }
                    }
                }
            };
            this.user = state.db.user[state.session.user];
            this.billingPeriod = get(state, 'session.billingPeriod');
            this.paymentPlan = get(state, `db.paymentPlan[${get(state, 'session.paymentPlanStatus.paymentPlanId')}]`);
            this.campaigns = state.session.campaigns &&
                state.session.campaigns.map(id => state.db.campaign[id]);
            this.totalAnalytics = state.session.campaigns &&
                state.session.campaigns.concat(state.session.archive);
            this.analytics = this.totalAnalytics &&
                compact(this.totalAnalytics.map(id => state.analytics.results[id]));

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

            expect(component.props()).toEqual(jasmine.objectContaining({
                user: this.user,
                billingPeriod: this.billingPeriod,
                paymentPlan: this.paymentPlan,
                campaigns: this.campaigns,
                analytics: this.analytics
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

        describe('StatsSummaryBar', function() {
            beforeEach(function() {
                this.info = component.find('StatsSummaryBar');
            });

            it('should be passed props', function() {
                const info = this.info;

                expect((info.prop('startDate')).format()).toBe((moment('2016-06-17T00:00:00.000Z')).format());
                expect((info.prop('endDate')).format()).toBe((moment('2016-12-14T23:59:59.000Z')).format());
                expect(info.prop('views')).toBe(400);
                expect(info.prop('viewGoals')).toBe(800);
                expect(info.prop('appsUsed')).toBe(1);
                expect(info.prop('maxApps')).toBe(1);

            });

            describe('before the paymentPlan loads', function() {
                beforeEach(function() {
                    state.db.paymentPlan = {};
                    state.session.paymentPlanStatus = null;
                    store.dispatch({ type: 'foo' });
                });

                it('should not render a StatsSummaryBar', function() {
                    expect(component.find('StatsSummaryBar').length).toBe(0, 'StatsSummaryBar is rendered.');
                });
            });

            describe('before the billingPeriod loads', function() {
                beforeEach(function() {
                    state.session.billingPeriod = null;
                    store.dispatch({ type: 'foo' });
                });

                it('should not render a StatsSummaryBar', function() {
                    expect(component.find('StatsSummaryBar').length).toBe(0, 'StatsSummaryBar is rendered.');
                });
            });

            describe('if a campaign is archived', function() {

                beforeEach(function() {
                    const archivedCamp = {
                        id: createUuid()
                    };
                    state.db.campaign[archivedCamp.id] = archivedCamp;
                    state.session.archive.push(archivedCamp.id);
                    state.analytics.results[archivedCamp.id] = {
                        cycle: {
                            users: 200
                        }
                    };
                    store.dispatch({ type: 'foo' });
                });

                it('should include archived views in the view count', function() {
                    const info = this.info;
                    expect(info.prop('views')).toBe(600);
                });
            });
        });

        describe('Add New App', function() {
            beforeEach(function() {
                this.info = component.find('button.bg-danger');
            });

            it('should call AddApp() when clicked', function() {
                const info = this.info;

                info.simulate('click');
                expect(dashboardActions.addApp).toHaveBeenCalled();

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
