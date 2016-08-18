import reduce from '../../src/reducers/form/select_plan';
import {
    WIZARD_DESTROYED
} from '../../src/actions/product_wizard';
import {
    LOAD_PAGE_DATA
} from '../../src/actions/billing';

describe('selectPlan form reducer', () => {
    let state;

    beforeEach(() => {
        state = {
            plan: {
                value: 'foo'
            }
        };
    });

    afterEach(() => {
        state = null;
    });

    it('should return the state passed to it', () => {
        expect(reduce(state, { type: 'foo' })).toBe(state);
    });

    describe('handling actions', () => {
        let state;
        let action;
        let newState;

        beforeEach(() => {
            state = {
                plan: {
                    value: 'bar'
                }
            };
        });

        afterEach(() => {
            state = null;
            action = null;
            newState = null;
        });

        [WIZARD_DESTROYED, `${LOAD_PAGE_DATA}_PENDING`].forEach(type => describe(type, () => {
            beforeEach(() => {
                action = {
                    type
                };

                newState = reduce(state, action);
            });

            it('should return undefined', () => {
                expect(newState).toBeUndefined();
            });
        }));
    });
});
