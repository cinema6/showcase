import {
    SHOW_ALERT,
    DISMISS_ALERT,
    START_SUBMIT,
    STOP_SUBMIT
} from '../../src/actions/alert';
import { createUuid } from 'rc-uuid';
import { assign } from 'lodash';
import defer from 'promise-defer';
import { getThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

describe('alert actions', function() {
    beforeEach(function() {
        this.createUuid = jasmine.createSpy('createUuid()').and.callFake(createUuid);

        this.actions = proxyquire('../../src/actions/alert', {
            'rc-uuid': {
                createUuid: this.createUuid
            }
        });
        this.showAlert = this.actions.showAlert;
        this.dismissAlert = this.actions.dismissAlert;
        this.startSubmit = this.actions.startSubmit;
        this.stopSubmit = this.actions.stopSubmit;
        this.submit = this.actions.submit;
    });

    describe('showAlert({ title, description, buttons })', function() {
        beforeEach(function() {
            this.title = 'My Alert';
            this.description = 'You know how it is.';
            this.buttons = [
                {
                    type: 'success',
                    text: 'Submit',
                    onSelect: jasmine.createSpy('onSelect()')
                },
                {
                    type: 'danger',
                    text: 'Delete',
                    onSelect: jasmine.createSpy('onSelect()')
                }
            ];

            this.result = this.showAlert({ title: this.title, description: this.description, buttons: this.buttons });
        });

        it('should return an FSA', function() {
            expect(this.createUuid).toHaveBeenCalledWith();
            expect(this.createUuid.calls.count()).toBe(3);
            expect(this.result).toEqual({
                type: SHOW_ALERT,
                payload: {
                    id: this.createUuid.calls.first().returnValue,
                    title: this.title,
                    description: this.description,
                    buttons: this.buttons.map((button, index) => assign({}, button, {
                        id: this.createUuid.calls.all().slice(1)[index].returnValue,
                        submitting: false
                    }))
                }
            });
        });
    });

    describe('dismissAlert(id)', function() {
        beforeEach(function() {
            this.id = createUuid();

            this.result = this.dismissAlert(this.id);
        });

        it('should return an FSA', function() {
            expect(this.result).toEqual({
                type: DISMISS_ALERT,
                payload: {
                    id: this.id
                }
            });
        });
    });

    describe('startSubmit({ alert, button })', function() {
        beforeEach(function() {
            this.alert = createUuid();
            this.button = createUuid();

            this.result = this.startSubmit({ alert: this.alert, button: this.button });
        });

        it('should return an FSA', function() {
            expect(this.result).toEqual({
                type: START_SUBMIT,
                payload: {
                    alert: this.alert,
                    button: this.button
                }
            });
        });
    });

    describe('stopSubmit({ alert, button })', function() {
        beforeEach(function() {
            this.alert = createUuid();
            this.button = createUuid();

            this.result = this.stopSubmit({ alert: this.alert, button: this.button });
        });

        it('should return an FSA', function() {
            expect(this.result).toEqual({
                type: STOP_SUBMIT,
                payload: {
                    alert: this.alert,
                    button: this.button
                }
            });
        });
    });

    describe('submit({ alert, button })', function() {
        beforeEach(function() {
            this.alert = createUuid();
            this.button = createUuid();

            this.thunk = getThunk(this.submit({ alert: this.alert, button: this.button }));
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.state = {
                    alert: {
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
                                id: this.alert,
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
                                        id: this.button,
                                        type: undefined,
                                        text: 'I Dunno!',
                                        onSelect: jasmine.createSpy('onSelect()').and.returnValue((this.onSelectDeferred = defer()).promise),
                                        submitting: false
                                    }
                                ]
                            }
                        ]
                    }
                };

                this.dispatch = jasmine.createSpy('dispatch()').and.callFake(({ payload }) => Promise.resolve(payload));
                this.getState = jasmine.createSpy('getState()').and.returnValue(this.state);

                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should dispatch() startSubmit()', function() {
                expect(this.dispatch).toHaveBeenCalledWith(this.startSubmit({ alert: this.alert, button: this.button }));
            });

            it('should call onSelect() for the correct button', function() {
                expect(this.state.alert.alerts[1].buttons[1].onSelect).toHaveBeenCalledWith(jasmine.any(Function));
            });

            describe('the function passed to onSelect()', function() {
                beforeEach(function() {
                    this.dispatch.calls.reset();
                    this.dismiss = this.state.alert.alerts[1].buttons[1].onSelect.calls.mostRecent().args[0];

                    this.dismiss();
                });

                it('should dispatch dismissAlert()', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(this.dismissAlert(this.alert));
                });
            });

            describe('when the onSelect() promise fulfills', function() {
                beforeEach(function(done) {
                    this.dispatch.calls.reset();

                    this.onSelectDeferred.resolve();
                    setTimeout(done);
                });

                it('should dispatch stopSubmit()', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(this.stopSubmit({ alert: this.alert, button: this.button }));
                });
            });

            describe('when the onSelect() promise rejects', function() {
                beforeEach(function(done) {
                    this.dispatch.calls.reset();

                    this.onSelectDeferred.reject(new Error('I failed!'));
                    setTimeout(done);
                });

                it('should dispatch stopSubmit()', function() {
                    expect(this.dispatch).toHaveBeenCalledWith(this.stopSubmit({ alert: this.alert, button: this.button }));
                });
            });
        });
    });
});
