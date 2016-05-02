import React, { Component, PropTypes } from 'react';

export default class PaymentMethod extends Component {
    render() {
        const {
            loading,
            method,
            onChangeMethod
        } = this.props;

        if (!method && !loading) {
            return <div>Failed to load.</div>;
        }

        if (!method) {
            return <div>Loading!</div>;
        }

        return (
            <div>
                <h3>Active Payment Method</h3>
                {(() => {
                    switch (method.type) {
                    case 'creditCard':
                        return (
                            <div>
                                <p>{method.cardType} ****{method.last4}</p>
                                <p>{method.cardholderName}</p>
                                <p>Expires {method.expirationDate}</p>
                            </div>
                        );
                    case 'paypal':
                        return (
                            <div>
                                <p>Paypal {method.email}</p>
                            </div>
                        );
                    }
                })()}
                <button onClick={onChangeMethod}>Change</button>
            </div>
        );
    }
}

PaymentMethod.propTypes = {
    method: PropTypes.object,
    onChangeMethod: PropTypes.func.isRequired,
    loading: PropTypes.bool
};
