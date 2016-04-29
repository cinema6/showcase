'use strict';

import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import configureStore from 'redux-mock-store';
import defer from 'promise-defer';
import { mapStateToProps, validate } from '../../src/containers/Account/Password';
import { createUuid } from 'rc-uuid';

const proxyquire = require('proxyquire');

describe('Password', function() {
    let Password;
    let renderer;
    let props;
    let password;

    beforeEach(function() {
        Password = proxyquire('../../src/containers/Account/Password', {
        }).Password;

        renderer = ReactTestUtils.createRenderer();
        props = {
            fields: {
                oldPassword: {},
                newPassword: {},
                newPasswordRepeat: {}
            },
            handleSubmit: jasmine.createSpy('handleSubmit()'),
            submitting: false,
            page: { updateSuccess: false },
            currentPassword: 'password@me.com'
        };

        renderer.render(<Password {...props} />);

        password = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(password).toEqual(jasmine.any(Object));
    });
});

describe('ConnectedPassword', function() {
    let ConnectedPassword, changePassword;
    let renderer;
    let password;
    let store;

    beforeEach(function() {
        changePassword = jasmine.createSpy('changePassword()').and.callFake(require('../../src/actions/account').changePassword);

        ConnectedPassword = proxyquire('../../src/containers/Account/Password', {
            '../../actions/account': {
                changePassword,

                __esModule: true
            }
        }).default;

        store = configureStore([])({});

        renderer = ReactTestUtils.createRenderer();
        renderer.render(
            <ConnectedPassword store={store}/>
        );

        password = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(password).toEqual(jasmine.any(Object));
    });

    describe('onSubmit(values, dispatch)', function() {
        let dispatchDeferred;
        let values, dispatch;
        let success, failure;

        beforeEach(function(done) {
            values = { newPassword: 'Banana!', oldPassword: 'banana', newPasswordRepeat: 'Banana!' };
            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            password.props.onSubmit(values, dispatch).then(success, failure);
            setTimeout(done);
        });

        it('should dispatch a loginUser() action', function() {
            expect(changePassword).toHaveBeenCalledWith({ oldPassword: values.oldPassword, newPassword: values.newPassword });
            expect(dispatch).toHaveBeenCalledWith(changePassword.calls.mostRecent().returnValue);
        });

        describe('if successful', function() {
            beforeEach(function(done) {
                dispatch.calls.reset();
                dispatchDeferred.resolve(values);
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

describe('mapStateToProps(state)', function() {
    let state;
    let user;
    let result;

    beforeEach(function() {
        user = {
            id: 'u-' + createUuid(),
            firstName: 'Scott',
            lastName: 'B',
            company: 'Reelcontent'
        };

        state = {
            session: {
                user: user.id
            },
            db: {
                users: {
                    [user.id]: user
                }
            },
            page: {
                'dashboard.account.password': {
                    updateSuccess: true
                }
            }
        };

        result = mapStateToProps(state);
    });

    it('should return the props based on state', function() {
        expect(result).toEqual({});
    });
});

describe('validate(values)', function() {
    let values;

    beforeEach(function() {
        values = { oldPassword: undefined, newPassword: undefined, newPasswordRepeat: undefined };
    });

    describe('if not all values are provided', function() {
        beforeEach(function() {
            values.newPassword = 'foo'; values.newPasswordRepeat = 'foo';
        });

        it('should return an error for the entire form', function() {
            expect(validate(values)).toEqual({
                _error: 'All fields are required.'
            });
        });
    });

    describe('if the newPassword and newPasswordRepeat match', function() {
        beforeEach(function() {
            values.oldPassword = 'foo';
            values.newPassword = 'banana'; values.newPasswordRepeat = 'banana';
        });

        it('should return no errors', function() {
            expect(validate(values)).toEqual({});
        });
    });

    describe('if the newPassword and newPasswordRepeat don\'t match', function() {
        beforeEach(function() {
            values.oldPassword = 'foo';
            values.newPassword = 'banana'; values.newPasswordRepeat = 'banan';
        });

        it('should return an error', function() {
            expect(validate(values)).toEqual({
                newPassword: 'Passwords don\'t match!'
            });
        });
    });
});
