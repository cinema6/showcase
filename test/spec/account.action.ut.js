import { createUuid } from 'rc-uuid';
import { assign } from 'lodash';
import {
    UPDATE_START,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,

    CHANGE_EMAIL_START,
    CHANGE_EMAIL_SUCCESS,
    CHANGE_EMAIL_FAILURE,

    CHANGE_PASSWORD_START,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE
} from '../../src/actions/account';
import { createAction } from 'redux-actions';
import defer from 'promise-defer';
import userActions from '../../src/actions/user';

const proxyquire = require('proxyquire');

describe('updateUser(data)', function() {
    let updateUser;
    let thunk;
    let data;

    beforeEach(function() {
        updateUser = proxyquire('../../src/actions/account', {
            './user': require('../../src/actions/user')
        }).updateUser;

        data = {
            firstName: 'Josh',
            lastName: 'Minzner',
            company: 'Reelcontent, Inc.'
        };

        spyOn(userActions, 'update').and.callThrough();

        thunk = updateUser(data);
    });

    it('should return a thunk', function() {
        expect(thunk).toEqual(jasmine.any(Function));
    });

    describe('when executed', function() {
        let state, dispatchDeferred;
        let dispatch, getState;
        let success, failure;

        beforeEach(function(done) {
            state = {
                session: {
                    user: 'u-' + createUuid()
                }
            };

            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
            getState = jasmine.createSpy('getState()').and.returnValue(state);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            thunk(dispatch, getState).then(success, failure);
            setTimeout(done);
        });

        it('should update the user', function() {
            expect(userActions.update).toHaveBeenCalledWith({ data: assign({}, data, { id: state.session.user }) });
            expect(dispatch).toHaveBeenCalledWith(userActions.update.calls.mostRecent().returnValue);
        });

        it('should dispatch UPDATE_START', function() {
            expect(dispatch).toHaveBeenCalledWith(createAction(UPDATE_START)(data));
        });

        describe('if the update succeeds', function() {
            beforeEach(function(done) {
                dispatch.calls.reset();

                dispatchDeferred.resolve(data);
                setTimeout(done);
            });

            it('should dispatch UPDATE_SUCCESS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(UPDATE_SUCCESS)(data));
            });

            it('should fulfill the promise', function() {
                expect(success).toHaveBeenCalledWith(data);
            });
        });

        describe('if the update fails', function() {
            let reason;

            beforeEach(function(done) {
                reason = new Error('It went wrong.');
                dispatch.calls.reset();

                dispatchDeferred.reject(reason);
                setTimeout(done);
            });

            it('should dispatch UPDATE_FAILURE', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(UPDATE_FAILURE)(reason));
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(reason);
            });
        });
    });
});

describe('changeEmail({ email, password })', function() {
    let changeEmail;
    let userChangeEmail;
    let thunk;
    let email, password;

    beforeEach(function() {
        userChangeEmail = jasmine.createSpy('changeEmail()').and.callFake(require('../../src/actions/user').changeEmail);
        changeEmail = proxyquire('../../src/actions/account', {
            './user': {
                changeEmail: userChangeEmail,

                __esModule: true
            }
        }).changeEmail;

        email = 'email@me.com';
        password = 'banana';

        thunk = changeEmail({ email, password });
    });

    it('should return a thunk', function() {
        expect(thunk).toEqual(jasmine.any(Function));
    });

    describe('when executed', function() {
        let state, dispatchDeferred;
        let dispatch, getState;
        let success, failure;

        beforeEach(function(done) {
            state = {
                session: {
                    user: 'u-' + createUuid()
                }
            };

            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
            getState = jasmine.createSpy('getState()').and.returnValue(state);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            thunk(dispatch, getState).then(success, failure);
            setTimeout(done);
        });

        it('should change the email', function() {
            expect(userChangeEmail).toHaveBeenCalledWith({ id: state.session.user, email, password });
            expect(dispatch).toHaveBeenCalledWith(userChangeEmail.calls.mostRecent().returnValue);
        });

        it('should dispatch CHANGE_EMAIL_START', function() {
            expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_EMAIL_START)(email));
        });

        describe('if the change succeeds', function() {
            beforeEach(function(done) {
                dispatch.calls.reset();

                dispatchDeferred.resolve(email);
                setTimeout(done);
            });

            it('should dispatch CHANGE_EMAIL_SUCCESS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_EMAIL_SUCCESS)(email));
            });

            it('should fulfill the promise', function() {
                expect(success).toHaveBeenCalledWith(email);
            });
        });

        describe('if the change fails', function() {
            let reason;

            beforeEach(function(done) {
                reason = new Error('It went wrong.');
                dispatch.calls.reset();

                dispatchDeferred.reject(reason);
                setTimeout(done);
            });

            it('should dispatch CHANGE_EMAIL_FAILURE', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_EMAIL_FAILURE)(reason));
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(reason);
            });
        });
    });
});

describe('changePassword({ newPassword, oldPassword })', function() {
    let changePassword;
    let userChangePassword;
    let thunk;
    let newPassword, oldPassword;

    beforeEach(function() {
        userChangePassword = jasmine.createSpy('changePassword()').and.callFake(require('../../src/actions/user').changePassword);
        changePassword = proxyquire('../../src/actions/account', {
            './user': {
                changePassword: userChangePassword,

                __esModule: true
            }
        }).changePassword;

        newPassword = 'Banana!';
        oldPassword = 'banana';

        thunk = changePassword({ newPassword, oldPassword });
    });

    it('should return a thunk', function() {
        expect(thunk).toEqual(jasmine.any(Function));
    });

    describe('when executed', function() {
        let state, dispatchDeferred;
        let dispatch, getState;
        let success, failure;

        beforeEach(function(done) {
            state = {
                session: {
                    user: 'u-' + createUuid()
                }
            };

            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
            getState = jasmine.createSpy('getState()').and.returnValue(state);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            thunk(dispatch, getState).then(success, failure);
            setTimeout(done);
        });

        it('should change the password', function() {
            expect(userChangePassword).toHaveBeenCalledWith({ id: state.session.user, newPassword, oldPassword });
            expect(dispatch).toHaveBeenCalledWith(userChangePassword.calls.mostRecent().returnValue);
        });

        it('should dispatch CHANGE_PASSWORD_START', function() {
            expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_PASSWORD_START)());
        });

        describe('if the change succeeds', function() {
            beforeEach(function(done) {
                dispatch.calls.reset();

                dispatchDeferred.resolve(undefined);
                setTimeout(done);
            });

            it('should dispatch CHANGE_PASSWORD_SUCCESS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_PASSWORD_SUCCESS)());
            });

            it('should fulfill the promise', function() {
                expect(success).toHaveBeenCalledWith(undefined);
            });
        });

        describe('if the change fails', function() {
            let reason;

            beforeEach(function(done) {
                reason = new Error('It went wrong.');
                dispatch.calls.reset();

                dispatchDeferred.reject(reason);
                setTimeout(done);
            });

            it('should dispatch CHANGE_PASSWORD_FAILURE', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_PASSWORD_FAILURE)(reason));
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(reason);
            });
        });
    });
});
