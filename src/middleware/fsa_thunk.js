import { createAction } from 'redux-actions';

function prefix(type) {
    return `@@thunk/${type}`;
}

const EXECUTE = prefix('EXECUTE');
const execute = createAction(EXECUTE);

export function createThunk(actionCreator) {
    return function factory(...args) {
        return execute({
            fn: actionCreator,
            args,
        });
    };
}

export function getThunk(action) {
    const { type, payload } = action;

    if (type !== EXECUTE) {
        throw new Error('Action is not for a thunk.');
    }

    return payload.fn(...payload.args);
}

export const middleware = () => next => action => {
    const { type } = action;

    if (type === EXECUTE) {
        return next(getThunk(action));
    }

    return next(action);
};
