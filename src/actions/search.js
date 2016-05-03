'use strict';

import { callAPI } from './api';
import {
    format as formatURL
} from 'url';

function prefix(type) {
    return `SEARCH/${type}`;
}

export const FIND_APPS_START = prefix('FIND_APPS_START');
export const FIND_APPS_SUCCESS = prefix('FIND_APPS_SUCCESS');
export const FIND_APPS_FAILURE = prefix('FIND_APPS_FAILURE');
export function findApps({ query, limit }) {
    return function thunk(dispatch) {
        return dispatch(callAPI({
            types: [FIND_APPS_START, FIND_APPS_SUCCESS, FIND_APPS_FAILURE],
            endpoint: formatURL({
                pathname: '/api/search/apps',
                query: { query, limit }
            }),
            method: 'GET'
        }));
    };
}
