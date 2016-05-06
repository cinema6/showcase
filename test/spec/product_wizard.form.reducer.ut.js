'use strict';

import productWizardReducer from '../../src/reducers/form/product_wizard';
import {
    PRODUCT_SELECTED,
    WIZARD_DESTROYED
} from '../../src/actions/product_wizard';
import { createAction } from 'redux-actions';

describe('productWizardReducer()', function() {
    let state;

    beforeEach(function() {
        state = {
            search: { value: [{ id: 'the-thing' }] },
            title: { value: 'The title' },
            description: { value: 'The description' },
            age: { value: '0-12' },
            gender: { value: 'Female' }
        };
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

            it('should wipe out everything but the search', function() {
                expect(newState).toEqual({
                    search: { value: [{ id: 'the-thing' }] }
                });
            });
        });

        describe(WIZARD_DESTROYED, function() {
            beforeEach(function() {
                newState = productWizardReducer(state, createAction(WIZARD_DESTROYED)());
            });

            it('should return undefined', function() {
                expect(newState).toBeUndefined();
            });
        });
    });
});
