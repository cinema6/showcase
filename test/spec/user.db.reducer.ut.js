import userReducer from '../../src/reducers/db/user';
import {
    LOGIN_SUCCESS,
    STATUS_CHECK_SUCCESS
} from '../../src/actions/auth';
import {
    CHANGE_EMAIL_SUCCESS
} from '../../src/actions/user';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { assign } from 'lodash';

describe('userReducer()', function() {
    it('should return some inital state', function() {
        expect(userReducer(undefined, 'INIT')).toEqual({});
    });

    describe('handling actions', function() {
        let state;
        let newState;

        beforeEach(function() {
            state = {
                ['u-' + createUuid()]: {
                    name: 'Evan'
                },
                ['u-' + createUuid()]: {
                    name: 'Scott'
                }
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

                    newState = userReducer(state, createAction(ACTION)(user));
                });

                it('should add the user to the cache', function() {
                    expect(newState).toEqual(assign({}, state, {
                        [user.id]: user
                    }));
                });
            });
        });

        describe(CHANGE_EMAIL_SUCCESS, function() {
            let id, user;
            let email;

            beforeEach(function() {
                id = Object.keys(state)[0];
                user = state[id];
                email = 'new@email.com';

                newState = userReducer(state, createAction(CHANGE_EMAIL_SUCCESS, null, () => ({ id, email }))(undefined));
            });

            it('should update the user\'s email', function() {
                expect(newState).toEqual(assign({}, state, {
                    [id]: assign({}, user, {
                        email
                    })
                }));
            });
        });
    });
});
