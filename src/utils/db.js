'use strict';

import { callAPI } from '../actions/api';
import {
    assign,
    get as _get,
    mapValues,
    keyBy,
    omit,
    map
} from 'lodash';
import { createAction } from 'redux-actions';

export const LIST = getActionNames('LIST');
export const GET = getActionNames('GET');
export const CREATE = getActionNames('CREATE');
export const UPDATE = getActionNames('UPDATE');
export const REMOVE = getActionNames('REMOVE');

function prefix(action, type = '') {
    return `@@db${type ? (':' + type) : ''}/${action}`;
}

function getActionNames(method, type) {
    return {
        START: prefix(`${method}/START`, type),
        SUCCESS: prefix(`${method}/SUCCESS`, type),
        FAILURE: prefix(`${method}/FAILURE`, type)
    };
}

export function createDbActions({ type, endpoint, key = 'id' }) {
    function call(config, id = null) {
        return callAPI(assign({}, config, {
            types: config.types.map(action => ({ type: action, meta: { type, key, id } }))
        }));
    }

    function getTypedActionNames(method) {
        return getActionNames(method, type);
    }

    function wrap(action, dispatch, factory) {
        dispatch(createAction(action.START)());

        return factory().then(result => {
            dispatch(createAction(action.SUCCESS)(result));

            return result;
        }).catch(reason => {
            dispatch(createAction(action.FAILURE)(reason));

            throw reason;
        });
    }

    function list() {
        return function thunk(dispatch) {
            return wrap(list, dispatch, () => dispatch(call({
                types: [LIST.START, LIST.SUCCESS, LIST.FAILURE],
                endpoint,
                method: 'GET'
            })).then(items => map(items, key)));
        };
    }
    assign(list, getTypedActionNames('LIST'));

    function get({ id }) {
        return function thunk(dispatch) {
            return wrap(get, dispatch, () =>  dispatch(call({
                types: [GET.START, GET.SUCCESS, GET.FAILURE],
                endpoint: `${endpoint}/${id}`,
                method: 'GET'
            }, id)).then(item => [item[key]]));
        };
    }
    assign(get, getTypedActionNames('GET'));

    function create({ data }) {
        return function thunk(dispatch) {
            return wrap(create, dispatch, () => dispatch(call({
                types: [CREATE.START, CREATE.SUCCESS, CREATE.FAILURE],
                endpoint,
                method: 'POST',
                body: data
            })).then(item => [item[key]]));
        };
    }
    assign(create, getTypedActionNames('CREATE'));

    function update({ data }) {
        const id = data[key];

        return function thunk(dispatch, getState) {
            const current = _get(getState(), ['db', type, id]);

            if (!id) {
                return dispatch(createAction(update.FAILURE)(new Error(
                    `data must have a(n) ${key}`
                )));
            }

            if (!current) {
                return dispatch(createAction(update.FAILURE)(new Error(
                    `have no ${type} with ${key}(${id})`
                )));
            }

            return wrap(update, dispatch, () => dispatch(call({
                types: [UPDATE.START, UPDATE.SUCCESS, UPDATE.FAILURE],
                endpoint: `${endpoint}/${id}`,
                method: 'PUT',
                body: assign({}, current, data)
            }, id)).then(item => [item[key]]));
        };
    }
    assign(update, getTypedActionNames('UPDATE'));

    function remove({ id }) {
        return function thunk(dispatch) {
            return wrap(remove, dispatch, () => dispatch(call({
                types: [REMOVE.START, REMOVE.SUCCESS, REMOVE.FAILURE],
                endpoint: `${endpoint}/${id}`,
                method: 'DELETE'
            }, id)).then(() => [id]));
        };
    }
    assign(remove, getTypedActionNames('REMOVE'));

    return { list, get, create, update, remove };
}

export function createDbReducer(reducerMap) {
    function add(state, { payload, meta: { key, type } }) {
        return assign({}, state, {
            [type]: assign({}, state[type], {
                [payload[key]]: payload
            })
        });
    }

    function addMany(state, { payload, meta: { key, type } }) {
        return assign({}, state, {
            [type]: assign({}, state[type], keyBy(payload, key))
        });
    }

    function remove(state, { meta: { id, type } }) {
        return assign({}, state, {
            [type]: omit(state[type], [id])
        });
    }

    function updateStore(state, action) {
        switch (action.type) {
        case LIST.SUCCESS:
            return addMany(state, action);
        case GET.SUCCESS:
        case CREATE.SUCCESS:
        case UPDATE.SUCCESS:
            return add(state, action);
        case REMOVE.SUCCESS:
            return remove(state, action);
        default:
            return state;
        }
    }

    function callReducers(reducers, state, action) {
        return mapValues(reducers, (reducer, type) => reducer(state[type], action));
    }

    return function dbReducer(state, action) {
        if (typeof state === 'undefined') {
            return mapValues(reducerMap, () => ({}));
        }

        return callReducers(reducerMap, updateStore(state, action), action);
    };
}
