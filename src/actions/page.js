'use strict';

import { createAction } from 'redux-actions';

function prefix(type) {
    return `@@page/${type}`;
}

export const WILL_MOUNT = prefix('WILL_MOUNT');
export const pageWillMount = createAction(WILL_MOUNT, ({ pagePath }) => ({
    path: pagePath
}));

export const WILL_UNMOUNT = prefix('WILL_UNMOUNT');
export const pageWillUnmount = createAction(WILL_UNMOUNT, ({ pagePath }) => ({
    path: pagePath
}));
