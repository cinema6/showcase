import React, { Component, PropTypes } from 'react';
import BraintreeCreditCardForm from './BraintreeCreditCardForm';

export default class ChangePaymentMethodModal extends Component {
    render() {
        return (
            <div>
                <h1>Payment Details</h1>
                <button onClick={this.props.handleClose}>Close</button>
                <BraintreeCreditCardForm getToken={this.props.getToken}
                    onSubmit={this.props.onSubmit} />
            </div>
        );
    }
}

ChangePaymentMethodModal.propTypes = {
    handleClose: PropTypes.func.isRequired,
    getToken: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
