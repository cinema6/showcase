import { createThunk } from '../middleware/fsa_thunk';
import { createAction } from 'redux-actions';
import {
    defaultsDeep as defaults,
    pick,
    merge,
    omit,
    noop,
} from 'lodash';
import { parse as parseURL } from 'url';

const HTTP = {
    GET: 'GET',
};
const MIME = {
    JSON: 'application/json',
};
const CREDENTIALS = {
    SAME_ORIGIN: 'same-origin',
};
const HEADER = {
    CONTENT_TYPE: 'Content-Type',
};

function meta(body = null, response = null, metaFn = noop) {
    return merge(pick(response, ['status', 'ok', 'statusText', 'headers']), metaFn(response, body));
}

function getBody(response) {
    return response.text().then(text => {
        try { return JSON.parse(text); } catch (error) { return text; }
    });
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTypes(types) {
    return types.map(type => {
        const config = typeof type === 'string' ? { type } : type;

        return merge(defaults({}, config), {
            meta: (metaProp => {
                if (!metaProp) { return noop; }

                return typeof metaProp === 'function' ? metaProp : () => metaProp;
            })(config.meta),
        });
    });
}

function checkFor202(response, remainingChecks) {
    const { hostname } = parseURL(response.url);

    if (remainingChecks === 0) {
        return Promise.reject(new Error('Timed out waiting for job to complete.'));
    }

    return getBody(response).then(body => {
        if (response.status === 202 && hostname === window.location.hostname) {
            return wait(2000).then(() => fetch(body.url, {
                method: HTTP.GET,
                headers: {
                    [HEADER.CONTENT_TYPE]: MIME.JSON,
                },
                credentials: CREDENTIALS.SAME_ORIGIN,
            })).then(resp => checkFor202(resp, remainingChecks - 1));
        }

        return [response, body];
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
            [HEADER.CONTENT_TYPE]: MIME.JSON,
        },
        credentials: CREDENTIALS.SAME_ORIGIN,
    }), {
        body: body && JSON.stringify(body),
    })).then(response => checkFor202(response, 15)).then(([response, responseBody]) => {
        if (!response.ok) {
            const error = new StatusCodeError(response.status, responseBody);

            return dispatch(requestFailure(error, response, failure.meta));
        }

        return dispatch(requestSuccess(responseBody, response, success.meta));
    })
    .catch(reason => dispatch(requestFailure(reason)));
});
