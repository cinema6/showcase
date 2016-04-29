'use strict';

import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import { Account } from '../../src/containers/Account';

const proxyquire = require('proxyquire');

describe('Account', function() {
    let renderer;
    let props;
    let dashboard;

    beforeEach(function() {
        renderer = ReactTestUtils.createRenderer();
        props = {
            children: (<div></div>)
        };

        renderer.render(<Account {...props} />);

        dashboard = renderer.getRenderOutput();
    });

    it('should exist', function() {
        expect(dashboard).toEqual(jasmine.any(Object));
    });
});

describe('ConnectedAccount', function() {
    let ConnectedAccount;
    let connect;

    beforeEach(function() {
        connect = jasmine.createSpy('connect()').and.callFake(require('react-redux').connect);

        ConnectedAccount = proxyquire('../../src/containers/Account', {
            'react-redux': {
                connect,

                __esModule: true
            }
        }).default;
    });

    it('should exist', function() {
        expect(ConnectedAccount).toEqual(jasmine.any(Function));
        expect(ConnectedAccount.name).toBe('Connect');
    });

    it('should connect the Dashboard', function() {
        expect(connect).toHaveBeenCalledWith();
    });
});
