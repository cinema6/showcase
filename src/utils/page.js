'use strict';

import {
    WILL_MOUNT,
    WILL_UNMOUNT
} from '../actions/page';
import { pageWillMount, pageWillUnmount } from '../actions/page';
import { assign, omit, mapValues } from 'lodash';
import React, { Component, PropTypes } from 'react';

export function createPageReducer(reducerMap) {
    return function pageReducer(state = {}, action = {}) {
        switch (action.type) {
        case WILL_MOUNT:
            if (!reducerMap[action.payload.path]) { return state; }

            return assign({}, state, {
                [action.payload.path]: reducerMap[action.payload.path](undefined, {})
            });
        case WILL_UNMOUNT:
            return omit(state, [action.payload.path]);
        default:
            return mapValues(state, (value, key) => reducerMap[key](value, action));
        }
    };
}

export function pageify({ path: pagePath }) {
    return function Page(Wrapped) {
        class Wrapper extends Component {
            componentWillMount() {
                return this.props.dispatch(pageWillMount({ pagePath }));
            }

            componentWillUnmount() {
                return this.props.dispatch(pageWillUnmount({ pagePath }));
            }

            render() {
                const state = this.context.store.getState();
                const page = state.page[pagePath];

                return <Wrapped {...this.props} page={page} />;
            }
        }

        Wrapper.propTypes = {
            dispatch: PropTypes.func.isRequired
        };
        Wrapper.contextTypes = {
            store: PropTypes.shape({
                getState: PropTypes.func.isRequired
            }).isRequired
        };

        return Wrapper;
    };
}
