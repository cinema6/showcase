'use strict';

import { isFSA } from 'flux-standard-action';

function unwrap(value) {
    return isFSA(value) ? value.payload : value;
}

function throwIfError(value) {
    if (value instanceof Error) {
        throw value;
    }

    return value;
}

const promisify = () => next => action => {
    return Promise.resolve(next(action)).then(result => {
        return throwIfError(unwrap(result));
    }).catch(reason => {
        const value = unwrap(reason);

        if (isFSA(reason)) {
            return throwIfError(value);
        }

        throw value;
    });
};

export default promisify;
