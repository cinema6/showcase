import dashboardAddProductReducer from '../../src/reducers/page/dashboard/add_product';
import { assign } from 'lodash';
import { createAction } from 'redux-actions';
import {
    PRODUCT_SELECTED,
    GO_TO_STEP,
    PREVIEW_LOADED,
    COLLECT_PAYMENT,
    TOGGLE_LANDSCAPE
} from '../../src/actions/product_wizard';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';

describe('dashboardAddProductReducer()', function() {
    it('should return some initial state for the page', function() {
        expect(dashboardAddProductReducer(undefined, 'INIT')).toEqual({
            step: 0,
            previewLoaded: false,
            checkingIfPaymentRequired: false,
            productData: null,
            targeting: {
                age: [TARGETING.AGE.ALL],
                gender: TARGETING.GENDER.ALL
            },
            landscape: false
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
                checkingIfPaymentRequired: false,
                targeting: {
                    age: [TARGETING.AGE.ALL],
                    gender: TARGETING.GENDER.ALL
                },
                landscape: false
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

        describe(TOGGLE_LANDSCAPE, function() {
            let landscape;

            beforeEach(function() {
                landscape = false;

                action = createAction(TOGGLE_LANDSCAPE)();
                newState = dashboardAddProductReducer(state, action);
            });

            it('should toggle landscape', function() {
                expect(newState).toEqual(assign({}, state, {
                    landscape: !landscape
                }));
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

        describe(`${COLLECT_PAYMENT}_PENDING`, function() {
            beforeEach(function() {
                this.action = createAction(`${COLLECT_PAYMENT}_PENDING`)();

                this.newState = dashboardAddProductReducer(state, this.action);
            });

            it('should set checkingIfPaymentRequired to true', function() {
                expect(this.newState).toEqual(assign({}, state, {
                    checkingIfPaymentRequired: true
                }));
            });
        });

        describe(`${COLLECT_PAYMENT}_FULFILLED`, function() {
            beforeEach(function() {
                this.action = createAction(`${COLLECT_PAYMENT}_FULFILLED`)();
                state.checkingIfPaymentRequired = true;

                this.newState = dashboardAddProductReducer(state, this.action);
            });

            it('should set checkingIfPaymentRequired to false', function() {
                expect(this.newState).toEqual(assign({}, state, {
                    checkingIfPaymentRequired: false
                }));
            });
        });

        describe(`${COLLECT_PAYMENT}_REJECTED`, function() {
            beforeEach(function() {
                this.action = createAction(`${COLLECT_PAYMENT}_REJECTED`)();
                state.checkingIfPaymentRequired = true;

                this.newState = dashboardAddProductReducer(state, this.action);
            });

            it('should make checkingIfPaymentRequired to false', function() {
                expect(this.newState).toEqual(assign({}, state, {
                    checkingIfPaymentRequired: false
                }));
            });
        });
    });
});
