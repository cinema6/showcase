'use strict';

import { createPageReducer, pageify } from '../../src/utils/page';
import { pageWillMount, pageWillUnmount } from '../../src/actions/page';
import { assign } from 'lodash';
import { createAction } from 'redux-actions';
import React, { Component } from 'react';
import { unmountComponentAtNode, findDOMNode } from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const DASHBOARD_INITIAL_STATE = {
    showPanel: false,
    doStuff: true
};
const ACCOUNT_PROFILE_INITIAL_STATE = {
    showMessages: false,
    foo: 'bar'
};

describe('createPageReducer(reducerMap)', function() {
    let reducerMap;
    let reducer;

    beforeEach(function() {
        reducerMap = {
            'dashboard': jasmine.createSpy('dashboard()').and.callFake((state = DASHBOARD_INITIAL_STATE, action = {}) => {
                switch (action.type) {
                default:
                    return state;
                }
            }),
            'account.profile': jasmine.createSpy('account.profile()').and.callFake((state = ACCOUNT_PROFILE_INITIAL_STATE, action = {}) => {
                switch (action.type) {
                case 'SET_FOO':
                    return assign({}, state, {
                        foo: action.payload
                    });
                default:
                    return state;
                }
            })
        };

        reducer = createPageReducer(reducerMap);
    });

    it('should return a reducer', function() {
        expect(reducer).toEqual(jasmine.any(Function));
    });

    describe('when initialized', function() {
        let state;

        beforeEach(function() {
            state = reducer();
        });

        it('should return an object', function() {
            expect(state).toEqual({});
        });

        it('should not call any page reducers', function() {
            expect(reducerMap.dashboard).not.toHaveBeenCalled();
            expect(reducerMap['account.profile']).not.toHaveBeenCalled();
        });
    });

    describe('when a page will mount', function() {
        let state, newState;

        beforeEach(function() {
            state = {
                'account.profile': ACCOUNT_PROFILE_INITIAL_STATE
            };

            newState = reducer(state, pageWillMount({ pagePath: 'dashboard' }));
        });

        it('should initialize the reducer for that page', function() {
            expect(reducerMap['dashboard']).toHaveBeenCalledWith(undefined, {});
            expect(reducerMap['account.profile']).not.toHaveBeenCalled();
            expect(newState).toEqual(assign({}, state, {
                dashboard: DASHBOARD_INITIAL_STATE
            }));
        });

        describe('that is unknown', function() {
            beforeEach(function() {
                newState = reducer(state, pageWillMount({ pagePath: 'sjkdhfds' }));
            });

            it('should do nothing', function() {
                expect(newState).toEqual(state);
            });
        });
    });

    describe('when a page will unmount', function() {
        let state, newState;

        beforeEach(function() {
            state = {
                'account.profile': ACCOUNT_PROFILE_INITIAL_STATE,
                dashboard: DASHBOARD_INITIAL_STATE
            };

            newState = reducer(state, pageWillUnmount({ pagePath: 'dashboard' }));
        });

        it('should remove that page\'s object', function() {
            expect(reducerMap['dashboard']).not.toHaveBeenCalled();
            expect(reducerMap['account.profile']).not.toHaveBeenCalled();
            expect(newState).toEqual({
                'account.profile': ACCOUNT_PROFILE_INITIAL_STATE
            });
        });

        describe('that is unknown', function() {
            beforeEach(function() {
                newState = reducer(state, pageWillUnmount({ pagePath: 'sjkdhfds' }));
            });

            it('should do nothing', function() {
                expect(newState).toEqual(state);
            });
        });
    });

    describe('when other actions arrive', function() {
        let action;
        let state, newState;

        beforeEach(function() {
            action = createAction('SET_FOO')('hello!');
            state = {
                'account.profile': ACCOUNT_PROFILE_INITIAL_STATE
            };

            newState = reducer(state, action);
        });

        it('should call the reducer for the active pages', function() {
            expect(reducerMap['account.profile']).toHaveBeenCalledWith(state['account.profile'], action);
            expect(reducerMap.dashboard).not.toHaveBeenCalled();
            expect(newState).toEqual(assign({}, state, {
                'account.profile': assign({}, ACCOUNT_PROFILE_INITIAL_STATE, {
                    foo: 'hello!'
                })
            }));
        });
    });
});

describe('pageify', function() {
    let Page;
    let path;
    let wrapped;

    class MyComponent extends Component {
        constructor() {
            super(...arguments);
            wrapped = this;
        }

        render() {
            return <div>Hello world!</div>;
        }
    }

    beforeEach(function() {
        path = 'my.page';

        Page = pageify({ path })(MyComponent);
    });

    it('should return a Component', function() {
        expect(Page).toEqual(jasmine.any(Function));
    });

    describe('when mounted', function() {
        let store;
        let component;
        let props;
        let state;

        class Renderer extends Component {
            render() {
                return <Provider store={store}>
                    <Page ref="page" {...props} />
                </Provider>;
            }
        }

        beforeEach(function() {
            props = {
                foo: 'bar',
                hello: 'world'
            };

            state = {
                page: {
                    [path]: {
                        foo: 'bar'
                    }
                }
            };

            store = createStore(() => state);
            spyOn(store, 'dispatch').and.callThrough();

            spyOn(store, 'subscribe').and.callThrough();

            component = renderIntoDocument(<Renderer />).refs.page;
        });

        it('should render the wrapped component', function() {
            expect(wrapped).toEqual(jasmine.any(Object));
        });

        it('should pass props to the wrapped class', function() {
            expect(wrapped.props).toEqual(assign({}, props, {
                page: component.state.page
            }));
        });

        it('should dispatch pageWillMount()', function() {
            expect(store.dispatch).toHaveBeenCalledWith(pageWillMount({ pagePath: path }));
        });

        it('should copy the page state to its own state', function() {
            expect(component.state.page).toBe(state.page[path]);
        });

        it('should register a listener with the store', function() {
            expect(store.subscribe).toHaveBeenCalledWith(component.handleStateChange);
            expect(component.unsubscribe).toBe(store.subscribe.calls.mostRecent().returnValue);
        });

        describe('and then unmounted', function() {
            beforeEach(function() {
                store.dispatch.calls.reset();
                spyOn(component, 'unsubscribe').and.callThrough();

                unmountComponentAtNode(findDOMNode(component).parentNode);
            });

            it('should dispatch pageWillUnmount()', function() {
                expect(store.dispatch).toHaveBeenCalledWith(pageWillUnmount({ pagePath: path }));
            });

            it('should unsubscribe', function() {
                expect(component.unsubscribe).toHaveBeenCalledWith();
            });
        });

        describe('methods:', function() {
            describe('handleStateChange()', function() {
                let handleStateChange;

                beforeEach(function() {
                    spyOn(component, 'setState').and.callThrough();

                    handleStateChange = component.handleStateChange;
                });

                describe('if the page has changed', function() {
                    beforeEach(function() {
                        state.page[path] = { it: 'changed' };

                        handleStateChange();
                    });

                    it('should setState() with the new page', function() {
                        expect(component.setState).toHaveBeenCalledWith({ page: state.page[path] });
                    });
                });

                describe('if the page has not changed', function() {
                    beforeEach(function() {
                        handleStateChange();
                    });

                    it('should not call setState()', function() {
                        expect(component.setState).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
