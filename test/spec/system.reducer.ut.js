import reduce from '../../src/reducers/system';
import {
    GET_PAYMENT_PLANS
} from '../../src/actions/system';
import { createUuid } from 'rc-uuid';
import { assign } from 'lodash';

describe('system reducer', () => {
    it('should return some initial state', () => {
        expect(reduce(undefined, {})).toEqual({
            paymentPlans: null
        });
    });

    describe('handling actions', () => {
        let state;
        let action;
        let newState;

        beforeEach(() => {
            state = {
                paymentPlans: null
            };
        });

        afterEach(() => {
            state = null;
            action = null;
            newState = null;
        });

        describe(`${GET_PAYMENT_PLANS}_FULFILLED`, () => {
            beforeEach(() => {
                action = {
                    type: `${GET_PAYMENT_PLANS}_FULFILLED`,
                    payload: Array.apply([], new Array(4)).map(() => createUuid())
                };

                newState = reduce(state, action);
            });

            it('should set the paymentPlans', () => {
                expect(newState).toEqual(assign({}, state, { paymentPlans: action.payload }));
            });
        });
    });
});
