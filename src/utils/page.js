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
            constructor() {
                super(...arguments);

                this.store = this.context.store;

                this.state = {
                    page: this.store.getState().page[pagePath]
                };

                this.handleStateChange = this.handleStateChange.bind(this);
            }

            handleStateChange() {
                const page = this.store.getState().page[pagePath];

                if (this.state.page === page) {
                    return;
                }

                this.setState({ page });
            }

            componentWillMount() {
                this.unsubscribe = this.store.subscribe(this.handleStateChange);

                return this.store.dispatch(pageWillMount({ pagePath }));
            }

            componentWillUnmount() {
                this.unsubscribe();

                return this.store.dispatch(pageWillUnmount({ pagePath }));
            }

            render() {
                return <Wrapped {...this.props} page={this.state.page} />;
            }
        }

        Wrapper.contextTypes = {
            store: PropTypes.shape({
                getState: PropTypes.func.isRequired
            }).isRequired
        };

        return Wrapper;
    };
}
