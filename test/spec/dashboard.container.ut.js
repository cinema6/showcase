'use strict';

import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import Dashboard from '../../src/containers/Dashboard';
import { createStore } from 'redux';
import { logoutUser, toggleNav, checkIfPaymentMethodRequired } from '../../src/actions/dashboard';
import { Provider } from 'react-redux';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import { cloneDeep as clone } from 'lodash';

const proxyquire = require('proxyquire');

describe('Dashboard', function() {
    let dashboardActions;
    let Dashboard;

    beforeEach(function() {
        dashboardActions = {
            logoutUser: jasmine.createSpy('logoutUser()').and.callFake(logoutUser),
            toggleNav: jasmine.createSpy('toggleNav()').and.callFake(toggleNav),
            checkIfPaymentMethodRequired,

            __esModule: true
        };

        Dashboard = proxyquire('../../src/containers/Dashboard', {
            'react': React,

            '../../actions/dashboard': dashboardActions
        }).default;
    });

    describe('when rendered', function() {
        let user;
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            user = {
                id: createUuid(),
                firstName: 'Your',
                lastName: 'Mom'
            };

            state = {
                db: {
                    user: {
                        [user.id]: user
                    }
                },
                session: {
                    user: user.id
                },
                page: {
                    dashboard: {
                        showNav: false
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

        it('should pass in the user', function() {
            expect(component.props).toEqual(jasmine.objectContaining({
                user: user
            }));
        });

        it('should dispatch checkIfPaymentMethodRequired()', function() {
            expect(store.dispatch).toHaveBeenCalledWith(checkIfPaymentMethodRequired());
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
