'use strict';

import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import configureStore from 'redux-mock-store';
import defer from 'promise-defer';

const proxyquire = require('proxyquire');

describe('ForgotPassword', function() {
    let ForgotPassword;
    let renderer;
    let props;
    let forgotPassword;

    beforeEach(function() {
        ForgotPassword = proxyquire('../../src/containers/ForgotPassword', {
        }).ForgotPassword;

        renderer = ReactTestUtils.createRenderer();
        props = {
            fields: {},
            handleSubmit: jasmine.createSpy('handleSubmit()'),
            submitting: false,
            page: {
                submitSuccess: false
            }
        };

        renderer.render(<ForgotPassword {...props} />);

        forgotPassword = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(forgotPassword).toEqual(jasmine.any(Object));
    });
});

describe('ConnectedForgotPassword', function() {
    let ConnectedForgotPassword, forgotPassword;
    let renderer;
    let component;
    let store;

    beforeEach(function() {
        forgotPassword = jasmine.createSpy('forgotPassword()').and.callFake(require('../../src/actions/auth').forgotPassword);

        ConnectedForgotPassword = proxyquire('../../src/containers/ForgotPassword', {
            '../actions/auth': {
                forgotPassword,

                __esModule: true
            }
        }).default;

        store = configureStore([])({});

        renderer = ReactTestUtils.createRenderer();
        renderer.render(
            <ConnectedForgotPassword store={store}/>
        );

        component = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(component).toEqual(jasmine.any(Object));
    });

    describe('onSubmit(values, dispatch)', function() {
        let dispatchDeferred;
        let values, dispatch;
        let success, failure;

        beforeEach(function(done) {
            values = { email: 'josh@reelcontent.com' };
            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            component.props.onSubmit(values, dispatch).then(success, failure);
            setTimeout(done);
        });

        it('should dispatch a forgotPassword() action', function() {
            expect(forgotPassword).toHaveBeenCalledWith({ email: values.email });
            expect(dispatch).toHaveBeenCalledWith(forgotPassword.calls.mostRecent().returnValue);
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
