'use strict';

import WizardSearch from '../../src/components/WizardSearch';
import {
    renderIntoDocument,
    findRenderedComponentWithType,
    findAllInRenderedTree,
    Simulate,
    findRenderedDOMComponentWithTag
} from 'react-addons-test-utils';
import React from 'react';
import TokenTextField from '../../src/components/TokenTextField';
import AppSearchItem from '../../src/components/AppSearchItem';
import { createUuid } from 'rc-uuid';
import defer from 'promise-defer';
import { assign } from 'lodash';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';

describe('WizardSearch', function() {
    describe('when rendered', function() {
        let state, store;
        let props, component;

        beforeEach(function() {
            props = {
                findProducts: jasmine.createSpy('findProducts()').and.returnValue(Promise.resolve([])),
                onProductSelected: jasmine.createSpy('onProductSelected()').and.returnValue(Promise.resolve())
            };

            state = {

            };
            store = createStore((s, action) => assign({}, state, {
                form: formReducer(s.form, action)
            }), state);

            component = findAllInRenderedTree(renderIntoDocument(
                <Provider store={store}>
                    <WizardSearch {...props} />
                </Provider>
            ), component => component.constructor.name === 'WizardSearch')[0];

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should be a form', function() {
            expect(component.props.fields).toEqual(jasmine.objectContaining({
                search: jasmine.any(Object)
            }));
        });

        it('should render a TokenTextField', function() {
            let field = findRenderedComponentWithType(component, TokenTextField);

            expect(field).toEqual(jasmine.any(Object));
            expect(field.props.SuggestionComponent).toBe(AppSearchItem);
            expect(field.props.TokenComponent).toBe(AppSearchItem);
            expect(field.props.maxValues).toBe(1);
            expect(field.props).toEqual(jasmine.objectContaining(assign({}, component.props.fields.search, { value: [] })));
        });

        describe('when the form is submitted', function() {
            let form, input;
            let onProductSelectedDeferred;

            beforeEach(function(done) {
                props.onProductSelected.and.returnValue((onProductSelectedDeferred = defer()).promise);

                form = findRenderedDOMComponentWithTag(component, 'form');
                input = findRenderedComponentWithType(component, TokenTextField);

                input.props.onChange([{ id: createUuid() }]);
                Simulate.submit(form);
                setTimeout(done);
            });

            it('should call onProductSelected with the product', function() {
                expect(props.onProductSelected).toHaveBeenCalledWith(store.getState().form.wizardSearch.search.value[0]);
            });

            describe('if something goes wrong', function() {
                let reason;

                beforeEach(function(done) {
                    reason = new Error('404 - NOT FOUND');
                    reason.response = 'It went wrong!';
                    onProductSelectedDeferred.reject(reason);
                    setTimeout(done);
                });

                it('should set the error', function() {
                    expect(component.props.error).toBe(reason);
                });
            });
        });

        describe('the TokenTextField', function() {
            let field;

            beforeEach(function() {
                field = findRenderedComponentWithType(component, TokenTextField);
            });

            describe('props', function() {
                describe('getSuggestions()', function() {
                    let getSuggestions;
                    let text;
                    let findProductsDeferred;
                    let success, failure;

                    beforeEach(function(done) {
                        getSuggestions = field.props.getSuggestions;
                        text = 'my-text';

                        props.findProducts.and.returnValue((findProductsDeferred = defer()).promise);

                        success = jasmine.createSpy('success()');
                        failure = jasmine.createSpy('failure()');

                        getSuggestions(text).then(success, failure);
                        setTimeout(done);
                    });

                    it('should find some products', function() {
                        expect(props.findProducts).toHaveBeenCalledWith({ query: text, limit: 10 });
                    });

                    describe('when finding products succeeds', function() {
                        let products;

                        beforeEach(function(done) {
                            products = Array.apply([], new Array(10)).map(() => ({
                                title: 'The App',
                                developer: 'Your Mom',
                                thumbnail: 'http://image.com',
                                category: 'Games',
                                price: '$10.99',
                                rating: 3,
                                uri: 'http://app.com/' + createUuid(),
                                productDataURI: 'http://reelcontent.com/' + createUuid()
                            }));
                            findProductsDeferred.resolve(products);

                            setTimeout(done);
                        });

                        it('should fulfill with the products extended with an id', function() {
                            expect(success).toHaveBeenCalledWith(products.map(product => assign({}, product, {
                                id: product.uri
                            })));
                        });
                    });

                    describe('when finding products fails', function() {
                        let reason;

                        beforeEach(function(done) {
                            reason = new Error('It went wrong');
                            findProductsDeferred.reject(reason);
                            setTimeout(done);
                        });

                        it('should fulfill with an empty Array', function() {
                            expect(success).toHaveBeenCalledWith([]);
                        });
                    });

                    describe('if there is no query', function() {
                        beforeEach(function(done) {
                            props.findProducts.calls.reset();
                            success.calls.reset();
                            failure.calls.reset();
                            text = '';

                            getSuggestions(text).then(success, failure);
                            setTimeout(done);
                        });

                        it('should not call findProducts()', function() {
                            expect(props.findProducts).not.toHaveBeenCalled();
                        });

                        it('should fulfill with an empty array', function() {
                            expect(success).toHaveBeenCalledWith([]);
                        });
                    });
                });
            });
        });
    });
});
