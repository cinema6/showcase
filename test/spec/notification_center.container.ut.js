'use strict';

import {
    renderIntoDocument,
    findRenderedComponentWithType,
    scryRenderedComponentsWithType
} from 'react-addons-test-utils';
import React from 'react';
import NotificationCenter from '../../src/containers/NotificationCenter';
import { createStore } from 'redux';
import { removeNotification } from '../../src/actions/notification';
import { Provider } from 'react-redux';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import { cloneDeep as clone } from 'lodash';
import { TYPE } from '../../src/enums/notification';
import NotificationItem from '../../src/components/NotificationItem';

const proxyquire = require('proxyquire');

describe('NotificationCenter', function() {
    let notificationActions;
    let NotificationCenter;

    beforeEach(function() {
        notificationActions = {
            removeNotification: jasmine.createSpy('removeNotification()').and.callFake(removeNotification),

            __esModule: true
        };

        NotificationCenter = proxyquire('../../src/containers/NotificationCenter', {
            'react': React,

            '../components/NotificationItem': {
                default: NotificationItem,

                __esModule: true
            },
            '../actions/notification': notificationActions
        }).default;
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            state = {
                notification: {
                    items: [
                        {
                            id: createUuid(),
                            type: TYPE.SUCCESS,
                            message: 'It worked!'
                        },
                        {
                            id: createUuid(),
                            type: TYPE.DANGER,
                            message: 'It failed!'
                        },
                        {
                            id: createUuid(),
                            type: TYPE.INFO,
                            message: 'Just a heads-up!'
                        }
                    ]
                }
            };
            store = createStore(() => clone(state));
            spyOn(store, 'dispatch').and.callThrough();

            props = {

            };

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <NotificationCenter {...props} />
                </Provider>
            ), NotificationCenter.WrappedComponent);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should pass in the notification items', function() {
            expect(component.props).toEqual(jasmine.objectContaining({
                notifications: state.notification.items
            }));
        });

        it('should render a NotificationItem for each notification', function() {
            let items = scryRenderedComponentsWithType(component, NotificationItem);

            expect(items.length).toBe(component.props.notifications.length, 'Wrong number of NotificationItems.');
            items.forEach((item, index) => {
                expect(item.props.notification).toEqual(component.props.notifications[index]);

                notificationActions.removeNotification.calls.reset();
                item.props.onClose(item.props.notification.id);
                expect(notificationActions.removeNotification).toHaveBeenCalledWith(item.props.notification.id);
            });
        });

        describe('dispatch props', function() {
            let dispatchDeferred;

            beforeEach(function() {
                store.dispatch.and.returnValue((dispatchDeferred = defer()).promise);
            });

            describe('removeNotification()', function() {
                let id;
                let result;

                beforeEach(function() {
                    id = createUuid();
                    result = component.props.removeNotification(id);
                });

                it('should dispatch the logoutUser action', function() {
                    expect(notificationActions.removeNotification).toHaveBeenCalledWith(id);
                    expect(store.dispatch).toHaveBeenCalledWith(notificationActions.removeNotification.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });
        });
    });
});
