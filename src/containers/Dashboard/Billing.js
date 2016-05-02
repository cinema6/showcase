'use strict';

import { Component } from 'react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { find } from 'lodash';
import PaymentMethod from '../../components/PaymentMethod';
import PaymentHistory from '../../components/PaymentHistory';
import ChangePaymentMethodModal from '../../components/ChangePaymentMethodModal';
import { showChangeModal, loadPageData, changePaymentMethod } from '../../actions/billing';
import { getClientToken } from '../../actions/payment';

class Billing extends Component {
    componentWillMount() {
        return this.props.loadPageData();
    }

    render() {
        const {
            defaultPaymentMethod,
            payments,
            page,

            showChangeModal,
            getClientToken,
            changePaymentMethod
        } = this.props;

        return (
            <section>
                <h3>Billing Details</h3>
                <PaymentMethod loading={page.loading}
                    method={defaultPaymentMethod}
                    onChangeMethod={() => {
                        showChangeModal(true);
                    }} />
                <PaymentHistory loading={page.loading}
                    payments={payments} />

                {page.showChangeModal &&
                    <ChangePaymentMethodModal getToken={getClientToken}
                        onSubmit={changePaymentMethod}
                        handleClose={() => showChangeModal(false)} />
                }
            </section>
        );
    }
}

Billing.propTypes = {
    defaultPaymentMethod: PropTypes.object,
    payments: PropTypes.array.isRequired,
    page: PropTypes.shape({
        showChangeModal: PropTypes.bool.isRequired
    }).isRequired,

    loadPageData: PropTypes.func.isRequired,
    showChangeModal: PropTypes.func.isRequired,
    getClientToken: PropTypes.func.isRequired,
    changePaymentMethod: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const payments = state.session.payments.map(id => state.db.payment[id]);
    const paymentMethods = state.session.paymentMethods.map(token => state.db.paymentMethod[token]);

    return {
        payments,
        defaultPaymentMethod: find(paymentMethods, { default: true })
    };
}

export default compose(
    pageify({ path: 'dashboard.billing' }),
    connect(mapStateToProps, {
        loadPageData,
        showChangeModal,
        getClientToken,
        changePaymentMethod
    })
)(Billing);
