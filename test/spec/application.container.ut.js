'use strict';

import React from 'react';
import Application from '../../src/containers/Application';
import { createStore } from 'redux';
import { mount } from 'enzyme';

describe('Application', function() {
    let store;
    let props;
    let component;

    beforeEach(function() {
        store = createStore(() => ({
            notification: {
                items: []
            },
            alert: {
                alerts: []
            }
        }));
        props = {
            children: <div />
        };

        component = mount(<Application {...props} />, {
            context: { store },
            attachTo: document.createElement('div')
        });
    });

    it('should exist', function() {
        expect(component.length).toEqual(1, 'Application is not rendered');
    });
});
