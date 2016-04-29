import {
    loginUser
} from '../../src/actions/login';
import {
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from '../../src/actions/login';
import defer from 'promise-defer';
import {
    loginUser as authLoginUser
} from '../../src/actions/auth';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { replace } from 'react-router-redux';

describe('actions: auth', function() {
    describe('loginUser({ email, password, redirect })', function() {
        let email, password, redirect;
        let thunk;

        beforeEach(function() {
            email = 'josh@reelcontent.com';
            password = 'banana';
            redirect = '/dashboard';

            thunk = loginUser({ email, password, redirect });
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            let dispatch;
            let dispatchDeferred;

            beforeEach(function() {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

                thunk(dispatch);
            });

            it('should login the user', function() {
                expect(dispatch).toHaveBeenCalledWith(authLoginUser({ email, password }));
            });

            it('should dispatch a LOGIN_START action', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOGIN_START)());
            });

            describe('when the login', function() {
                describe('succeeds', function() {
                    let data;

                    beforeEach(function(done) {
                        data = {
                            id: 'u-' + createUuid()
                        };

                        dispatch.calls.reset();
                        dispatch.and.returnValue(Promise.resolve(undefined));

                        dispatchDeferred.resolve(data);
                        setTimeout(done);
                    });

                    it('should dispatch LOGIN_SUCCESS', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(LOGIN_SUCCESS)(data));
                    });

                    it('should dispatch a transition to the redirect', function() {
                        expect(dispatch).toHaveBeenCalledWith(replace(redirect));
                    });
                });

                describe('fails', function() {
                    let reason;

                    beforeEach(function(done) {
                        reason = new Error('It failed!');

                        dispatch.calls.reset();
                        dispatch.and.returnValue(Promise.resolve(undefined));

                        dispatchDeferred.reject(reason);
                        setTimeout(done);
                    });

                    it('should dispatch LOGIN_FAILURE', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(LOGIN_FAILURE)(reason));
                    });

                    it('should not transition', function() {
                        expect(dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
                            type: replace().type
                        }));
                    });
                });
            });
        });
    });
});
