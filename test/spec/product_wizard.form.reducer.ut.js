'use strict';

import productWizardReducer from '../../src/reducers/form/product_wizard';
import {
    PRODUCT_SELECTED
} from '../../src/actions/product_wizard';
import { createAction } from 'redux-actions';

describe('productWizardReducer()', function() {
    let state;

    beforeEach(function() {
        state = {};
    });

    it('should return the state passed to it', function() {
        expect(productWizardReducer(state, createAction('FOO')())).toBe(state);
    });

    describe('handling actions', function() {
        let newState;

        describe(`${PRODUCT_SELECTED}_PENDING`, function() {
            beforeEach(function() {
                newState = productWizardReducer(state, createAction(`${PRODUCT_SELECTED}_PENDING`)());
            });

            it('should return undefined', function() {
                expect(newState).toBeUndefined();
            });
        });
    });
});
