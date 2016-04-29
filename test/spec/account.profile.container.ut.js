'use strict';

import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import configureStore from 'redux-mock-store';
import defer from 'promise-defer';
import { mapStateToProps } from '../../src/containers/Account/Profile';
import { createUuid } from 'rc-uuid';

const proxyquire = require('proxyquire');

describe('Profile', function() {
    let Profile;
    let renderer;
    let props;
    let profile;

    beforeEach(function() {
        Profile = proxyquire('../../src/containers/Account/Profile', {
        }).Profile;

        renderer = ReactTestUtils.createRenderer();
        props = {
            fields: {},
            handleSubmit: jasmine.createSpy('handleSubmit()'),
            submitting: false,
            page: { updateSuccess: false }
        };

        renderer.render(<Profile {...props} />);

        profile = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(profile).toEqual(jasmine.any(Object));
    });
});

describe('ConnectedProfile', function() {
    let ConnectedProfile, updateUser;
    let renderer;
    let profile;
    let store;

    beforeEach(function() {
        updateUser = jasmine.createSpy('updateUser()').and.callFake(require('../../src/actions/account').updateUser);

        ConnectedProfile = proxyquire('../../src/containers/Account/Profile', {
            '../../actions/account': {
                updateUser,

                __esModule: true
            }
        }).default;

        store = configureStore([])({});

        renderer = ReactTestUtils.createRenderer();
        renderer.render(
            <ConnectedProfile store={store}/>
        );

        profile = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(profile).toEqual(jasmine.any(Object));
    });

    describe('onSubmit(values, dispatch)', function() {
        let dispatchDeferred;
        let values, dispatch;
        let success, failure;

        beforeEach(function(done) {
            values = { firstName: 'Josh', lastName: 'Minzner', company: 'Reelcontent, Inc.' };
            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            profile.props.onSubmit(values, dispatch).then(success, failure);
            setTimeout(done);
        });

        it('should dispatch a loginUser() action', function() {
            expect(updateUser).toHaveBeenCalledWith(values);
            expect(dispatch).toHaveBeenCalledWith(updateUser.calls.mostRecent().returnValue);
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
                user: {
                    [user.id]: user
                }
            },
            page: {
                'dashboard.account.profile': {
                    updateSuccess: true
                }
            }
        };

        result = mapStateToProps(state);
    });

    it('should return the props based on state', function() {
        expect(result).toEqual({
            initialValues: user
        });
    });

    describe('if there is no user', function() {
        beforeEach(function() {
            state.session.user = null;

            result = mapStateToProps(state);
        });

        it('should not include initialValues', function() {
            expect(result).toEqual({
                initialValues: {}
            });
        });
    });
});
