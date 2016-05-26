import dashboardAddProductReducer from '../../src/reducers/page/dashboard/add_product';
import { assign } from 'lodash';
import { createAction } from 'redux-actions';
import {
    PRODUCT_SELECTED,
    WIZARD_COMPLETE,
    GO_TO_STEP,
    PREVIEW_LOADED
} from '../../src/actions/product_wizard';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';

describe('dashboardAddProductReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardAddProductReducer(undefined, 'INIT')).toEqual({
            step: 0,
            previewLoaded: false,
            productData: null,
            targeting: {
                age: [TARGETING.AGE.ALL],
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
                previewLoaded: false,
                targeting: {
                    age: [TARGETING.AGE.ALL],
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
                    age: TARGETING.AGE.TEENS,
                    gender: TARGETING.GENDER.MALE
                };
                state.previewLoaded = true;

                action = createAction(`${PRODUCT_SELECTED}_PENDING`)();
                newState = dashboardAddProductReducer(state, action);
            });

            it('should set productData back to null, targeting back to the default and previewLoaded to false', function() {
                expect(newState).toEqual(assign({}, state, {
                    productData: null,
                    previewLoaded: false,
                    targeting: {
                        age: [TARGETING.AGE.ALL],
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

        describe(GO_TO_STEP, function() {
            let step;

            beforeEach(function() {
                step = 3;

                action = createAction(GO_TO_STEP)(step);
                newState = dashboardAddProductReducer(state, action);
            });

            it('should move to the specified step', function() {
                expect(newState).toEqual(assign({}, state, {
                    step
                }));
            });
        });

        describe(WIZARD_COMPLETE, function() {
            let productData, targeting;

            beforeEach(function() {
                productData = {
                    name: 'The name of my app',
                    description: 'A description of my app'
                };
                targeting = {
                    age: [TARGETING.AGE.TEENS],
                    gender: TARGETING.GENDER.FEMALE
                };

                state.productData = {
                    name: 'Default name',
                    description: 'default description',
                    categories: ['Games', 'Action'],
                    images: []
                };

                action = createAction(WIZARD_COMPLETE)({ productData, targeting });
                newState = dashboardAddProductReducer(state, action);
            });

            it('should update the productData and targeting and move to step 3', function() {
                expect(newState).toEqual(assign({}, state, {
                    productData: assign({}, state.productData, productData),
                    targeting
                }));
            });

            describe('if the targeting options are not defined', function() {
                beforeEach(function() {
                    targeting.age = undefined;
                    targeting.gender = undefined;

                    newState = dashboardAddProductReducer(state, action);
                });

                it('should use targeting defaults', function() {
                    expect(newState).toEqual(jasmine.objectContaining({
                        targeting: {
                            age: [TARGETING.AGE.ALL],
                            gender: TARGETING.GENDER.ALL
                        }
                    }));
                });
            });
        });

        describe(PREVIEW_LOADED, function() {
            beforeEach(function() {
                this.action = createAction(PREVIEW_LOADED)();
                state.previewLoaded = false;

                this.newState = dashboardAddProductReducer(state, this.action);
            });

            it('should set previewLoaded to true', function() {
                expect(this.newState).toEqual(assign({}, state, {
                    previewLoaded: true
                }));
            });
        });
    });
});
