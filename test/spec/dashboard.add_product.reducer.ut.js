import dashboardAddProductReducer from '../../src/reducers/page/dashboard/add_product';
import { assign } from 'lodash';
import { createAction } from 'redux-actions';
import {
    PRODUCT_SELECTED,
    PRODUCT_EDITED,
    TARGETING_EDITED
} from '../../src/actions/product_wizard';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';

describe('dashboardAddProductReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardAddProductReducer(undefined, 'INIT')).toEqual({
            step: 0,
            productData: null,
            targeting: {
                age: TARGETING.AGE.ALL,
                gender: TARGETING.GENDER.ALL
            }
        });
    });

    describe('handling actions', function() {
        let state, action;
        let newState;

        beforeEach(function() {
            state = {
                step: 0,
                productData: null,
                targeting: {
                    age: TARGETING.AGE.ALL,
                    gender: TARGETING.GENDER.ALL
                }
            };
        });

        describe(`${PRODUCT_SELECTED}_PENDING`, function() {
            beforeEach(function() {
                state.productData = {
                    extID: createUuid(),
                    name: 'My App',
                    description: 'It rules!'
                };
                state.targeting = {
                    age: TARGETING.AGE.THIRTEEN_PLUS,
                    gender: TARGETING.GENDER.MALE
                };

                action = createAction(`${PRODUCT_SELECTED}_PENDING`)();
                newState = dashboardAddProductReducer(state, action);
            });

            it('should set productData back to null and targeting back to the default', function() {
                expect(newState).toEqual(assign({}, state, {
                    productData: null,
                    targeting: {
                        age: TARGETING.AGE.ALL,
                        gender: TARGETING.GENDER.ALL
                    }
                }));
            });
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

        describe(TARGETING_EDITED, function() {
            let data;

            beforeEach(function() {
                data = {
                    age: TARGETING.AGE.ZERO_TO_TWELVE,
                    gender: TARGETING.GENDER.FEMALE
                };

                action = createAction(TARGETING_EDITED)(data);
                newState = dashboardAddProductReducer(state, action);
            });

            it('should update the targeting and move to step 3', function() {
                expect(newState).toEqual(assign({}, state, {
                    step: 3,
                    targeting: assign({}, state.targeting, data)
                }));
            });
        });
    });
});
