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

const DASH = '\u2014';

// const CANCEL_ACCOUNT_HREF = 'mailto:billing@reelcontent.com?subject=Cancel My Account';

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

            showChangeModal,
            getClientToken,
            changePaymentMethod,
            showAlert,
        } = this.props;

        const billingEnd = billingPeriod && moment(billingPeriod.cycleEnd);
        const nextDueDate = billingEnd && moment(billingEnd).add(1, 'day');

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
                                    <h3>
                                        {(
                                            paymentPlan &&
                                            numeral(paymentPlan.viewsPerMonth).format('0,0')
                                        ) || DASH} views
                                    </h3>
                                </div>
                                <div className="data-stacked">
                                    <h4>Next Payment due</h4>
                                    <h3>
                                        ${get(paymentPlan, 'price', DASH)} on {
                                            (nextDueDate && nextDueDate.format('MMM D, YYYY')) ||
                                            DASH
                                        }
                                    </h3>
                                </div>
                            </div>
                            <div className="col-md-4 btn-wrap">
                                <Button
                                    bsSize="lg"
                                    bsStyle="primary"
                                    onClick={() => showAlert({
                                        title: 'Cancel Your Subscription',
                                        description: (<div>
                                            <span>
                                                <strong>
                                                    Are you sure you want to cancel your
                                                    subscription?
                                                </strong>
                                                <br />
                                                <p>
                                                    <br />
                                                    All 3 of your apps will lose the
                                                    exposure they have been
                                                    getting!
                                                </p>
                                            </span>
                                            <div className="cancel-stats">
                                                <div
                                                    className="campaign-mini-stats
                                                    col-md-6 text-center"
                                                >
                                                    <span>Current period</span>
                                                    <h3>3,500</h3>
                                                    <span>views</span>
                                                </div>
                                                <div
                                                    className="campaign-mini-stats
                                                    col-md-6 text-center"
                                                >
                                                    <span>Later</span>
                                                    <h3>0</h3>
                                                    <span>views</span>
                                                </div>
                                            </div>
                                        </div>),
                                        buttons: [
                                            { text: 'Cancel my subscription',
                                            type: 'danger btn-block',
                                            size: 'large',
                                            onSelect: dismiss => dismiss() },
                                        ],
                                    })}
                                >
                                    Update Plan
                                </Button>
                                {/* When users click on "cancel my subscription", close modal and
                                show the success alert on top center of the page*/}
                                {/*
                                <div className="alert alert-dismissible alert-success alert-fixed"
                                role="alert">
                                    <button type="button" className="close" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                    Your subscription will be suspended at the end of current
                                    billing period (Mar 25 - Apr 24).
                                </div>*/}
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

            {page.showChangeModal &&
                <ChangePaymentMethodModal
                    getToken={getClientToken}
                    onSubmit={changePaymentMethod}
                    handleClose={() => showChangeModal(false)}
                />
            }
        </div>);
    }
}

Billing.propTypes = {
    defaultPaymentMethod: PropTypes.object,
    payments: PropTypes.array.isRequired,
    page: PropTypes.shape({
        showChangeModal: PropTypes.bool.isRequired,
    }).isRequired,
    billingPeriod: PropTypes.shape({
        cycleStart: PropTypes.string.isRequired,
        cycleEnd: PropTypes.string.isRequired,
        totalViews: PropTypes.number.isRequired,
    }),
    paymentPlan: PropTypes.shape({
        viewsPerMonth: PropTypes.number.isRequired,
    }),

    loadPageData: PropTypes.func.isRequired,
    showChangeModal: PropTypes.func.isRequired,
    getClientToken: PropTypes.func.isRequired,
    changePaymentMethod: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const payments = state.session.payments.map(id => state.db.payment[id]);
    const paymentMethods = state.session.paymentMethods.map(token => state.db.paymentMethod[token]);
    const paymentPlan = state.db.paymentPlan[state.session.paymentPlan];

    return {
        payments,
        paymentPlan,
        defaultPaymentMethod: find(paymentMethods, { default: true }),
        billingPeriod: state.session.billingPeriod,
    };
}

export default compose(
    pageify({ path: 'dashboard.billing' }),
    connect(mapStateToProps, assign({}, billingActions, paymentActions, alertActions))
)(Billing);
