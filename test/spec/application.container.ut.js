'use strict';

import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import { Application } from '../../src/containers/Application';
import ConnectedApplication from '../../src/containers/Application';
import configureStore from 'redux-mock-store';

describe('Application', function() {
    let renderer;
    let props;
    let dashboard;

    beforeEach(function() {
        renderer = ReactTestUtils.createRenderer();
        props = {
            children: <div />
        };

        renderer.render(<Application {...props} />);

        dashboard = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(dashboard).toEqual(jasmine.any(Object));
    });
});

describe('ConnectedApplication', function() {
    let renderer;
    let dashboard;
    let store;

    beforeEach(function() {
        store = configureStore([])({});

        renderer = ReactTestUtils.createRenderer();
        renderer.render(
            <ConnectedApplication store={store} children={<div />}/>
        );

        dashboard = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(dashboard).toEqual(jasmine.any(Object));
    });
});
