'use strict';

import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { assign } from 'lodash';
import { createThunk } from '../middleware/fsa_thunk';

function prefix(type) {
    return `@@notification/${type}`;
}

function delay(ms) {
    return function wait(value) {
        return new Promise(resolve => setTimeout(() => resolve(value), ms));
    };
}

export const ADD_NOTIFICATION = prefix('ADD_NOTIFICATION');
export const addNotification = createAction(ADD_NOTIFICATION, data => assign({}, data, {
    id: createUuid()
}));

export const REMOVE_NOTIFICATION = prefix('REMOVE_NOTIFICATION');
export const removeNotification = createAction(REMOVE_NOTIFICATION);

export const notify = createThunk(({ type, message, time = 3500 }) => {
    return function thunk(dispatch) {
        return dispatch(addNotification({ type, message }))
            .then(delay(time))
            .then(({ id }) => dispatch(removeNotification(id)));
    };
});
