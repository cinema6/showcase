'use strict';

import notificationReducer from '../../src/reducers/notification';
import { createUuid } from 'rc-uuid';
import { TYPE } from '../../src/enums/notification';
import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION
} from '../../src/actions/notification';
import { createAction } from 'redux-actions';
import { assign } from 'lodash';

describe('notification reducer', function() {
    it('should return some initial state', function() {
        expect(notificationReducer(undefined, {})).toEqual({
            items: []
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                items: [
                    {
                        id: createUuid(),
                        type: TYPE.SUCCESS,
                        message: 'It worked!'
                    },
                    {
                        id: createUuid(),
                        type: TYPE.DANGER,
                        message: 'It failed!'
                    },
                    {
                        id: createUuid(),
                        type: TYPE.INFO,
                        message: 'Just a heads-up!'
                    }
                ]
            };
        });

        describe(ADD_NOTIFICATION, function() {
            beforeEach(function() {
                action = createAction(ADD_NOTIFICATION)({
                    id: createUuid(),
                    type: TYPE.WARNING,
                    message: 'Uh-oh!'
                });

                newState = notificationReducer(state, action);
            });

            it('should add the notification to the beginning of the list', function() {
                expect(newState).toEqual(assign({}, state, {
                    items: [action.payload].concat(state.items)
                }));
            });
        });

        describe(REMOVE_NOTIFICATION, function() {
            beforeEach(function() {
                action = createAction(REMOVE_NOTIFICATION)(state.items[1].id);

                newState = notificationReducer(state, action);
            });

            it('should remove the notification', function() {
                expect(newState).toEqual(assign({}, state, {
                    items: state.items.filter(({ id }) => id !== action.payload)
                }));
            });
        });
    });
});
