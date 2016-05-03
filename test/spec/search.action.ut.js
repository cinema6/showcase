'use strict';

import { callAPI } from '../../src/actions/api';
import {
    FIND_APPS_START,
    FIND_APPS_SUCCESS,
    FIND_APPS_FAILURE
} from '../../src/actions/search';
import { format as formatURL } from 'url';

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
        let thunk;

        beforeEach(function() {
            query = 'my app';
            limit = 15;

            thunk = findApps({ query, limit });
        });

        it('should return a Function', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when expected', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue(new Promise(() => {}));
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should make a request to the search service', function() {
                expect(apiActions.callAPI).toHaveBeenCalledWith({
                    types: [FIND_APPS_START, FIND_APPS_SUCCESS, FIND_APPS_FAILURE],
                    endpoint: formatURL({
                        pathname: '/api/search/apps',
                        query: {
                            query,
                            limit
                        }
                    }),
                    method: 'GET'
                });
                expect(dispatch.calls.mostRecent().args[0]).toBe(apiActions.callAPI.calls.mostRecent().returnValue);
            });
        });
    });
});
