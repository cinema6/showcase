'use strict';

import { createThunk } from '../middleware/fsa_thunk';
import { createAction } from 'redux-actions';
import {
    defaultsDeep as defaults,
    pick,
    merge,
    omit,
    noop
} from 'lodash';

const HTTP = {
    GET: 'GET'
};
const MIME = {
    JSON: 'application/json'
};
const CREDENTIALS = {
    SAME_ORIGIN: 'same-origin'
};
const HEADER = {
    CONTENT_TYPE: 'Content-Type'
};

function meta(body = null, response = null, meta = noop) {
    return merge(pick(response, ['status', 'ok', 'statusText', 'headers']), meta(response, body));
}

function getBody(response) {
    return response.text().then(text => {
        try { return JSON.parse(text); } catch (error) { return text; }
    });
}

function getTypes(types) {
    return types.map(type => {
        if (typeof type === 'string') {
            type = { type };
        }

        const meta = type.meta;

        return merge(defaults({}, type), {
            meta: !meta ? noop : (typeof meta !== 'function' ? () => meta : meta)
        });
    });
}

export class StatusCodeError extends Error {
    constructor(status, body) {
        super();

        this.name = 'StatusCodeError';
        this.message = `${status} - ${JSON.stringify(body)}`;
        this.response = body;
        this.status = status;
    }
}

export const callAPI = createThunk(config => dispatch => {
    const { endpoint, body, types } = config;
    const [start, success, failure] = getTypes(types);
    const requestStart = createAction(start.type, null, meta);
    const requestSuccess = createAction(success.type, null, meta);
    const requestFailure = createAction(failure.type, null, meta);

    dispatch(requestStart(null, null, start.meta));

    return fetch(endpoint, merge(defaults(omit(config, ['endpoint', 'types']), {
        method: HTTP.GET,
        headers: {
            [HEADER.CONTENT_TYPE]: MIME.JSON
        },
        credentials: CREDENTIALS.SAME_ORIGIN
    }), {
        body: body && JSON.stringify(body)
    })).then(response => getBody(response).then(body => {
        if (!response.ok) {
            const error = new StatusCodeError(response.status, body);

            return dispatch(requestFailure(error, response, failure.meta));
        }

        return dispatch(requestSuccess(body, response, success.meta));
    })).catch(reason => dispatch(requestFailure(reason)));
});
