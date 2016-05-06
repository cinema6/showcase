'use strict';

import AppSearchItem from '../../src/components/AppSearchItem';
import { renderIntoDocument } from 'react-addons-test-utils';
import React from 'react';

describe('AppSearchItem', function() {
    describe('when rendered', function() {
        let props, component;

        beforeEach(function() {
            props = {
                suggestion: {
                    title: 'Scybot Coin Counter',
                    developer: 'Scybot Technologies, L.L.C.',
                    thumbnail: 'http://is2.mzstatic.com/image/thumb/Purple/v4/ff/3d/0f/ff3d0ffb-3d7e-7a5d-a93e-37e9d9def605/source/100x100bb.jpg',
                    category: 'Utilities',
                    price: 'Free',
                    rating: 2.5,
                    uri: 'https://itunes.apple.com/us/app/scybot-coin-counter/id445453916?mt=8&uo=4',
                    productDataURI: 'http://localhost:9000/api/collateral/product-data?uri=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fscybot-coin-counter%2Fid445453916%3Fmt%3D8%26uo%3D4'
                }
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
