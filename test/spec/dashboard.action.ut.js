import defer from 'promise-defer';
import { logoutUser, showNav, toggleNav } from '../../src/actions/dashboard';
import { logoutUser as authLogoutUser } from '../../src/actions/auth';
import { createAction } from 'redux-actions';
import {
    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    SHOW_NAV,
    TOGGLE_NAV
} from '../../src/actions/dashboard';
import { replace } from 'react-router-redux';

describe('logoutUser()', function() {
    let thunk;

    beforeEach(function() {
        thunk = logoutUser();
    });

    it('should return a thunk', function() {
        expect(thunk).toEqual(jasmine.any(Function));
    });

    describe('when called', function() {
        let dispatch, getState;
        let dispatchDeferred;
        let success, failure;

        beforeEach(function(done) {
            dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
            getState = jasmine.createSpy('getState()').and.returnValue({});

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            thunk(dispatch, getState).then(success, failure);
            setTimeout(done);
        });

        it('should dispatch LOGOUT_START', function() {
            expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_START)());
        });

        it('should logout the user', function() {
            expect(dispatch).toHaveBeenCalledWith(authLogoutUser());
        });

        describe('when logging out succeeds', function() {
            beforeEach(function(done) {
                dispatch.calls.reset();
                dispatch.and.returnValue(Promise.resolve(undefined));

                dispatchDeferred.resolve(null);
                setTimeout(done);
            });

            it('should dispatch LOGOUT_SUCCESS', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_SUCCESS)(null));
            });

            it('should redirect to the homepage', function() {
                expect(dispatch).toHaveBeenCalledWith(replace('/login'));
            });

            it('should fulfill to undefined', function() {
                expect(success).toHaveBeenCalledWith(undefined);
            });
        });

        describe('when logging out fails', function() {
            let reason;

            beforeEach(function(done) {
                dispatch.calls.reset();
                dispatch.and.returnValue(Promise.resolve(undefined));

                reason = new Error('Something went wrong.');
                dispatchDeferred.reject(reason);

                setTimeout(done);
            });

            it('should dispatch LOGOUT_FAILURE', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(LOGOUT_FAILURE)(reason));
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(reason);
            });
        });
    });
});

describe('showNav(show)', function() {
    let result;

    beforeEach(function() {
        result = showNav(true);
    });

    it('should return an FSA', function() {
        expect(result).toEqual(createAction(SHOW_NAV)(true));
    });
});

describe('toggleNav()', function() {
    let result;

    beforeEach(function() {
        result = toggleNav();
    });

    it('should return an FSA', function() {
        expect(result).toEqual(createAction(TOGGLE_NAV)());
    });
});
