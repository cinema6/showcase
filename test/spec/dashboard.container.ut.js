'use strict';

import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import { Dashboard } from '../../src/containers/Dashboard';
import { logoutUser } from '../../src/actions/dashboard';

const proxyquire = require('proxyquire');

describe('Dashboard', function() {
    let renderer;
    let props;
    let dashboard;

    beforeEach(function() {
        renderer = ReactTestUtils.createRenderer();
        props = {
            logoutUser: jasmine.createSpy('logoutUser()')
        };

        renderer.render(<Dashboard {...props} />);

        dashboard = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(dashboard).toEqual(jasmine.any(Object));
    });
});

describe('ConnectedDashboard', function() {
    let ConnectedDashboard;
    let connect;

    beforeEach(function() {
        connect = jasmine.createSpy('connect()').and.callFake(require('react-redux').connect);

        ConnectedDashboard = proxyquire('../../src/containers/Dashboard', {
            'react-redux': {
                connect,

                __esModule: true
            },

            '../../actions/dashboard': {
                logoutUser,

                __esModule: true
            }
        }).default;
    });

    it('should exist', function() {
        expect(ConnectedDashboard).toEqual(jasmine.any(Function));
        expect(ConnectedDashboard.name).toBe('Connect');
    });

    it('should connect the Dashboard', function() {
        expect(connect).toHaveBeenCalledWith(null, {
            logoutUser
        });
    });
});
