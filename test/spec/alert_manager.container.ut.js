import React from 'react';
import {
    renderIntoDocument,
    findRenderedComponentWithType,
    scryRenderedComponentsWithType
} from 'react-addons-test-utils';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Alert from '../../src/components/Alert';
import { createUuid } from 'rc-uuid';
import { assign } from 'lodash';
import {
    dismissAlert,
    submit
} from '../../src/actions/alert';

const proxyquire = require('proxyquire');

describe('AlertManager', function() {
    beforeEach(function() {
        this.alertActions = {
            dismissAlert: jasmine.createSpy('dismissAlert()').and.callFake(dismissAlert),
            submit: jasmine.createSpy('submit()').and.callFake(submit),

            __esModule: true
        };

        this.AlertManager = proxyquire('../../src/containers/AlertManager', {
            '../components/Alert': {
                default: Alert,

                __esModule: true
            },

            '../actions/alert': this.alertActions
        }).default;

        this.state = {
            alert: {
                alerts: []
            }
        };
        this.store = createStore(() => this.state);

        spyOn(this.store, 'dispatch').and.callThrough();

        this.props = {

        };

        const AlertManager = this.AlertManager;
        this.component = findRenderedComponentWithType(renderIntoDocument(
            <Provider store={this.store}>
                <AlertManager {...this.props} />
            </Provider>
        ), this.AlertManager.WrappedComponent);
    });

    it('should exist', function() {
        expect(this.component).toEqual(jasmine.any(Object));
    });

    it('should map the state to some props', function() {
        expect(this.component.props).toEqual(jasmine.objectContaining({
            alerts: this.state.alert.alerts
        }));
    });

    it('should not render any Alerts', function() {
        expect(scryRenderedComponentsWithType(this.component, Alert).length).toBeLessThan(1, 'An Alert was rendered.');
    });

    describe('when there are alerts', function() {
        beforeEach(function() {
            this.state = assign({}, this.state, {
                alert: assign({}, this.state.alert, {
                    alerts: [
                        {
                            id: createUuid(),
                            title: 'Hello!',
                            description: 'Is it me you\'re looking for?',
                            buttons: [
                                {
                                    id: createUuid(),
                                    type: 'warning',
                                    text: 'Go Away!',
                                    onSelect: jasmine.createSpy('onSelect()'),
                                    submitting: false
                                },
                                {
                                    id: createUuid(),
                                    type: undefined,
                                    text: 'I Dunno!',
                                    onSelect: jasmine.createSpy('onSelect()'),
                                    submitting: false
                                }
                            ]
                        },
                        {
                            id: createUuid(),
                            title: 'Another One',
                            description: 'Is it me you\'re looking for?',
                            buttons: [
                                {
                                    id: createUuid(),
                                    type: 'warning',
                                    text: 'Go Away!',
                                    onSelect: jasmine.createSpy('onSelect()'),
                                    submitting: false
                                },
                                {
                                    id: createUuid(),
                                    type: undefined,
                                    text: 'I Dunno!',
                                    onSelect: jasmine.createSpy('onSelect()'),
                                    submitting: false
                                }
                            ]
                        }
                    ]
                })
            });

            this.store.dispatch({ type: 'foo' });
        });

        describe('the alert', function() {
            beforeEach(function() {
                this.alert = findRenderedComponentWithType(this.component, Alert);
            });

            it('should render the most recent alert', function() {
                expect(this.alert.props.alert).toEqual(this.state.alert.alerts[1]);
            });

            describe('when dismissed', function() {
                beforeEach(function() {
                    this.store.dispatch.and.callFake(({ payload }) => Promise.resolve(payload));

                    this.alert.props.onDismiss();
                });

                it('should dismiss the alert', function() {
                    expect(this.alertActions.dismissAlert).toHaveBeenCalledWith(this.alert.props.alert.id);
                    expect(this.store.dispatch).toHaveBeenCalledWith(this.alertActions.dismissAlert.calls.mostRecent().returnValue);
                });
            });

            describe('when a button is selected', function() {
                beforeEach(function() {
                    this.store.dispatch.and.callFake(({ payload }) => Promise.resolve(payload));

                    this.alert.props.onSelect({ alert: this.state.alert.alerts[0].id, button: this.state.alert.alerts[0].buttons[1].id });
                });

                it('should dispatch submit()', function() {
                    expect(this.alertActions.submit).toHaveBeenCalledWith({ alert: this.state.alert.alerts[0].id, button: this.state.alert.alerts[0].buttons[1].id });
                    expect(this.store.dispatch).toHaveBeenCalledWith(this.alertActions.submit.calls.mostRecent().returnValue);
                });
            });
        });
    });
});
