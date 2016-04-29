import { updateUser, changeEmail, changePassword } from '../../src/actions/user';
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
} from '../../src/actions/user';
import { createAction } from 'redux-actions';
import { callAPI } from '../../src/actions/api';
import { CALL_API } from 'redux-api-middleware';

describe('updateUser(data)', function() {
    let thunk;
    let data;

    beforeEach(function() {
        data = {
            id: 'u-' + createUuid(),
            email: 'josh@reelcontent.com',
            firstName: 'Josh',
            lastName: 'Minzner'
        };

        thunk = updateUser(data);
    });

    it('should return a thunk', function() {
        expect(thunk).toEqual(jasmine.any(Function));
    });

    describe('when executed', function() {
        let state;
        let dispatch, getState;
        let success, failure;

        beforeEach(function(done) {
            state = {
                db: {
                    users: {
                        [data.id]: assign({}, data, {
                            firstName: 'Dan',
                            foo: 'bar'
                        })
                    }
                }
            };

            dispatch = jasmine.createSpy('dispatch()').and.returnValue(Promise.resolve(data));
            getState = jasmine.createSpy('getState()').and.returnValue(state);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            thunk(dispatch, getState).then(success, failure);
            setTimeout(done);
        });

        it('should make an api call', function() {
            expect(dispatch).toHaveBeenCalledWith(callAPI({
                endpoint: `/api/account/users/${data.id}`,
                method: 'PUT',
                types: [UPDATE_START, UPDATE_SUCCESS, UPDATE_FAILURE],
                body: assign({}, state.db.users[data.id], data)
            }));
        });

        describe('if the data has no id', function() {
            beforeEach(function(done) {
                delete data.id;
                dispatch.calls.reset();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should not make an API call', function() {
                expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                    [CALL_API]: jasmine.any(Object)
                }));
            });

            it('should dispatch UPDATE_FAILURE', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(UPDATE_FAILURE)(new Error('data has no id')));
            });
        });

        describe('if the id is for an unknown user', function() {
            beforeEach(function(done) {
                data.id = 'u-' + createUuid();
                dispatch.calls.reset();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should not make an API call', function() {
                expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                    [CALL_API]: jasmine.any(Object)
                }));
            });

            it('should dispatch UPDATE_FAILURE', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(UPDATE_FAILURE)(new Error(`have no user with id: ${data.id}`)));
            });
        });
    });
});

describe('changeEmail({ id, email, password })', function() {
    let thunk;
    let id, email, password;

    beforeEach(function() {
        id = 'u-' + createUuid();
        email = 'new@email.com';
        password = 'banana';

        thunk = changeEmail({ id, email, password });
    });

    it('should return a thunk', function() {
        expect(thunk).toEqual(jasmine.any(Function));
    });

    describe('when executed', function() {
        let state;
        let dispatch, getState;
        let success, failure;

        beforeEach(function(done) {
            state = {
                db: {
                    users: {
                        [id]: {
                            id: id,
                            email: 'old@email.com'
                        }
                    }
                }
            };

            dispatch = jasmine.createSpy('dispatch()').and.returnValue(Promise.resolve(undefined));
            getState = jasmine.createSpy('getState()').and.returnValue(state);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            thunk(dispatch, getState).then(success, failure);
            setTimeout(done);
        });

        it('should make an api call', function() {
            expect(dispatch).toHaveBeenCalledWith(callAPI({
                endpoint: '/api/account/users/email',
                method: 'POST',
                types: [
                    CHANGE_EMAIL_START,
                    {
                        type: CHANGE_EMAIL_SUCCESS,
                        meta: { email, id }
                    },
                    {
                        type: CHANGE_EMAIL_FAILURE,
                        meta: { email, id }
                    }
                ],
                body: {
                    newEmail: email,
                    email: state.db.users[id].email,
                    password: password
                }
            }));
        });

        it('should fulfill with the new email', function() {
            expect(success).toHaveBeenCalledWith(email);
        });

        describe('if the id is for an unknown user', function() {
            beforeEach(function(done) {
                id = 'u-' + createUuid();
                thunk = changeEmail({ id, email, password });
                dispatch.calls.reset();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should not make an API call', function() {
                expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                    [CALL_API]: jasmine.any(Object)
                }));
            });

            it('should dispatch CHANGE_EMAIL_FAILURE', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_EMAIL_FAILURE)(new Error(`have no user with id: ${id}`)));
            });
        });
    });
});

describe('changePassword({ id, newPassword, oldPassword })', function() {
    let thunk;
    let id, newPassword, oldPassword;

    beforeEach(function() {
        id = 'u-' + createUuid();
        newPassword = 'Banana!';
        oldPassword = 'banana';

        thunk = changePassword({ id, newPassword, oldPassword });
    });

    it('should return a thunk', function() {
        expect(thunk).toEqual(jasmine.any(Function));
    });

    describe('when executed', function() {
        let state;
        let dispatch, getState;
        let success, failure;

        beforeEach(function(done) {
            state = {
                db: {
                    users: {
                        [id]: {
                            id: id,
                            email: 'old@email.com'
                        }
                    }
                }
            };

            dispatch = jasmine.createSpy('dispatch()').and.returnValue(Promise.resolve(undefined));
            getState = jasmine.createSpy('getState()').and.returnValue(state);

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            thunk(dispatch, getState).then(success, failure);
            setTimeout(done);
        });

        it('should make an api call', function() {
            expect(dispatch).toHaveBeenCalledWith(callAPI({
                endpoint: '/api/account/users/password',
                method: 'POST',
                types: [CHANGE_PASSWORD_START, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE],
                body: {
                    email: state.db.users[id].email,
                    password: oldPassword,
                    newPassword: newPassword
                }
            }));
        });

        describe('if the id is for an unknown user', function() {
            beforeEach(function(done) {
                id = 'u-' + createUuid();
                thunk = changePassword({ id, newPassword, oldPassword });
                dispatch.calls.reset();

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should not make an API call', function() {
                expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                    [CALL_API]: jasmine.any(Object)
                }));
            });

            it('should dispatch CHANGE_EMAIL_FAILURE', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(CHANGE_PASSWORD_FAILURE)(new Error(`have no user with id: ${id}`)));
            });
        });
    });
});
