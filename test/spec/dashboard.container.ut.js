'use strict';

import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import Dashboard from '../../src/containers/Dashboard';
import { createStore } from 'redux';
import { logoutUser,
    toggleNav,
    checkIfPaymentMethodRequired,
    loadPageData
} from '../../src/actions/dashboard';
import { Provider } from 'react-redux';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import ld, { cloneDeep as clone } from 'lodash';

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
        let component;

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

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <Dashboard {...props} />
                </Provider>
            ), Dashboard.WrappedComponent.WrappedComponent);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should be a page', function() {
            expect(component.props.page).toEqual(state.page.dashboard);
        });

        it('should pass in the props', function() {
            const startDate = ld.get(state, 'session.billingPeriod.cycleStart');
            const endDate = ld.get(state, 'session.billingPeriod.cycleEnd');
            const views = ld.get(state,
                `analytics.results[${ld.get(state, 'session.campaigns[0]')}].summary.views`, '--');
            const viewGoals = ld.get(state, 'session.billingPeriod.totalViews', '--');
            const appsUsed = ld.get(state, 'session.campaigns.length', '--');
            const maxApps = ld.get(state,
                `db.paymentPlan[${ld.get(state, 'session.paymentPlan')}].maxCampaigns`, '--');
                
            expect(component.props).toEqual(jasmine.objectContaining({
                user: user,
                startDate: startDate,
                endDate: endDate,
                views: views,
                viewGoals: viewGoals,
                appsUsed: appsUsed,
                maxApps: maxApps
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
                expect(component.props).toEqual(jasmine.objectContaining({
                    user: null
                }));
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
                    result = component.props.logoutUser();
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
                    result = component.props.toggleNav();
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
