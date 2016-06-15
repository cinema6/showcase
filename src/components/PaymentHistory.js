import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { formatMoney } from 'accounting';

function format(date) {
    return date.format('MMM D');
}

function getBillingPeriod(payment) {
    const start = moment(payment.createdAt);
    const end = moment(start).add(1, 'month').subtract(1, 'day');

    return `${format(start)} - ${format(end)}`;
}

export default class PaymentHistory extends Component {
    render() {
        const {
            payments,
            loading,
        } = this.props;

        return (<table className="table table-hover stats-list">
            <thead>
                <tr>
                    <th>
                        <h4>Date</h4>
                    </th>
                    <th className="text-center">
                        <h4>Billing Period</h4>
                    </th>
                    <th className="text-center hidden-xs">
                        <h4>Payment Method</h4>
                    </th>
                    <th className="text-right">
                        <h4>Amount</h4>
                    </th>
                </tr>
            </thead>
            <tbody>
                {payments.length < 1 && loading && (
                    <tr style={{ position: 'relative' }}><td colSpan="4">
                        <div className="spinner-contained">
                            <div className="spinner-position">
                                <div className="animation-target">
                                </div>
                            </div>
                        </div>
                    </td></tr>
                    )}
                {payments.length < 1 && !loading && (
                    <tr><td colSpan="4"><h4>No Payments Have Been Made</h4></td></tr>
                )}
                {payments.map(payment => <tr key={payment.id}>
                    <th scope="row">
                        <h4>{format(moment(payment.createdAt))}</h4>
                    </th>
                    <td>
                        <h4>{getBillingPeriod(payment)}</h4>
                    </td>
                    <td className="hidden-xs">
                        <h4>{(method => {
                            switch (method.type) {
                            case 'creditCard':
                                return `${method.cardType} ****${method.last4}`;
                            case 'paypal':
                                return `Paypal ${method.email}`;
                            default:
                                return '';
                            }
                        })(payment.method)}</h4>
                    </td>
                    <td className="text-right">
                        <h4>{formatMoney(payment.amount)}</h4>
                    </td>
                </tr>)}
            </tbody>
        </table>);
    }
}

PaymentHistory.propTypes = {
    payments: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    loading: PropTypes.bool,
};
