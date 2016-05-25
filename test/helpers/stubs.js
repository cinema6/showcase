/* global jasmine */

import defer from 'promise-defer';
import _, { isEqual } from 'lodash';
import { createThunk } from '../../src/middleware/fsa_thunk';

const EXECUTE = createThunk()().type;

export function dispatch() {
    const deferreds = new WeakMap();
    const stub = jasmine.createSpy('dispatch()').and.callFake(action => {
        if (action.type === EXECUTE) {
            const deferred = defer();
            const items = deferreds.get(action.payload.fn) || [];

            items.push({
                args: action.payload.args,
                deferred
            });

            deferreds.set(action.payload.fn, items);

            return deferred.promise;
        }

        if (!(action.payload instanceof Promise)) {
            return Promise.resolve(action.payload);
        } else {
            return action.payload.then(value => ({ value, action }))
                .catch(reason => Promise.reject({ reason, action }));
        }
    });
    stub.getDeferreds = function(action) {
        if (!action || action.type !== EXECUTE) { return null; }

        return _(deferreds.get(action.payload.fn) || [])
            .filter(item => isEqual(item.args, action.payload.args))
            .map('deferred')
            .value();
    };
    stub.getDeferred = function(action) {
        return stub.getDeferreds(action)[0] || null;
    };

    return stub;
}
