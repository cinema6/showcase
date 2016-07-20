import { mount } from 'enzyme';
import React from 'react';
import { createUuid } from 'rc-uuid';
import { keyBy, assign } from 'lodash';
import { createStore } from 'redux';
import ChangePaymentMethodModal from '../../src/components/ChangePaymentMethodModal';
import { showAlert } from '../../src/actions/alert';
import moment from 'moment';
import config from '../../config';
import numeral from 'numeral';

const proxyquire = require('proxyquire');
const DASH = '\u2014';

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
            '../../actions/alert': require('../../src/actions/alert'),

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
        let wrapper, component;

        beforeEach(function() {
            session = {
                payments: Array.apply([], new Array(10)).map(() => createUuid()),
                paymentMethods: Array.apply([], new Array(3)).map(() => createUuid()),
                billingPeriod: {
                    cycleStart: moment().subtract(5, 'days').format(),
                    cycleEnd: moment().subtract(5, 'days').add(1, 'month').subtract(1, 'day').format(),
                    totalViews: 12345
                }
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

            wrapper = mount(
                <Billing {...props} />,
                { context: { store }, attachTo: document.createElement('div') }
            );
            component = wrapper.find(Billing.WrappedComponent.WrappedComponent);
        });

        it('should exist', function() {
            expect(component.length).toEqual(1, 'Billing is not rendered');
        });

        it('should load the page data', function() {
            expect(billingActions.loadPageData).toHaveBeenCalledWith();
            expect(store.dispatch).toHaveBeenCalledWith(billingActions.loadPageData.calls.mostRecent().returnValue);
        });

        it('should render the paymentPlan price and due date', function() {
            expect(component.find('.billing-summary .data-stacked h3').at(1).text()).toBe(`$${config.paymentPlans[0].price} on ${moment(session.billingPeriod.cycleEnd).add(1, 'day').format('MMM D, YYYY')}`);
        });

        it('should render the estimated amount of views for the billing period', function() {
            expect(component.find('.billing-summary .data-stacked h3').at(0).text()).toBe(`${numeral(session.billingPeriod.totalViews).format('0,0')} views`);
        });

        describe('if the billing period is unknown', function() {
            beforeEach(function() {
                store.dispatch.and.callThrough();

                state = assign({}, state, {
                    session: assign({}, state.session, {
                        billingPeriod: null
                    })
                });
                store.dispatch({ type: '@@UPDATE' });
            });

            it('should render dashes in place of data', function() {
                const nextDueDate = component.find('.billing-summary .data-stacked h3').at(1);
                const numOfImpressions = component.find('.billing-summary .data-stacked h3').at(0);

                expect(nextDueDate.text()).toBe(`$${config.paymentPlans[0].price} on ${DASH}`);
                expect(numOfImpressions.text()).toBe(`${DASH} views`);
            });
        });

        describe('props', function() {
            beforeEach(function() {
                store.dispatch.calls.reset();
            });

            it('should map the state to some props', function() {
                expect(component.props()).toEqual(jasmine.objectContaining({
                    payments: session.payments.map(id => state.db.payment[id]),
                    defaultPaymentMethod: state.db.paymentMethod[session.paymentMethods[1]],
                    billingPeriod: state.session.billingPeriod
                }));
            });

            describe('showChangeModal()', function() {
                beforeEach(function() {
                    component.props().showChangeModal(false);
                });

                it('should dispatch showChangeModal()', function() {
                    expect(billingActions.showChangeModal).toHaveBeenCalledWith(false);
                    expect(store.dispatch).toHaveBeenCalledWith(billingActions.showChangeModal.calls.mostRecent().returnValue);
                });
            });

            describe('getClientToken()', function() {
                beforeEach(function() {
                    component.props().getClientToken();
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

                    component.props().changePaymentMethod(method);
                });

                it('should dispatch changePaymentMethod()', function() {
                    expect(billingActions.changePaymentMethod).toHaveBeenCalledWith(method);
                    expect(store.dispatch).toHaveBeenCalledWith(billingActions.changePaymentMethod.calls.mostRecent().returnValue);
                });
            });

            describe('showAlert()', function() {
                let title, description, buttons;

                beforeEach(function() {
                    title = 'My Alert';
                    description = 'Is so helpful to the user.';
                    buttons = [
                        { text: 'Do Something', onSelect: jasmine.createSpy('onSelect()') }
                    ];

                    component.props().showAlert({ title, description, buttons });
                });

                it('should dispatch() showAlert()', function() {
                    const expected = showAlert({ title, description, buttons });

                    expect(store.dispatch).toHaveBeenCalledWith(assign({}, expected, {
                        payload: assign({}, expected.payload, {
                            id: jasmine.any(String),
                            buttons: expected.payload.buttons.map(button => assign({}, button, {
                                id: jasmine.any(String)
                            }))
                        })
                    }));
                });
            });
        });

        describe('when the modal is shown', function() {
            let modal;

            beforeEach(function() {
                store.dispatch.and.returnValue(new Promise(() => {}));

                wrapper.setState({
                    page: assign({}, wrapper.props().page, {
                        showChangeModal: true
                    })
                });

                modal = component.find(ChangePaymentMethodModal);
            });

            it('should render a ChangePaymentMethodModal', function() {
                expect(modal.length).toEqual(1, 'ChangePaymentMethodModal is not rendered');
                expect(modal.props().getToken).toBe(component.props().getClientToken);
                expect(modal.props().onSubmit).toBe(component.props().changePaymentMethod);
            });
        });
    });
});
