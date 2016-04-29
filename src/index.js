import './polyfill';

import configureStore from './store/configure_store';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import createRoutes from './create_routes';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history} routes={createRoutes(store)}></Router>
    </Provider>,
    document.getElementById('root')
);
