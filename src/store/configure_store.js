/* global process */

import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import promisify from '../middleware/promisify';
import { hashHistory } from 'react-router';
import promiseMiddleware from 'redux-promise-middleware';

const middlewares = [
    promisify,
    thunk,
    promiseMiddleware(),
    routerMiddleware(hashHistory),
    apiMiddleware
];

if (process.env.NODE_ENV !== 'production') {
    middlewares.push((log => {
        return log({ duration: true, collapsed: true });
    })(require('redux-logger')));
}

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(...middlewares));
}
