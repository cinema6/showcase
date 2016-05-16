'use strict';

import { CALL_API, ApiError } from 'redux-api-middleware';
import { defaultsDeep as defaults, merge, isString } from 'lodash';

function createStartPayload() {
    return undefined;
}

function processResponse(action, state, res) {
    return res.text().then(text => {
        try { return JSON.parse(text); } catch(e) { return text; }
    });
}

function processFailureResponse(action, state, res) {
    return processResponse(action, state, res)
        .then(response => new ApiError(res.status, res.statusText, response));
}

const PAYLOAD_PROCESSORS = [
    createStartPayload,
    processResponse,
    processFailureResponse
];

export function callAPI(config) {
    return {
        [CALL_API]: merge(defaults({}, config, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'
        }), {
            body: JSON.stringify(config.body),
            types: config.types.map((type, index) => {
                let config = type;

                if (isString(type)) {
                    config = { type };
                }

                return defaults({}, config, {
                    payload: PAYLOAD_PROCESSORS[index]
                });
            })
        })
    };
}
