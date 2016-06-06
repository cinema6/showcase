'use strict';

import productWizardReducer, { plugin } from '../../src/reducers/form/product_wizard';
import {
    PRODUCT_SELECTED,
    WIZARD_DESTROYED,
    AUTOFILL_COMPLETE
} from '../../src/actions/product_wizard';
import { createAction } from 'redux-actions';
import * as TARGETING from '../../src/enums/targeting';

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
        describe(AUTOFILL_COMPLETE, function(){
            beforeEach(function() {
                newState = productWizardReducer(state, createAction(AUTOFILL_COMPLETE)( {id: 'test'}));        
            });
            it('should update the state.search.value', function(){
                expect(newState.search.value[0].id).toEqual('test');
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

describe('productWizard plugin', function() {
    it('should exist', function() {
        expect(plugin).toEqual(jasmine.any(Object));
    });

    describe('.age(value, previousValue, allValues, previousAllValues)', function() {
        beforeEach(function() {
            this.value = undefined;
            this.previousValue = undefined;
            this.allValues = {
                age: undefined,
                gender: undefined,
                title: undefined,
                description: undefined
            };
            this.previousAllValues = {
                age: undefined,
                gender: undefined,
                title: undefined,
                description: undefined
            };
        });

        describe('on the initial invocation', function() {
            beforeEach(function() {
                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return the value', function() {
                expect(this.result).toBe(this.value);
            });
        });

        describe('when a value is first selected', function() {
            beforeEach(function() {
                this.value = [TARGETING.AGE.ALL, TARGETING.AGE.TEENS];

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return the value', function() {
                expect(this.result).toEqual([TARGETING.AGE.TEENS]);
            });
        });

        describe('when ALL is first selected', function() {
            beforeEach(function() {
                this.value = [TARGETING.AGE.TEENS, TARGETING.AGE.ALL];
                this.previousValue = undefined;

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return the value', function() {
                expect(this.result).toEqual([TARGETING.AGE.ALL]);
            });
        });

        describe('when the form is destroyed', function() {
            beforeEach(function() {
                this.value = undefined;
                this.previousValue = [TARGETING.AGE.TEENS];

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return the value', function() {
                expect(this.result).toBe(this.value);
            });
        });

        describe('when normal values are added', function() {
            beforeEach(function() {
                this.value = [TARGETING.AGE.TEENS, TARGETING.AGE.YOUNG_ADULTS];
                this.previousValue = [TARGETING.AGE.TEENS];

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return the value', function() {
                expect(this.result).toBe(this.value);
            });
        });

        describe('if the ALL option is not changed', function() {
            beforeEach(function() {
                this.value = [TARGETING.AGE.ALL];
                this.previousValue = [TARGETING.AGE.ALL];

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return the result', function() {
                expect(this.result).toBe(this.value);
            });
        });

        describe('when normal values are removed', function() {
            beforeEach(function() {
                this.value = [TARGETING.AGE.TEENS];
                this.previousValue = [TARGETING.AGE.TEENS, TARGETING.AGE.YOUNG_ADULTS];

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return the value', function() {
                expect(this.result).toBe(this.value);
            });
        });

        describe('when all options are removed', function() {
            beforeEach(function() {
                this.value = [];
                this.previousValue = [TARGETING.AGE.KIDS];

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return [ALL]', function() {
                expect(this.result).toEqual([TARGETING.AGE.ALL]);
            });
        });

        describe('when ALL is added', function() {
            beforeEach(function() {
                this.value = [TARGETING.AGE.TEENS, TARGETING.AGE.YOUNG_ADULTS, TARGETING.AGE.ALL];
                this.previousValue = [TARGETING.AGE.TEENS, TARGETING.AGE.YOUNG_ADULTS];

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should return an Array with just ALL', function() {
                expect(this.result).toEqual([TARGETING.AGE.ALL]);
            });
        });

        describe('when ALL is removed', function() {
            beforeEach(function() {
                this.value = [TARGETING.AGE.ALL, TARGETING.AGE.TEENS];
                this.previousValue = [TARGETING.AGE.ALL];

                this.result = plugin.age(this.value, this.previousValue, this.allValues, this.previousAllValues);
            });

            it('should remove ALL from the Array', function() {
                expect(this.result).toEqual([TARGETING.AGE.TEENS]);
            });
        });
    });
});
