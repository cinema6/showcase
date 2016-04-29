'use strict';

import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import configureStore from 'redux-mock-store';
import defer from 'promise-defer';

const proxyquire = require('proxyquire');

describe('Login', function() {
    let Login;
    let renderer;
    let props;
    let login;

    beforeEach(function() {
        Login = proxyquire('../../src/containers/Login', {
        }).Login;

        renderer = ReactTestUtils.createRenderer();
        props = {
            fields: {},
            handleSubmit: jasmine.createSpy('handleSubmit()'),
            submitting: false
        };

        renderer.render(<Login {...props} />);

        login = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(login).toEqual(jasmine.any(Object));
    });
});

describe('ConnectedLogin', function() {
    let ConnectedLogin, loginUser;
    let renderer;
    let login;
    let store;

    beforeEach(function() {
        loginUser = jasmine.createSpy('loginUser()').and.callFake(require('../../src/actions/login').loginUser);

        ConnectedLogin = proxyquire('../../src/containers/Login', {
            '../actions/login': {
                loginUser,

                __esModule: true
            }
        }).default;

        store = configureStore([])({});

        renderer = ReactTestUtils.createRenderer();
        renderer.render(
            <ConnectedLogin store={store}/>
        );

        login = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(login).toEqual(jasmine.any(Object));
    });

    describe('onSubmit(values, dispatch)', function() {
        let dispatchDeferred;
        let values, dispatch;
        let success, failure;

        beforeEach(function(done) {
            values = { email: 'josh@reelcontent.com', password: 'banana' };
            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            login.props.onSubmit(values, dispatch).then(success, failure);
            setTimeout(done);
        });

        it('should dispatch a loginUser() action', function() {
            expect(loginUser).toHaveBeenCalledWith({ email: values.email, password: values.password, redirect: '/dashboard' });
            expect(dispatch).toHaveBeenCalledWith(loginUser.calls.mostRecent().returnValue);
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
