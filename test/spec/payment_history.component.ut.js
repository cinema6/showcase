import { renderIntoDocument } from 'react-addons-test-utils';
import PaymentHistory from '../../src/components/PaymentHistory';
import React from 'react';

describe('PaymentHistory', function() {
    let props;
    let component;

    beforeEach(function() {
        props = {
            payments: []
        };

        component = renderIntoDocument(<PaymentHistory {...props} />);
    });

    it('should exist', function() {
        expect(component).toEqual(jasmine.any(Object));
    });
});
