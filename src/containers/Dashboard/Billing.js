import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { assign, find, get } from 'lodash';
import PaymentMethod from '../../components/PaymentMethod';
import PaymentHistory from '../../components/PaymentHistory';
import ChangePaymentMethodModal from '../../components/ChangePaymentMethodModal';
import * as billingActions from '../../actions/billing';
import * as paymentActions from '../../actions/payment';
import * as alertActions from '../../actions/alert';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import moment from 'moment';
import numeral from 'numeral';
import ChangePlanModal from '../../components/ChangePlanModal';
import { getValues } from 'redux-form';

const DASH = '\u2014';

class Billing extends Component {
    componentWillMount() {
        return this.props.loadPageData();
    }

    render() {
        const {
            defaultPaymentMethod,
            payments,
            page,
            billingPeriod,
            paymentPlan,
            nextPaymentPlan,
            paymentPlans,
            selectedPlan,
            numberOfCampaigns,

            showChangeModal,
            showPlanModal,
            getClientToken,
            changePaymentMethod,
            showAlert,
            changePaymentPlan,
            cancelSubscription,
        } = this.props;

        const billingEnd = billingPeriod && moment(billingPeriod.cycleEnd);
        const nextDueDate = billingEnd && moment(billingEnd).add(1, 'day');

        const viewsPerMonth = (
            paymentPlan &&
            numeral(paymentPlan.viewsPerMonth).format('0,0')
        ) || DASH;
        const dueDate = (
            nextDueDate &&
            nextDueDate.format('MMM D, YYYY')
        ) || DASH;
        const price = get(nextPaymentPlan, 'price', DASH);

        return (<div className="container main-section campaign-stats">
            <DocumentTitle title="Reelcontent Apps: Billing" />
            <div className="row">
                <div className="col-md-12">
                    <h1>Billing Details</h1>
                </div>
                <div className="col-md-6">
                    <div className="billing-summary card-item col-md-12">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="data-stacked">
                                    <h4>Your subscription provides</h4>
                                    <h3>{viewsPerMonth} views</h3>
                                </div>
                                <div className="data-stacked">
                                    <h4>Next Payment due</h4>
                                    <h3>${price} on {dueDate}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 btn-wrap">
                                <Button
                                    bsSize="lg"
                                    bsStyle="primary"
                                    onClick={() => showPlanModal(true)}
                                >
                                    Update Plan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <PaymentMethod
                        loading={page.loading}
                        method={defaultPaymentMethod}
                        onChangeMethod={() => showChangeModal(true)}
                    />
                </div>
            </div>
            <br />
            <div className="row">
                <div className="container">
                    <div
                        className="col-md-12 col-sm-12 col-middle animated card-item
                        table-responsive"
                    >
                        <PaymentHistory loading={page.loading} payments={payments} />
                    </div>
                </div>
            </div>

            {page.showChangeModal && (<ChangePaymentMethodModal
                getToken={getClientToken}
                onSubmit={changePaymentMethod}
                handleClose={() => showChangeModal(false)}
            />)}
            <ChangePlanModal
                show={page.showPlanModal}
                actionPending={page.changingPlan}

                plans={paymentPlans}
                currentPlan={paymentPlan && paymentPlan.id}
                selectedPlan={selectedPlan}
                amountOfCampaigns={numberOfCampaigns}
                cycleEnd={billingEnd}

                onClose={() => showPlanModal(false)}
                onConfirm={paymentPlanId => (
                    changePaymentPlan(paymentPlanId, page.postPlanChangeRedirect)
                )}
                onCancel={() => {
                    showPlanModal(false);

                    showAlert({
                        title: 'Cancel Your Subscription',
                        description: (<div>
                            <span>
                                <strong>Are you sure you want to cancel your subscription?</strong>
                                <br />
                                <p>
                                    <br />
                                    {numberOfCampaigns > 1 ?
                                        `All ${numberOfCampaigns} of your apps will lose the ` +
                                            'exposure they have been getting!' :
                                        'Your app will lose the exposure it has been getting!'
                                    }
                                </p>
                            </span>
                            <div className="cancel-stats">
                                <div className="campaign-mini-stats col-md-6 text-center">
                                    <span>Current period</span>
                                    <h3>{viewsPerMonth}</h3>
                                    <span>views</span>
                                </div>
                                <div className="campaign-mini-stats col-md-6 text-center">
                                    <span>Later</span>
                                    <h3>0</h3>
                                    <span>views</span>
                                </div>
                            </div>
                        </div>),
                        buttons: [
                            {
                                text: 'Cancel my subscription',
                                type: 'danger btn-block',
                                size: 'large',
                                onSelect: dismiss => cancelSubscription().then(() => Promise.all([
                                    dismiss(),
                                    showPlanModal(false),
                                ])),
                            },
                        ],
                    });
                }}
            />
        </div>);
    }
}

Billing.propTypes = {
    defaultPaymentMethod: PropTypes.object,
    payments: PropTypes.array.isRequired,
    page: PropTypes.shape({
        showChangeModal: PropTypes.bool.isRequired,
        showPlanModal: PropTypes.bool.isRequired,
        changingPlan: PropTypes.bool.isRequired,
        postPlanChangeRedirect: PropTypes.string,
    }).isRequired,
    billingPeriod: PropTypes.shape({
        cycleStart: PropTypes.string.isRequired,
        cycleEnd: PropTypes.string.isRequired,
        totalViews: PropTypes.number.isRequired,
    }),
    paymentPlan: PropTypes.shape({
        viewsPerMonth: PropTypes.number.isRequired,
    }),
    nextPaymentPlan: PropTypes.shape({
        price: PropTypes.number.isRequired,
    }),
    paymentPlans: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired),
    selectedPlan: PropTypes.string,
    numberOfCampaigns: PropTypes.number,

    loadPageData: PropTypes.func.isRequired,
    showChangeModal: PropTypes.func.isRequired,
    showPlanModal: PropTypes.func.isRequired,
    getClientToken: PropTypes.func.isRequired,
    changePaymentMethod: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    changePaymentPlan: PropTypes.func.isRequired,
    cancelSubscription: PropTypes.func.isRequired,
};

function mapStateToProps({
    session,
    db,
    system,
    form,
}) {
    const payments = session.payments.map(id => db.payment[id]);
    const paymentMethods = session.paymentMethods.map(token => db.paymentMethod[token]);
    const paymentPlans = (system.paymentPlans || []).map(id => db.paymentPlan[id]);
    const paymentPlan = (session.paymentPlanStatus || undefined) && find(paymentPlans, {
        id: session.paymentPlanStatus.paymentPlanId,
    });
    const nextPaymentPlan = (session.paymentPlanStatus || undefined) && find(paymentPlans, {
        id: session.paymentPlanStatus.nextPaymentPlanId,
    });

    return {
        payments,
        paymentPlan,
        nextPaymentPlan: nextPaymentPlan || paymentPlan,
        paymentPlans: paymentPlans.filter(plan => plan.price > 0),
        defaultPaymentMethod: find(paymentMethods, { default: true }),
        billingPeriod: session.billingPeriod,
        selectedPlan: (getValues(get(form, 'selectPlan.change')) || {}).plan,
        numberOfCampaigns: get(session, 'campaigns.length'),
    };
}

export default compose(
    pageify({ path: 'dashboard.billing' }),
    connect(mapStateToProps, assign({},
        billingActions,
        paymentActions,
        alertActions
    ))
)(Billing);
