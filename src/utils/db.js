import { callAPI } from '../actions/api';
import {
    assign,
    mapValues,
    keyBy,
    omit,
} from 'lodash';
import { createAction } from 'redux-actions';
import { format as formatURL } from 'url';
import { createThunk } from '../middleware/fsa_thunk';

function prefix(action, type = '') {
    return `@@db${type ? (`:${type}`) : ''}/${action}`;
}

function getActionNames(method, type) {
    return {
        START: prefix(`${method}/START`, type),
        SUCCESS: prefix(`${method}/SUCCESS`, type),
        FAILURE: prefix(`${method}/FAILURE`, type),
    };
}

export const LIST = getActionNames('LIST');
export const GET = getActionNames('GET');
export const QUERY = getActionNames('QUERY');
export const CREATE = getActionNames('CREATE');
export const UPDATE = getActionNames('UPDATE');
export const REMOVE = getActionNames('REMOVE');

export function createDbActions({ type, endpoint, key = 'id', queries = {} }) {
    function call(config, id = null) {
        return callAPI(assign({}, config, {
            types: config.types.map(action => ({ type: action, meta: { type, key, id } })),
        }));
    }

    function getTypedActionNames(method) {
        return getActionNames(method, type);
    }

    function wrap(
        action,
        dispatch,
        factory,
        meta = result => ({ ids: result.map(item => item[key]) })
    ) {
        dispatch(createAction(action.START)());

        return factory().then(result => {
            dispatch(createAction(action.SUCCESS, null, meta)(result));

            return result;
        }).catch(reason => {
            dispatch(createAction(action.FAILURE)(reason));

            throw reason;
        });
    }

    const list = createThunk(() => (
        function thunk(dispatch) {
            return wrap(list, dispatch, () => dispatch(call({
                types: [LIST.START, LIST.SUCCESS, LIST.FAILURE],
                endpoint: formatURL({
                    pathname: endpoint,
                    query: queries.list,
                }),
                method: 'GET',
            })));
        }
    ));
    assign(list, getTypedActionNames('LIST'));

    const get = createThunk(({ id }) => (
        function thunk(dispatch) {
            return wrap(get, dispatch, () => dispatch(call({
                types: [GET.START, GET.SUCCESS, GET.FAILURE],
                endpoint: formatURL({
                    pathname: `${endpoint}/${id}`,
                    query: queries.get,
                }),
                method: 'GET',
            }, id)).then(item => [item]));
        }
    ));
    assign(get, getTypedActionNames('GET'));

    const query = createThunk(params => (
        function thunk(dispatch) {
            return wrap(query, dispatch, () => dispatch(call({
                types: [QUERY.START, QUERY.SUCCESS, QUERY.FAILURE],
                endpoint: formatURL({
                    pathname: endpoint,
                    query: assign({}, queries.query, params),
                }),
                method: 'GET',
            })));
        }
    ));
    assign(query, getTypedActionNames('QUERY'));

    const create = createThunk(({ data }) => (
        function thunk(dispatch) {
            return wrap(create, dispatch, () => dispatch(call({
                types: [CREATE.START, CREATE.SUCCESS, CREATE.FAILURE],
                endpoint: formatURL({
                    pathname: endpoint,
                    query: queries.create,
                }),
                method: 'POST',
                body: data,
            })).then(item => [item]));
        }
    ));
    assign(create, getTypedActionNames('CREATE'));

    const update = createThunk(({ data }) => {
        const id = data[key];

        return function thunk(dispatch) {
            if (!id) {
                return dispatch(createAction(update.FAILURE)(new Error(
                    `data must have a(n) ${key}`
                )));
            }

            return wrap(update, dispatch, () => dispatch(call({
                types: [UPDATE.START, UPDATE.SUCCESS, UPDATE.FAILURE],
                endpoint: formatURL({
                    pathname: `${endpoint}/${id}`,
                    query: queries.update,
                }),
                method: 'PUT',
                body: data,
            }, id)).then(item => [item]));
        };
    });
    assign(update, getTypedActionNames('UPDATE'));

    const remove = createThunk(({ id }) => (
        function thunk(dispatch) {
            return wrap(remove, dispatch, () => dispatch(call({
                types: [REMOVE.START, REMOVE.SUCCESS, REMOVE.FAILURE],
                endpoint: formatURL({
                    pathname: `${endpoint}/${id}`,
                    query: queries.remove,
                }),
                method: 'DELETE',
            }, id)).then(() => null), () => ({ ids: [id] }));
        }
    ));
    assign(remove, getTypedActionNames('REMOVE'));

    return { list, get, query, create, update, remove };
}

export function createDbReducer(reducerMap) {
    function add(state, { payload, meta: { key, type } }) {
        return assign({}, state, {
            [type]: assign({}, state[type], {
                [payload[key]]: payload,
            }),
        });
    }

    function addMany(state, { payload, meta: { key, type } }) {
        return assign({}, state, {
            [type]: assign({}, state[type], keyBy(payload, key)),
        });
    }

    function remove(state, { meta: { id, type } }) {
        return assign({}, state, {
            [type]: omit(state[type], [id]),
        });
    }

    function updateStore(state, action) {
        switch (action.type) {
        case LIST.SUCCESS:
        case QUERY.SUCCESS:
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
