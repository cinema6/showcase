/* global process */

import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import promisify from '../middleware/promisify';
import history from '../history';
import promiseMiddleware from 'redux-promise-middleware';
import { middleware as fsaThunk } from '../middleware/fsa_thunk';

const middlewares = [
    promisify,
    fsaThunk,
    thunk,
    promiseMiddleware(),
    routerMiddleware(history),
];

if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable global-require */
    middlewares.push((log => (
        log({ duration: true, collapsed: true })
    ))(require('redux-logger')));
}

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(...middlewares));
}
