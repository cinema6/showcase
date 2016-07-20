import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { assign, find } from 'lodash';
import PaymentMethod from '../../components/PaymentMethod';
import PaymentHistory from '../../components/PaymentHistory';
import ChangePaymentMethodModal from '../../components/ChangePaymentMethodModal';
import * as billingActions from '../../actions/billing';
import * as paymentActions from '../../actions/payment';
import * as alertActions from '../../actions/alert';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import config from '../../../config';
import moment from 'moment';
import numeral from 'numeral';

const DASH = '\u2014';
const [paymentPlan] = config.paymentPlans;

const CANCEL_ACCOUNT_HREF = 'mailto:billing@reelcontent.com?subject=Cancel My Account';

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

            showChangeModal,
            getClientToken,
            changePaymentMethod,
            showAlert,
        } = this.props;

        const billingEnd = billingPeriod && moment(billingPeriod.cycleEnd);
        const nextDueDate = billingEnd && moment(billingEnd).add(1, 'day');

        return (<div className="container main-section campaign-stats" style={{ marginTop: 100 }}>
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
                                            billingPeriod &&
                                            numeral(billingPeriod.totalViews).format('0,0')
                                        ) || DASH} views
                                    </h3>
                                </div>
                                <div className="data-stacked">
                                    <h4>Next Payment due</h4>
                                    <h3>
                                        ${paymentPlan.price} on {
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
                                    className="btn-block"
                                    onClick={() => showAlert({
                                        title: 'Cancel Your Subscription',
                                        description: (<span>
                                            Are you sure you want to cancel your subscription? Your
                                            app will lose the exposure it's getting if you choose to
                                            cancel. If you still want to cancel, please email us
                                            at <a href={CANCEL_ACCOUNT_HREF}>
                                                billing@reelcontent.com
                                            </a> from the email that is connected to your account.
                                            Your membership will be suspended at the end of current
                                            billing period.
                                        </span>),
                                        buttons: [
                                            { text: 'Dismiss', onSelect: dismiss => dismiss() },
                                        ],
                                    })}
                                >
                                    Cancel
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

    loadPageData: PropTypes.func.isRequired,
    showChangeModal: PropTypes.func.isRequired,
    getClientToken: PropTypes.func.isRequired,
    changePaymentMethod: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const payments = state.session.payments.map(id => state.db.payment[id]);
    const paymentMethods = state.session.paymentMethods.map(token => state.db.paymentMethod[token]);

    return {
        payments,
        defaultPaymentMethod: find(paymentMethods, { default: true }),
        billingPeriod: state.session.billingPeriod,
    };
}

export default compose(
    pageify({ path: 'dashboard.billing' }),
    connect(mapStateToProps, assign({}, billingActions, paymentActions, alertActions))
)(Billing);
