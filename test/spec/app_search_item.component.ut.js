'use strict';

import AppSearchItem from '../../src/components/AppSearchItem';
import { renderIntoDocument } from 'react-addons-test-utils';
import React from 'react';

describe('AppSearchItem', function() {
    describe('when rendered', function() {
        let props, component;

        beforeEach(function() {
            props = {
                findProducts: jasmine.createSpy('findProducts()').and.returnValue(Promise.resolve([])),
                suggestion: {},
                active: false
            };

            component = renderIntoDocument(
                <AppSearchItem {...props} />
            );
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });
    });
});
