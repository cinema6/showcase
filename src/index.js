import './polyfill';

import configureStore from './store/configure_store';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import createRoutes from './create_routes';
import history from './history';

const store = configureStore();
const routes = createRoutes(store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={syncHistoryWithStore(history, store)} routes={routes} />
    </Provider>,
    document.getElementById('root')
);
