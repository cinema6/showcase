'use strict';

import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import ProductWizard from '../../src/containers/Dashboard/ProductWizard';
import { reducer as formReducer } from 'redux-form';
import { assign } from 'lodash';
import { wizardComplete, autofill } from '../../src/actions/product_wizard';
import { getPromotions } from '../../src/actions/session';
import AddProduct from '../../src/containers/Dashboard/AddProduct';
import { createUuid } from 'rc-uuid';

describe('AddProduct', function() {
    it('should wrap the ProductWizard component', function() {
        expect(AddProduct.WrappedComponent.WrappedComponent).toBe(ProductWizard.WrappedComponent);
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            state = {
                session: {
                    promotions: [`pro-${createUuid()}`, `pro-${createUuid()}`]
                },
                db: {},
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
                }
            };
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
            store = createStore(compose(
                (s, action) => assign({}, s, {
                    form: formReducer(s.form, action)
                }),
                s => assign({}, s, state)
            ));

            spyOn(store, 'dispatch').and.callThrough();

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <AddProduct {...props} />
                </Provider>
            ), ProductWizard);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should inject the dashboard.add_product page', function() {
            expect(component.props.page).toEqual(state.page['dashboard.add_product']);
        });

        it('should map the state to some props', function() {
            expect(component.props).toEqual(jasmine.objectContaining({
                steps: [0, 1, 2, 3],

                promotions: state.session.promotions.map(id => state.db.promotion[id]),

                productData: state.page['dashboard.add_product'].productData,
                targeting: state.page['dashboard.add_product'].targeting
            }));
        });

        describe('if no promotions have been fetched', function() {
            beforeEach(function() {
                state.session.promotions = null;
                component = findRenderedComponentWithType(renderIntoDocument(
                    <Provider store={store}>
                        <AddProduct {...props} />
                    </Provider>
                ), ProductWizard);
            });

            it('should pass in promotions as null', function() {
                expect(component.props).toEqual(jasmine.objectContaining({
                    promotions: null
                }));
            });
        });

        describe('dispatch props', function() {
            let result;

            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));
            });

            describe('loadData()', function() {
                let result;

                beforeEach(function(done) {
                    result = component.props.loadData();
                    setTimeout(done);
                });

                it('should get the promotions', function() {
                    expect(store.dispatch).toHaveBeenCalledWith(getPromotions());
                    //expect(result).toBe(store.dispatch.calls.mostRecent().returnValue);
                });
                it('should get app data', function(){
                    expect(store.dispatch).toHaveBeenCalledWith(autofill());
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

                    result = component.props.onFinish({ targeting, productData });
                });

                it('should dispatch wizardComplete()', function() {
                    expect(store.dispatch).toHaveBeenCalledWith(wizardComplete({ targeting, productData: assign({}, state.page['dashboard.add_product'].productData, productData) }));
                    expect(result).toBe(store.dispatch.calls.mostRecent().returnValue);
                });
            });
        });
    });
});
