import { createAction } from 'redux-actions';

function prefix(type) {
    return `VIDEO_PREVIEW/${type}`;
}

export const ADD_VIDEO = prefix('ADD_VIDEO');
export const addVideo = createAction(ADD_VIDEO);
