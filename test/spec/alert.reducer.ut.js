import alertReducer from '../../src/reducers/alert';
import {
    SHOW_ALERT,
    DISMISS_ALERT,
    START_SUBMIT,
    STOP_SUBMIT
} from '../../src/actions/alert';
import { assign } from 'lodash';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';

describe('alertReducer()', function() {
    it('should return some initial state', function() {
        expect(alertReducer(undefined, {})).toEqual({
            alerts: []
        });
    });

    describe('handling actions', function() {
        beforeEach(function() {
            this.state = {
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
            };
        });

        describe(SHOW_ALERT, function() {
            beforeEach(function() {
                this.action = createAction(SHOW_ALERT)({
                    id: createUuid(),
                    title: 'Hello',
                    description: 'It\'s a-me!',
                    buttons: [
                        {
                            id: createUuid(),
                            type: 'info',
                            text: 'Okay...',
                            onSelect: jasmine.createSpy('onSelect()'),
                            submitting: false
                        }
                    ]
                });

                this.newState = alertReducer(this.state, this.action);
            });

            it('should add the alert to the array', function() {
                expect(this.newState).toEqual(assign({}, this.state, {
                    alerts: this.state.alerts.concat([this.action.payload])
                }));
            });
        });

        describe(DISMISS_ALERT, function() {
            beforeEach(function() {
                this.state.alerts.push(
                    {
                        id: createUuid(),
                        title: 'What\'s up?',
                        description: 'Cool!',
                        buttons: []
                    },
                    {
                        id: createUuid(),
                        title: 'Cool beans!',
                        description: 'Cool BEANS!',
                        buttons: []
                    }
                );
                this.action = createAction(DISMISS_ALERT)({
                    id: this.state.alerts[1].id
                });

                this.newState = alertReducer(this.state, this.action);
            });

            it('should remove the alert with the given id', function() {
                expect(this.newState).toEqual(assign({}, this.state, {
                    alerts: this.state.alerts.filter(alert => alert.id !== this.action.payload.id)
                }));
            });
        });

        describe(START_SUBMIT, function() {
            beforeEach(function() {
                this.action = createAction(START_SUBMIT)({
                    alert: this.state.alerts[1].id,
                    button: this.state.alerts[1].buttons[1].id
                });

                this.newState = alertReducer(this.state, this.action);
            });

            it('should set the submitting flag of the button to true', function() {
                expect(this.newState).toEqual(assign({}, this.state, {
                    alerts: this.state.alerts.map(alert => assign({}, alert, {
                        buttons: alert.buttons.map(button => assign({}, button, {
                            submitting: this.action.payload.alert === alert.id && this.action.payload.button === button.id
                        }))
                    }))
                }));
            });
        });

        describe(STOP_SUBMIT, function() {
            beforeEach(function() {
                this.state.alerts[0].buttons[0].submitting = true;

                this.action = createAction(STOP_SUBMIT)({
                    alert: this.state.alerts[0].id,
                    button: this.state.alerts[0].buttons[0].id
                });

                this.newState = alertReducer(this.state, this.action);
            });

            it('should set the submitting flag of the button to false', function() {
                expect(this.newState).toEqual(assign({}, this.state, {
                    alerts: this.state.alerts.map(alert => assign({}, alert, {
                        buttons: alert.buttons.map(button => assign({}, button, {
                            submitting: false
                        }))
                    }))
                }));
            });
        });
    });
});
