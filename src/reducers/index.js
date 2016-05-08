import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import dbReducer from './db';
import sessionReducer from './session';
import pageReducer from './page';
import formReducer from './form';
import notificationReducer from './notification';

export default combineReducers({
    routing: routerReducer,
    form: formReducer,
    db: dbReducer,
    session: sessionReducer,
    page: pageReducer,
    notification: notificationReducer
});
