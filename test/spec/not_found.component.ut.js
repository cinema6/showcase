import React from 'react';
import {
    renderIntoDocument
} from 'react-addons-test-utils';
import NotFound from '../../src/components/NotFound';

describe('NotFound', function() {
    beforeEach(function() {
        this.component = renderIntoDocument(
            <NotFound />
        );
    });

    it('should exist', function() {
        expect(this.component).toEqual(jasmine.any(Object));
    });
});
