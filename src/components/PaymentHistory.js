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
            payments
        } = this.props;

        return (
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Billing Period</th>
                        <th>Payment Method</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => <tr key={payment.id}>
                        <td>{format(moment(payment.createdAt))}</td>
                        <td>{getBillingPeriod(payment)}</td>
                        <td>{(method => {
                            switch (method.type) {
                            case 'creditCard':
                                return `${method.cardType} ****${method.last4}`;
                            case 'paypal':
                                return `Paypal ${method.email}`;
                            }
                        })(payment.method)}</td>
                        <td>{formatMoney(payment.amount)}</td>
                    </tr>)}
                </tbody>
            </table>
        );
    }
}

PaymentHistory.propTypes = {
    payments: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired
    }).isRequired).isRequired
};
