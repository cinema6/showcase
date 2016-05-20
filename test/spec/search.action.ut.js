'use strict';

import { callAPI } from '../../src/actions/api';
import {
    FIND_APPS_START,
    FIND_APPS_SUCCESS,
    FIND_APPS_FAILURE
} from '../../src/actions/search';
import { format as formatURL } from 'url';
import { CALL_API } from 'redux-api-middleware';

const proxyquire = require('proxyquire');

describe('search actions', function() {
    let apiActions;
    let actions;
    let findApps;

    beforeEach(function() {
        apiActions = {
            callAPI: jasmine.createSpy('callAPI()').and.callFake(callAPI),

            __esModule: true
        };
        actions = proxyquire('../../src/actions/search', {
            './api': apiActions
        });
        findApps = actions.findApps;
    });

    describe('findApps({ query, limit })', function() {
        let query, limit;
        let result;

        beforeEach(function() {
            query = 'my app';
            limit = 15;

            result = findApps({ query, limit });
        });

        it('should make a request to the search service', function() {
            expect(result[CALL_API]).toEqual(callAPI({
                types: [FIND_APPS_START, FIND_APPS_SUCCESS, FIND_APPS_FAILURE],
                endpoint: formatURL({
                    pathname: '/api/search/apps',
                    query: {
                        query,
                        limit
                    }
                }),
                method: 'GET'
            })[CALL_API]);
        });
    });
});
