'use strict';

import createRoutes from '../../src/create_routes';
import configureStore from 'redux-mock-store';
import { Route } from 'react-router';

describe('createRoutes(store)', function() {
    it('should exist', function() {
        expect(createRoutes).toEqual(jasmine.any(Function));
    });

    describe('when called', function() {
        let store;
        let result;

        beforeEach(function() {
            store = configureStore([])({});

            result = createRoutes(store);
        });

        it('should return some routes', function() {
            expect(result.type).toBe(Route);
        });
    });
});
