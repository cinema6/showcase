import sessionReducer from '../../src/reducers/session';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS,
    LOGOUT_SUCCESS
} from '../../src/actions/auth';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';
import { createUuid } from 'rc-uuid';

describe('sessionReducer()', function() {
    it('should return some initial state', function() {
        expect(sessionReducer(undefined, 'INIT')).toEqual({
            user: null
        });
    });

    describe('handling actions', function() {
        let state;
        let newState;

        beforeEach(function() {
            state = {
                user: null
            };
        });

        [LOGIN_SUCCESS, STATUS_CHECK_SUCCESS].forEach(ACTION => {
            describe(ACTION, function() {
                let user;

                beforeEach(function() {
                    user = {
                        id: 'u-' + createUuid(),
                        name: 'Johnny Testmonkey',
                        email: 'johnny@bananas.com'
                    };

                    newState = sessionReducer(state, createAction(ACTION)(user));
                });

                it('should add the user to the session', function() {
                    expect(newState).toEqual(assign({}, state, {
                        user: user.id
                    }));
                });
            });
        });

        describe(LOGOUT_SUCCESS, function() {
            beforeEach(function() {
                state.user = 'u-' + createUuid();

                newState = sessionReducer(state, createAction(LOGOUT_SUCCESS)());
            });

            it('should set the user to null', function() {
                expect(newState).toEqual(assign({}, state, {
                    user: null
                }));
            });
        });
    });
});
