import { renderIntoDocument } from 'react-addons-test-utils';
import PaymentMethod from '../../src/components/PaymentMethod';
import React from 'react';

describe('PaymentMethod', function() {
    let props;
    let component;

    beforeEach(function() {
        props = {
            method: {

            },
            onChangeMethod: jasmine.createSpy('onChangeMethod()')
        };

        component = renderIntoDocument(<PaymentMethod {...props} />);
    });

    it('should exist', function() {
        expect(component).toEqual(jasmine.any(Object));
    });
});
