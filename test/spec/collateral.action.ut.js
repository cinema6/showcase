'use strict';

import { callAPI } from '../../src/actions/api';
import {
    GET_PRODUCT_DATA_START,
    GET_PRODUCT_DATA_SUCCESS,
    GET_PRODUCT_DATA_FAILURE
} from '../../src/actions/collateral';
import {
    format as formatURL
} from 'url';
import { getThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

describe('search actions', function() {
    let apiActions;
    let actions;
    let getProductData;

    beforeEach(function() {
        apiActions = {
            callAPI: jasmine.createSpy('callAPI()').and.callFake(callAPI),

            __esModule: true
        };
        actions = proxyquire('../../src/actions/collateral', {
            './api': apiActions
        });

        getProductData = actions.getProductData;
    });

    describe('getProductData({ uri })', function() {
        let uri;
        let thunk;

        beforeEach(function() {
            uri = 'https://itunes.apple.com/us/app/photo-coin-counter-photocoin/id763388830?mt=8&uo=4';

            thunk = getThunk(getProductData({ uri }));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue(Promise.resolve({}));
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should make a request to the collateral service', function() {
                expect(apiActions.callAPI).toHaveBeenCalledWith({
                    types: [GET_PRODUCT_DATA_START, GET_PRODUCT_DATA_SUCCESS, GET_PRODUCT_DATA_FAILURE],
                    endpoint: formatURL({
                        pathname: '/api/collateral/product-data',
                        query: { uri }
                    }),
                    method: 'GET'
                });
                expect(dispatch.calls.mostRecent().args[0]).toBe(apiActions.callAPI.calls.mostRecent().returnValue);
            });
        });
    });
});
