'use strict';

import defer from 'promise-defer';
import { getProductData } from '../../src/actions/collateral';
import {
    PRODUCT_SELECTED,
    PRODUCT_EDITED,
    TARGETING_EDITED
} from '../../src/actions/product_wizard';
import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';

const proxyquire = require('proxyquire');

describe('product wizard actions', function() {
    let collateralActions;
    let actions;
    let productSelected, productEdited, targetingEdited;

    beforeEach(function() {
        collateralActions = {
            getProductData: jasmine.createSpy('getProductData()').and.callFake(getProductData),

            __esModule: true
        };
        actions = proxyquire('../../src/actions/product_wizard', {
            './collateral': collateralActions
        });
        productSelected = actions.productSelected;
        productEdited = actions.productEdited;
        targetingEdited = actions.targetingEdited;
    });

    describe('productSelected({ product })', function() {
        let product;
        let thunk;

        beforeEach(function() {
            product = {
                uri: 'https://itunes.apple.com/us/app/photo-coin-counter-photocoin/id763388830?mt=8&uo=4'
            };

            thunk = productSelected({ product });
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatchDeferred;
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                setTimeout(done);
            });

            it('should dispatch a call to getProductData()', function() {
                expect(collateralActions.getProductData).toHaveBeenCalledWith({ uri: product.uri });
                expect(dispatch.calls.all()[0].args[0]).toBe(collateralActions.getProductData.calls.mostRecent().returnValue);
            });

            it('should dispatch PRODUCT_SELECTED', function() {
                expect(dispatch).toHaveBeenCalledWith(createAction(PRODUCT_SELECTED)(dispatch.calls.all()[0].returnValue));
            });

            describe('when the data is fetched', function() {
                let product;

                beforeEach(function(done) {
                    product = { extID: createUuid() };
                    dispatchDeferred.resolve({ value: product });

                    setTimeout(done);
                });

                it('should fulfill with the product', function() {
                    expect(success).toHaveBeenCalledWith(product);
                });
            });

            describe('if there is a problem', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('Something went wrong!');
                    dispatchDeferred.reject({ reason });
                    setTimeout(done);
                });

                it('should reject with the reason', function() {
                    expect(failure).toHaveBeenCalledWith(reason);
                });
            });
        });
    });

    describe('productEdited({ data })', function() {
        let data;
        let result;

        beforeEach(function() {
            data = {
                name: 'The name',
                description: 'The description'
            };

            result = productEdited({ data });
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(PRODUCT_EDITED)(data));
        });
    });

    describe('targetingEdited({ data })', function() {
        let data;
        let result;

        beforeEach(function() {
            data = {
                gender: TARGETING.GENDER.FEMALE,
                age: TARGETING.AGE.EIGHTEEN_PLUS
            };

            result = targetingEdited({ data });
        });

        it('should return an FSA', function() {
            expect(result).toEqual(createAction(TARGETING_EDITED)(data));
        });
    });
});
