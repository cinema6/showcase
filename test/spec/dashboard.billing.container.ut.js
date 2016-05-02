import { renderIntoDocument, findAllInRenderedTree, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import { createUuid } from 'rc-uuid';
import { keyBy } from 'lodash';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ChangePaymentMethodModal from '../../src/components/ChangePaymentMethodModal';

const proxyquire = require('proxyquire');

describe('Billing', function() {
    let billingActions, paymentActions;
    let Billing;

    beforeEach(function() {
        billingActions = {
            showChangeModal: jasmine.createSpy('showChangeModal()').and.callFake(require('../../src/actions/billing').showChangeModal),
            loadPageData: jasmine.createSpy('loadPageData()').and.callFake(require('../../src/actions/billing').loadPageData),
            changePaymentMethod: jasmine.createSpy('changePaymentMethod()').and.callFake(require('../../src/actions/billing').changePaymentMethod),

            __esModule: true
        };

        paymentActions = {
            getClientToken: jasmine.createSpy('getClientToken()').and.callFake(require('../../src/actions/payment').getClientToken),

            __esModule: true
        };

        Billing = proxyquire('../../src/containers/Dashboard/Billing', {
            '../../actions/billing': billingActions,
            '../../actions/payment': paymentActions,

            '../../components/ChangePaymentMethodModal': {
                default: ChangePaymentMethodModal,

                __esModule: true
            }
        }).default;
    });

    describe('when rendered', function() {
        let session;
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            session = {
                payments: Array.apply([], new Array(10)).map(() => createUuid()),
                paymentMethods: Array.apply([], new Array(3)).map(() => createUuid())
            };
            state = {
                session,
                db: {
                    payment: keyBy(session.payments.map(id => ({
                        type: 'paypal',
                        createdAt: new Date().toISOString(),
                        id,
                        amount: 10,
                        method: {
                            type: 'paypal'
                        }
                    })), 'id'),
                    paymentMethod: keyBy(session.paymentMethods.map(token => ({
                        type: 'creditCard',
                        token,
                        last4: '1234',
                        default: false
                    })), 'token')
                },
                page: {
                    'dashboard.billing': {
                        showChangeModal: false
                    }
                }
            };
            state.db.paymentMethod[session.paymentMethods[1]].default = true;
            store = createStore(() => state);

            props = {

            };

            spyOn(store, 'dispatch');

            component = findAllInRenderedTree(renderIntoDocument(
                <Provider store={store}>
                    <Billing {...props} />
                </Provider>
            ), component => component.constructor.name === 'Billing')[0];
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should load the page data', function() {
            expect(billingActions.loadPageData).toHaveBeenCalledWith();
            expect(store.dispatch).toHaveBeenCalledWith(billingActions.loadPageData.calls.mostRecent().returnValue);
        });

        describe('props', function() {
            beforeEach(function() {
                store.dispatch.calls.reset();
            });

            it('should map the state to some props', function() {
                expect(component.props).toEqual(jasmine.objectContaining({
                    payments: session.payments.map(id => state.db.payment[id]),
                    defaultPaymentMethod: state.db.paymentMethod[session.paymentMethods[1]]
                }));
            });

            describe('showChangeModal()', function() {
                beforeEach(function() {
                    component.props.showChangeModal(false);
                });

                it('should dispatch showChangeModal()', function() {
                    expect(billingActions.showChangeModal).toHaveBeenCalledWith(false);
                    expect(store.dispatch).toHaveBeenCalledWith(billingActions.showChangeModal.calls.mostRecent().returnValue);
                });
            });

            describe('getClientToken()', function() {
                beforeEach(function() {
                    component.props.getClientToken();
                });

                it('should dispatch getClientToken()', function() {
                    expect(paymentActions.getClientToken).toHaveBeenCalledWith();
                    expect(store.dispatch).toHaveBeenCalledWith(paymentActions.getClientToken.calls.mostRecent().returnValue);
                });
            });

            describe('changePaymentMethod()', function() {
                let method;

                beforeEach(function() {
                    method = {};

                    component.props.changePaymentMethod(method);
                });

                it('should dispatch changePaymentMethod()', function() {
                    expect(billingActions.changePaymentMethod).toHaveBeenCalledWith(method);
                    expect(store.dispatch).toHaveBeenCalledWith(billingActions.changePaymentMethod.calls.mostRecent().returnValue);
                });
            });
        });

        describe('when the modal is shown', function() {
            let modal;

            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));

                component.props.page.showChangeModal = true;
                component.forceUpdate();

                modal = findRenderedComponentWithType(component, ChangePaymentMethodModal);
            });

            it('should render a ChangePaymentMethodModal', function() {
                expect(modal).toEqual(jasmine.any(Object));
                expect(modal.props.getToken).toBe(component.props.getClientToken);
                expect(modal.props.onSubmit).toBe(component.props.changePaymentMethod);
            });
        });
    });
});
