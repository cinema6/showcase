'use strict';

import { renderIntoDocument, createRenderer } from 'react-addons-test-utils';
import React from 'react';
import configureStore from 'redux-mock-store';
import defer from 'promise-defer';
import { createUuid } from 'rc-uuid';
import { validate } from '../../src/containers/ResetPassword';

const proxyquire = require('proxyquire');

describe('ResetPassword', function() {
    let ResetPassword, resetPassword;
    let props;
    let component;

    beforeEach(function() {
        resetPassword = jasmine.createSpy('resetPassword()').and.callFake(require('../../src/actions/auth').resetPassword);

        ResetPassword = proxyquire('../../src/containers/ResetPassword', {
            '../actions/auth': {
                resetPassword,

                __esModule: true
            }
        }).ResetPassword;

        props = {
            fields: {
                newPassword: {},
                newPasswordRepeat: {}
            },
            handleSubmit: jasmine.createSpy('handleSubmit()'),
            submitting: false,
            page: {
                submitSuccess: false
            },
            location: {
                query: {
                    id: 'u-' + createUuid(),
                    token: createUuid()
                }
            }
        };

        component = renderIntoDocument(<ResetPassword {...props} />);
    });

    it('should exist', function() {
        expect(component).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('send()', function() {
            let send;
            let dispatchDeferred;
            let values, dispatch;
            let success, failure;

            beforeEach(function(done) {
                send = component.send;

                values = { newPassword: 'banana2', newPasswordRepeat: 'banana2' };
                dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                send(values, dispatch).then(success, failure);
                setTimeout(done);
            });

            it('should dispatch a resetPassword() action', function() {
                expect(resetPassword).toHaveBeenCalledWith({ newPassword: values.newPassword, id: props.location.query.id, token: props.location.query.token });
                expect(dispatch).toHaveBeenCalledWith(resetPassword.calls.mostRecent().returnValue);
            });

            describe('if successful', function() {
                beforeEach(function(done) {
                    dispatch.calls.reset();
                    dispatchDeferred.resolve(undefined);
                    dispatch.and.returnValue(Promise.resolve(undefined));

                    setTimeout(done);
                });

                it('should fulfill with undefined', function() {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('if failing', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('It went wrong!');
                    dispatchDeferred.reject(reason);

                    setTimeout(done);
                });

                it('should reject with a form validation error', function() {
                    expect(failure).toHaveBeenCalledWith({ _error: reason });
                });
            });
        });
    });
});

describe('ConnectedResetPassword', function() {
    let ConnectedResetPassword, resetPassword;
    let renderer;
    let component;
    let store;

    beforeEach(function() {
        resetPassword = jasmine.createSpy('resetPassword()').and.callFake(require('../../src/actions/auth').resetPassword);

        ConnectedResetPassword = proxyquire('../../src/containers/ResetPassword', {
            '../actions/auth': {
                resetPassword,

                __esModule: true
            }
        }).default;

        store = configureStore([])({});

        renderer = createRenderer();
        renderer.render(
            <ConnectedResetPassword store={store}/>
        );

        component = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(component).toEqual(jasmine.any(Object));
    });

    describe('onSubmit(values, dispatch)', function() {
    });
});

describe('validate(values)', function() {
    let values;

    beforeEach(function() {
        values = { newPassword: undefined, newPasswordRepeat: undefined };
    });

    describe('if the newPassword and newPasswordRepeat match', function() {
        beforeEach(function() {
            values.newPassword = 'banana'; values.newPasswordRepeat = 'banana';
        });

        it('should return no errors', function() {
            expect(validate(values)).toEqual({});
        });
    });

    describe('if the newPassword and newPasswordRepeat don\'t match', function() {
        beforeEach(function() {
            values.newPassword = 'banana'; values.newPasswordRepeat = 'banan';
        });

        it('should return an error', function() {
            expect(validate(values)).toEqual({
                newPassword: 'Passwords don\'t match!'
            });
        });
    });
});
