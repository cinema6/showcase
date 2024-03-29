'use strict';

import React from 'react';
import { createStore, compose } from 'redux';
import ProductWizard from '../../src/containers/Dashboard/ProductWizard';
import { reducer as formReducer, getValues } from 'redux-form';
import { assign } from 'lodash';
import { wizardComplete, autofill } from '../../src/actions/product_wizard';
import { getPromotions, getOrg } from '../../src/actions/session';
import AddProduct from '../../src/containers/Dashboard/AddProduct';
import { createUuid } from 'rc-uuid';
import { mount } from 'enzyme';
import { getPaymentPlans } from '../../src/actions/system';

describe('AddProduct', function() {
    it('should wrap the ProductWizard component', function() {
        expect(AddProduct.WrappedComponent.WrappedComponent).toBe(ProductWizard.WrappedComponent);
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let wrapper, component;

        beforeEach(function() {
            state = {
                session: {
                    promotions: [`pro-${createUuid()}`, `pro-${createUuid()}`],
                    org: `o-${createUuid()}`
                },
                system: {},
                db: {
                    paymentPlan: {
                        [`pp-${createUuid()}`]: {
                            price: 0
                        },
                        [`pp-${createUuid()}`]: {
                            price: 49.99
                        },
                        [`pp-${createUuid()}`]: {
                            price: 149.99
                        },
                        [`pp-${createUuid()}`]: {
                            price: 499.99
                        }
                    }
                },
                page: {
                    'dashboard.add_product': {
                        step: 0,
                        productData: {
                            name: 'Awesome App',
                            description: 'It is the best.',
                            images: [
                                { type: 'thumbnail', uri: 'foo.jpg' }
                            ]
                        },
                        targeting: { age: 'foo', gender: 'foo' }
                    }
                },
                form: {
                    selectPlan: {
                        select: {
                            plan: {
                                _isFieldValue: true,
                                value: `pp-${createUuid()}`
                            }
                        }
                    }
                }
            };
            state.system.paymentPlans = Object.keys(state.db.paymentPlan);
            state.db.promotion = state.session.promotions.reduce((result, id) => {
                result[id] = {
                    id,
                    type: 'freeTrial',
                    data: {
                        trialLength: 10
                    }
                };
                return result;
            }, {});
            state.db.org = {
                [state.session.org]: {
                    paymentPlanId: `pp-${createUuid()}`
                }
            };
            store = createStore(compose(
                (s, action) => assign({}, s, {
                    form: formReducer(s.form, action)
                }),
                s => assign({}, s, state)
            ));

            spyOn(store, 'dispatch').and.callThrough();

            wrapper = mount(
                <AddProduct {...props} />,
                {
                    attachTo: document.createElement('div'),
                    context: { store }
                }
            );
            component = wrapper.find(ProductWizard);
        });

        it('should exist', function() {
            expect(component.length).toEqual(1, 'AddProduct not rendered.');
        });

        it('should inject the dashboard.add_product page', function() {
            expect(component.prop('page')).toEqual(state.page['dashboard.add_product']);
        });

        it('should map the state to some props', function() {
            expect(component.props()).toEqual(jasmine.objectContaining({
                steps: [0, 1, 2, 3],

                promotions: state.session.promotions.map(id => state.db.promotion[id]),
                paymentPlans: state.system.paymentPlans.map(id => state.db.paymentPlan[id]).filter(paymentPlan => paymentPlan.price > 0),

                productData: state.page['dashboard.add_product'].productData,
                targeting: state.page['dashboard.add_product'].targeting,
                paymentPlanId: getValues(state.form.selectPlan.select).plan
            }));
        });

        describe('if no paymentPlans have been fetched', () => {
            beforeEach(() => {
                state = assign({}, state, {
                    system: assign({}, state.system, {
                        paymentPlans: null
                    })
                });
                store.dispatch({ type: '@@UPDATE' });
            });

            it('should pass in paymentPlans as []', function() {
                expect(component.props()).toEqual(jasmine.objectContaining({
                    paymentPlans: []
                }));
            });
        });

        describe('if no promotions have been fetched', function() {
            beforeEach(function() {
                state = assign({}, state, {
                    session: assign({}, state.session, {
                        promotions: null
                    })
                });
                store.dispatch({ type: '@@UPDATE' });
            });

            it('should pass in promotions as null', function() {
                expect(component.props()).toEqual(jasmine.objectContaining({
                    promotions: null
                }));
            });
        });

        describe('if the form has not been initialized', function() {
            beforeEach(function() {
                state = assign({}, state, {
                    form: {}
                });
                store.dispatch({ type: '@@UPDATE' });
            });

            it('should pass in the paymentPlanId as null', function() {
                expect(component.props()).toEqual(jasmine.objectContaining({
                    paymentPlanId: null
                }));
            });
        });

        describe('dispatch props', function() {
            let result;

            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));
            });

            describe('loadData()', function() {
                beforeEach(function(done) {
                    result = component.prop('loadData')();
                    setTimeout(done);
                });

                it('should get the promotions', function() {
                    expect(store.dispatch).toHaveBeenCalledWith(getPromotions());
                });

                it('should get app data', function(){
                    expect(store.dispatch).toHaveBeenCalledWith(autofill());
                });

                it('should get the org', function() {
                    expect(store.dispatch).toHaveBeenCalledWith(getOrg());
                });

                it('should get the payment plans', () => {
                    expect(store.dispatch).toHaveBeenCalledWith(getPaymentPlans());
                });
            });

            describe('onFinish()', function() {
                let targeting, productData;

                beforeEach(function() {
                    targeting = {
                        age: '0-12',
                        gender: 'Female'
                    };
                    productData = {
                        name: 'My awesome product!',
                        description: 'It is really great!'
                    };

                    result = component.prop('onFinish')({ targeting, productData });
                });

                it('should dispatch wizardComplete()', function() {
                    expect(store.dispatch).toHaveBeenCalledWith(wizardComplete({ targeting, productData: assign({}, state.page['dashboard.add_product'].productData, productData) }));
                    expect(result).toBe(store.dispatch.calls.mostRecent().returnValue);
                });
            });
        });
    });
});
