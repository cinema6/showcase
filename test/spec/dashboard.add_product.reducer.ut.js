import dashboardAddProductReducer from '../../src/reducers/page/dashboard/add_product';
import { assign } from 'lodash';
import { createAction } from 'redux-actions';
import {
    PRODUCT_SELECTED,
    PRODUCT_EDITED
} from '../../src/actions/product_wizard';
import { createUuid } from 'rc-uuid';

describe('dashboardAddProductReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardAddProductReducer(undefined, 'INIT')).toEqual({
            step: 0,
            productData: null
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                step: 0,
                productData: null
            };
        });

        describe(`${PRODUCT_SELECTED}_FULFILLED`, function() {
            let product;

            beforeEach(function() {
                product = {
                    extID: createUuid(),
                    name: 'My App',
                    description: 'It rules!'
                };
                action = createAction(`${PRODUCT_SELECTED}_FULFILLED`)(product);

                newState = dashboardAddProductReducer(state, action);
            });

            it('should save the product and move to step 1', function() {
                expect(newState).toEqual(assign({}, state, {
                    step: 1,
                    productData: product
                }));
            });
        });

        describe(PRODUCT_EDITED, function() {
            let data;

            beforeEach(function() {
                state.productData = {
                    extID: createUuid(),
                    name: 'foo',
                    description: 'bar'
                };

                data = { name: 'A Good Name', description: 'A Good Description' };

                action = createAction(PRODUCT_EDITED)(data);
                newState = dashboardAddProductReducer(state, action);
            });

            it('should update the product and move to step 2', function() {
                expect(newState).toEqual(assign({}, state, {
                    step: 2,
                    productData: assign({}, state.productData, data)
                }));
            });
        });
    });
});
