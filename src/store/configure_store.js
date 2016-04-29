import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import promisify from '../middleware/promisify';
import { hashHistory } from 'react-router';
import log from 'redux-logger';

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(
        promisify,
        thunk,
        routerMiddleware(hashHistory),
        apiMiddleware,
        log({ duration: true, collapsed: true })
    ));
}
