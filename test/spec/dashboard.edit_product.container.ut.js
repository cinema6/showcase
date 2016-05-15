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
import { loadCampaign, updateCampaign } from '../../src/actions/product_wizard';
import { createUuid } from 'rc-uuid';
import * as TARGETING from '../../src/enums/targeting';
import {
    productDataFromCampaign,
    targetingFromCampaign
} from '../../src/utils/campaign';

const proxyquire = require('proxyquire');

describe('EditProduct', function() {
    let productWizardActions;
    let EditProduct;

    beforeEach(function() {
        productWizardActions = {
            loadCampaign: jasmine.createSpy('loadCampaign()').and.callFake(loadCampaign),
            updateCampaign: jasmine.createSpy('updateCampaign()').and.callFake(updateCampaign),

            __esModule: true
        };

        EditProduct = proxyquire('../../src/containers/Dashboard/EditProduct', {
            'react': React,

            '../../actions/product_wizard': productWizardActions,
            './ProductWizard': {
                default: ProductWizard,

                __esModule: true
            }
        }).default;
    });

    it('should wrap the ProductWizard component', function() {
        expect(EditProduct.WrappedComponent.WrappedComponent).toBe(ProductWizard.WrappedComponent);
    });

    describe('when rendered', function() {
        let campaign;
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            campaign = {
                id: `cam-${createUuid()}`,
                product: {
                    name: 'Product Name',
                    description: 'Product description.',
                    images: [
                        { type: 'thumbnail', uri: 'thumb.gif' }
                    ],
                    price: 'Free'
                },
                targeting: {
                    demographics: {
                        age: [TARGETING.AGE.ZERO_TO_TWELVE],
                        gender: [TARGETING.GENDER.MALE]
                    }
                }
            };

            state = {
                db: {
                    campaign: {
                        [campaign.id]: campaign
                    }
                },

                page: {
                    'dashboard.edit_product': {
                        step: 1,
                        productData: {
                            name: 'Awesome App',
                            description: 'It is the best.'
                        },
                        targeting: { age: 'foo', gender: 'foo' }
                    }
                }
            };
            store = createStore(compose(
                (s, action) => assign({}, s, {
                    form: formReducer(s.form, action)
                }),
                s => assign({}, s, state)
            ));

            spyOn(store, 'dispatch');

            props = {
                params: {
                    campaignId: campaign.id
                }
            };

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <EditProduct {...props} />
                </Provider>
            ), ProductWizard);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should inject the dashboard.edit_product page', function() {
            expect(component.props.page).toEqual(state.page['dashboard.edit_product']);
        });

        it('should map the state to some props', function() {
            expect(component.props).toEqual(jasmine.objectContaining({
                steps: [1, 2],

                productData: productDataFromCampaign(campaign),
                targeting: targetingFromCampaign(campaign)
            }));
        });

        describe('dispatch props', function() {
            let result;

            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));
            });

            describe('loadData()', function() {
                beforeEach(function() {
                    result = component.props.loadData();
                });

                it('should dispatch the loadCampaign() action', function() {
                    expect(productWizardActions.loadCampaign).toHaveBeenCalledWith({ id: props.params.campaignId });
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.loadCampaign.calls.mostRecent().returnValue);
                    expect(result).toBe(store.dispatch.calls.mostRecent().returnValue);
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

                it('should dispatch the updateCampaign() action', function() {
                    expect(productWizardActions.updateCampaign).toHaveBeenCalledWith({ id: props.params.campaignId, productData, targeting });
                    expect(store.dispatch).toHaveBeenCalledWith(productWizardActions.updateCampaign.calls.mostRecent().returnValue);
                    expect(result).toBe(store.dispatch.calls.mostRecent().returnValue);
                });
            });
        });
    });
});
