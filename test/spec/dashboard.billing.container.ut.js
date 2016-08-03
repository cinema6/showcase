import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { createUuid } from 'rc-uuid';
import { keyBy, assign } from 'lodash';
import { createStore } from 'redux';
import ChangePaymentMethodModal from '../../src/components/ChangePaymentMethodModal';
import ChangePlanModal from '../../src/components/ChangePlanModal';
import { showAlert } from '../../src/actions/alert';
import moment from 'moment';
import numeral from 'numeral';
import { getValues } from 'redux-form';
import { changePaymentPlan, cancelSubscription } from '../../src/actions/billing';
import * as stub from '../helpers/stubs';

const proxyquire = require('proxyquire');
const DASH = '\u2014';

describe('Billing', function() {
    let billingActions, paymentActions;
    let Billing;

    beforeEach(function() {
        billingActions = {
            showChangeModal: jasmine.createSpy('showChangeModal()').and.callFake(require('../../src/actions/billing').showChangeModal),
            showPlanModal: jasmine.createSpy('showChangeModal()').and.callFake(require('../../src/actions/billing').showPlanModal),
            loadPageData: jasmine.createSpy('loadPageData()').and.callFake(require('../../src/actions/billing').loadPageData),
            changePaymentMethod: jasmine.createSpy('changePaymentMethod()').and.callFake(require('../../src/actions/billing').changePaymentMethod),
            changePaymentPlan,
            cancelSubscription,

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
            },
            '../../components/ChangePlanModal': {
                default: ChangePlanModal,

                __esModule: true
            }
        }).default;
    });

    describe('when rendered', function() {
        let session, paymentPlan, paymentPlans;
        let store, state;
        let props;
        let wrapper, component;

        beforeEach(function() {
            paymentPlans = [
                {
                    id: 'pp-0Ek9Sn0c02viEQGx',
                    price: 0,
                    viewsPerMonth: 0,
                    name: '--canceled--',
                    maxCampaigns: 0
                },
                {
                    id: 'pp-0Ek6Vw0bWnqdlr61',
                    price: 10,
                    viewsPerMonth: 2000,
                    name: 'Baby',
                    maxCampaigns: 1
                },
                {
                    id: 'pp-0Ek6V-0bWnuhLfQl',
                    price: 24.99,
                    viewsPerMonth: 4000,
                    name: 'Kid',
                    maxCampaigns: 5
                },
                {
                    id: 'pp-0Ek6Ws0bWnxCV-B7',
                    price: 49.99,
                    viewsPerMonth: 10000,
                    name: 'Adult',
                    maxCampaigns: 10
                }
            ];
            paymentPlan = paymentPlans[1];
            session = {
                payments: Array.apply([], new Array(10)).map(() => createUuid()),
                paymentMethods: Array.apply([], new Array(3)).map(() => createUuid()),
                billingPeriod: {
                    cycleStart: moment().subtract(5, 'days').format(),
                    cycleEnd: moment().subtract(5, 'days').add(1, 'month').subtract(1, 'day').format(),
                    totalViews: 12345
                },
                paymentPlan: paymentPlan.id,
                campaigns: Array.apply([], new Array(5)).map(() => `cam-${createUuid()}`)
            };
            state = {
                session,
                system: {
                    paymentPlans: paymentPlans.map(paymentPlan => paymentPlan.id)
                },
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
                    })), 'token'),
                    paymentPlan: paymentPlans.reduce((result, paymentPlan) => assign(result, {
                        [paymentPlan.id]: paymentPlan
                    }), {})
                },
                page: {
                    'dashboard.billing': {
                        showChangeModal: false,
                        showPlanModal: false,
                        changingPlan: false
                    }
                },
                form: {
                    selectPlan: {
                        change: {
                            plan: {
                                _isFieldValue: true,
                                value: paymentPlans[3].id
                            }
                        }
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
            expect(component.find('.billing-summary .data-stacked h3').at(1).text()).toBe(`$${paymentPlan.price} on ${moment(session.billingPeriod.cycleEnd).add(1, 'day').format('MMM D, YYYY')}`);
        });

        it('should render the amount of views for the payment plan', function() {
            expect(component.find('.billing-summary .data-stacked h3').at(0).text()).toBe(`${numeral(paymentPlan.viewsPerMonth).format('0,0')} views`);
        });

        describe('the ChangePlanModal', () => {
            let modal;

            beforeEach(() => {
                modal = component.find(ChangePlanModal);
            });

            afterEach(() => {
                modal = null;
            });

            it('should exist', () => {
                expect(modal.length).toBe(1, 'ChangePlanModal not rendered.');
                expect(modal.prop('show')).toBe(false);
                expect(modal.prop('plans')).toEqual(paymentPlans.filter(paymentPlan => paymentPlan.price > 0));
                expect(modal.prop('currentPlan')).toBe(paymentPlan.id);
                expect(modal.prop('selectedPlan')).toBe(getValues(state.form.selectPlan.change).plan);
                expect(modal.prop('amountOfCampaigns')).toBe(state.session.campaigns.length);
                expect(modal.prop('cycleEnd').format()).toEqual(state.session.billingPeriod.cycleEnd);
                expect(modal.prop('actionPending')).toBe(false);
            });

            describe('when page.showPlanModal is true', () => {
                beforeEach(() => {
                    store.dispatch.and.callThrough();

                    state = assign({}, state, {
                        page: assign({}, state.page, {
                            'dashboard.billing': assign({}, state.page['dashboard.billing'], {
                                showPlanModal: true
                            })
                        })
                    });
                    store.dispatch({ type: '@@UPDATE' });
                });

                it('should be shown', () => {
                    expect(modal.prop('show')).toBe(true);
                });
            });

            describe('when page.changingPlan is true', () => {
                beforeEach(() => {
                    store.dispatch.and.callThrough();

                    state = assign({}, state, {
                        page: assign({}, state.page, {
                            'dashboard.billing': assign({}, state.page['dashboard.billing'], {
                                changingPlan: true
                            })
                        })
                    });
                    store.dispatch({ type: '@@UPDATE' });
                });

                it('should set actionPending to true', () => {
                    expect(modal.prop('actionPending')).toBe(true);
                });
            });

            describe('when onClose() is called', () => {
                beforeEach(() => {
                    store.dispatch.calls.reset();
                    modal.prop('onClose')();
                });

                it('should dispatch() showPlanModal(false)', () => {
                    expect(store.dispatch).toHaveBeenCalledWith(billingActions.showPlanModal(false));
                });
            });

            describe('when onConfirm() is called', () => {
                let paymentPlanId;

                beforeEach(() => {
                    store.dispatch.calls.reset();

                    paymentPlanId = `pp-${createUuid()}`;
                    modal.prop('onConfirm')(paymentPlanId);
                });

                afterEach(() => {
                    paymentPlanId = null;
                });

                it('should dispatch changePaymentPlan()', () => {
                    expect(store.dispatch).toHaveBeenCalledWith(changePaymentPlan(paymentPlanId));
                });
            });

            describe('when onCancel() is called', () => {
                beforeEach(() => {
                    store.dispatch.calls.reset();
                    modal.prop('onCancel')();
                });

                it('should dispatch() an alert', () => {
                    expect(store.dispatch).toHaveBeenCalledWith((() => {
                        const action = showAlert({
                            title: jasmine.any(String),
                            description: jasmine.any(Object),
                            buttons: [
                                {
                                    text: jasmine.any(String),
                                    type: jasmine.any(String),
                                    size: jasmine.any(String),
                                    onSelect: jasmine.any(Function)
                                }
                            ]
                        });

                        action.payload.id = jasmine.any(String);
                        action.payload.buttons.forEach(button => button.id = jasmine.any(String));

                        return action;
                    })());
                });

                describe('the alert', () => {
                    let alert;

                    beforeEach(() => {
                        alert = store.dispatch.calls.mostRecent().args[0].payload;
                    });

                    afterEach(() => {
                        alert = null;
                    });

                    describe('description', () => {
                        let description;

                        beforeEach(() => {
                            description = new ReactWrapper(alert.description);
                        });

                        afterEach(() => {
                            description = null;
                        });

                        it('should render the amount of apps the user has', () => {
                            expect(description.find('span p').first().text()).toBe(`All ${state.session.campaigns.length} of your apps will lose the exposure they have been getting!`);
                        });

                        it('should render the amount of views in the current billing cycle', () => {
                            expect(description.find('.campaign-mini-stats h3').first().text()).toBe(numeral(paymentPlan.viewsPerMonth).format('0,0'));
                        });

                        describe('if the user only has one app', () => {
                            beforeEach(() => {
                                store.dispatch.and.callThrough();

                                state = assign({}, state, {
                                    session: assign({}, state.session, {
                                        campaigns: state.session.campaigns.slice(0, 1)
                                    })
                                });
                                store.dispatch({ type: '@@UPDATE' });

                                modal.prop('onCancel')();
                                alert = store.dispatch.calls.mostRecent().args[0].payload;
                                description = new ReactWrapper(alert.description);
                            });

                            it('should use singular text', () => {
                                expect(description.find('span p').first().text()).toBe('Your app will lose the exposure it has been getting!');
                            });
                        });

                        describe('if the paymentPlan has not been fetched', () => {
                            beforeEach(() => {
                                store.dispatch.and.callThrough();

                                state = assign({}, state, {
                                    session: assign({}, state.session, {
                                        paymentPlan: null
                                    }),
                                    system: assign({}, state.system, {
                                        paymentPlans: null
                                    })
                                });
                                store.dispatch({ type: '@@UPDATE' });

                                modal.prop('onCancel')();
                                alert = store.dispatch.calls.mostRecent().args[0].payload;
                                description = new ReactWrapper(alert.description);
                            });

                            it('should not render the amount of views', () => {
                                expect(description.find('.campaign-mini-stats h3').first().text()).toBe(DASH);
                            });
                        });
                    });

                    describe('buttons', () => {
                        let buttons;

                        beforeEach(() => {
                            buttons = alert.buttons;
                        });

                        afterEach(() => {
                            buttons = null;
                        });

                        describe('[0]', () => {
                            let button;

                            beforeEach(() => {
                                button = buttons[0];
                            });

                            afterEach(() => {
                                button = null;
                            });

                            describe('onSelect()', () => {
                                let dismiss;
                                let dispatchStub;

                                beforeEach(done => {
                                    store.dispatch.calls.reset();
                                    dispatchStub = stub.dispatch();

                                    dismiss = jasmine.createSpy('dismiss()');
                                    store.dispatch.and.callFake(dispatchStub);

                                    button.onSelect(dismiss);
                                    setTimeout(done);
                                });

                                afterEach(() => {
                                    dismiss = null;
                                    dispatchStub = null;
                                });

                                it('should not dismiss the alert', () => {
                                    expect(dismiss).not.toHaveBeenCalled();
                                });

                                it('should dispatch cancelSubscription()', () => {
                                    expect(store.dispatch).toHaveBeenCalledWith(cancelSubscription());
                                });

                                describe('when the subscription is canceled', () => {
                                    beforeEach(done => {
                                        dispatchStub.getDeferred(dispatchStub.calls.mostRecent().args[0]).resolve(undefined);
                                        setTimeout(done);

                                        store.dispatch.calls.reset();
                                    });

                                    it('should dismiss the alert', () => {
                                        expect(dismiss).toHaveBeenCalledWith();
                                    });

                                    it('should close the modal', () => {
                                        expect(store.dispatch).toHaveBeenCalledWith(billingActions.showPlanModal(false));
                                    });
                                });
                            });
                        });
                    });
                });
            });
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

                expect(nextDueDate.text()).toBe(`$${paymentPlan.price} on ${DASH}`);
            });

            it('should pass different data to the ChangePlanModal', () => {
                const modal = component.find(ChangePlanModal);

                expect(modal.prop('cycleEnd')).toBeNull();
            });
        });

        describe('if the payment plan is unknown', function() {
            let changePlan;

            beforeEach(function() {
                store.dispatch.and.callThrough();

                state = assign({}, state, {
                    session: assign({}, state.session, {
                        paymentPlan: null
                    }),
                    system: assign({}, state.system, {
                        paymentPlans: null
                    })
                });
                store.dispatch({ type: '@@UPDATE' });

                changePlan = component.find(ChangePlanModal);
            });

            afterEach(() => {
                changePlan = null;
            });

            it('should render dashes in place of data', function() {
                const nextDueDate = component.find('.billing-summary .data-stacked h3').at(1);
                const numOfImpressions = component.find('.billing-summary .data-stacked h3').at(0);

                expect(nextDueDate.text()).toBe(`$${DASH} on ${moment(session.billingPeriod.cycleEnd).add(1, 'day').format('MMM D, YYYY')}`);
                expect(numOfImpressions.text()).toBe(`${DASH} views`);
            });

            it('should change what is passed into the ChangePlanModal', () => {
                expect(changePlan.prop('plans')).toEqual([]);
                expect(changePlan.prop('currentPlan')).toBeUndefined();
            });
        });

        describe('if the campaigns have not been fetched', () => {
            beforeEach(() => {
                store.dispatch.and.callThrough();

                state = assign({}, state, {
                    session: assign({}, state.session, {
                        campaigns: null
                    })
                });
                store.dispatch({ type: '@@UPDATE' });
            });

            it('should change what is passed into the ChangePlanModal', () => {
                const modal = component.find(ChangePlanModal);

                expect(modal.prop('amountOfCampaigns')).toBeUndefined();
            });
        });

        describe('if the form has not been initialized', () => {
            beforeEach(() => {
                store.dispatch.and.callThrough();

                state = assign({}, state, {
                    form: {}
                });
                store.dispatch({ type: '@@UPDATE' });
            });

            it('should change what is passed into the ChangePlanModal', () => {
                const modal = component.find(ChangePlanModal);

                expect(modal.prop('selectedPlan')).toBeUndefined();
            });
        });

        describe('the button to change plans', () => {
            let button;

            beforeEach(() => {
                button = component.find('.billing-summary').first().find('Button');
            });

            afterEach(() => {
                button = null;
            });

            describe('when clicked', () => {
                beforeEach(() => {
                    store.dispatch.calls.reset();
                    button.prop('onClick')();
                });

                it('should dispatch showPlanModal(true)', () => {
                    expect(store.dispatch).toHaveBeenCalledWith(billingActions.showPlanModal(true));
                });
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
                    page: assign({}, component.props().page, {
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
