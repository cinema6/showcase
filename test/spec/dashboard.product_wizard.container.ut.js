'use strict';

import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const proxyquire = require('proxyquire');

describe('ProductWizard', function() {
    let ProductWizard;

    beforeEach(function() {
        ProductWizard = proxyquire('../../src/containers/Dashboard/ProductWizard', {
            'react': React
        }).default;
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            state = {

            };
            store = createStore(() => state);

            props = {

            };

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <ProductWizard {...props} />
                </Provider>
            ), ProductWizard.WrappedComponent);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });
    });
});
