import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import dbReducer from './db';
import sessionReducer from './session';
import pageReducer from './page';
import formReducer from './form';
import analyticsReducer from './analytics';
import notificationReducer from './notification';
import alertReducer from './alert';
import systemReducer from './system';

export default combineReducers({
    routing: routerReducer,
    analytics: analyticsReducer,
    form: formReducer,
    db: dbReducer,
    session: sessionReducer,
    page: pageReducer,
    notification: notificationReducer,
    alert: alertReducer,
    system: systemReducer,
});
