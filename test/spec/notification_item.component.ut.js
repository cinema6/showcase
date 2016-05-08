'use strict';

import React from 'react';
import NotificationItem from '../../src/components/NotificationItem';
import {
    renderIntoDocument,
    findRenderedDOMComponentWithTag,
    Simulate
} from 'react-addons-test-utils';
import { createUuid } from 'rc-uuid';
import { TYPE } from '../../src/enums/notification';

describe('NotificationItem', function() {
    describe('when rendered', function() {
        let props;
        let component;

        beforeEach(function() {
            props = {
                notification: {
                    id: createUuid(),
                    type: TYPE.SUCCESS,
                    message: 'Good job!'
                },

                onClose: jasmine.createSpy('onClose()')
            };

            component = renderIntoDocument(
                <NotificationItem {...props} />
            );
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        describe('when the close button is clicked', function() {
            let close;

            beforeEach(function() {
                close = findRenderedDOMComponentWithTag(component, 'button');

                Simulate.click(close);
            });

            it('should call onClose() with its id', function() {
                expect(props.onClose).toHaveBeenCalledWith(props.notification.id);
            });
        });
    });
});
