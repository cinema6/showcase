'use strict';

import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import configureStore from 'redux-mock-store';
import defer from 'promise-defer';
import { mapStateToProps } from '../../src/containers/Account/Email';
import { createUuid } from 'rc-uuid';

const proxyquire = require('proxyquire');

describe('Email', function() {
    let Email;
    let renderer;
    let props;
    let email;

    beforeEach(function() {
        Email = proxyquire('../../src/containers/Account/Email', {
        }).Email;

        renderer = ReactTestUtils.createRenderer();
        props = {
            fields: {},
            handleSubmit: jasmine.createSpy('handleSubmit()'),
            submitting: false,
            page: { updateSuccess: false },
            currentEmail: 'email@me.com',
            pristine: true
        };

        renderer.render(<Email {...props} />);

        email = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(email).toEqual(jasmine.any(Object));
    });
});

describe('ConnectedEmail', function() {
    let ConnectedEmail, changeEmail;
    let renderer;
    let email;
    let store;

    beforeEach(function() {
        changeEmail = jasmine.createSpy('changeEmail()').and.callFake(require('../../src/actions/account').changeEmail);

        ConnectedEmail = proxyquire('../../src/containers/Account/Email', {
            '../../actions/account': {
                changeEmail,

                __esModule: true
            }
        }).default;

        store = configureStore([])({});

        renderer = ReactTestUtils.createRenderer();
        renderer.render(
            <ConnectedEmail store={store}/>
        );

        email = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(email).toEqual(jasmine.any(Object));
    });

    describe('onSubmit(values, dispatch)', function() {
        let dispatchDeferred;
        let values, dispatch;
        let success, failure;

        beforeEach(function(done) {
            values = { email: 'new@email.com', password: 'banana' };
            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            email.props.onSubmit(values, dispatch).then(success, failure);
            setTimeout(done);
        });

        it('should dispatch a loginUser() action', function() {
            expect(changeEmail).toHaveBeenCalledWith(values);
            expect(dispatch).toHaveBeenCalledWith(changeEmail.calls.mostRecent().returnValue);
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
            company: 'Reelcontent',
            email: 'scottb@reelcontent.com'
        };

        state = {
            session: {
                user: user.id
            },
            db: {
                user: {
                    [user.id]: user
                }
            },
            page: {
                'dashboard.account.email': {
                    updateSuccess: true
                }
            }
        };

        result = mapStateToProps(state);
    });

    it('should return the props based on state', function() {
        expect(result).toEqual({
            currentEmail: user.email,
            initialValues: {
                email: user.email
            }
        });
    });

    describe('if there is no user', function() {
        beforeEach(function() {
            delete state.session.user;

            result = mapStateToProps(state);
        });

        it('should not return a currentEmail', function() {
            expect(result).toEqual({
                currentEmail: null,
                initialValues: {
                    email: null
                }
            });
        });
    });
});
