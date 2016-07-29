import React, { PropTypes } from 'react';

export default function PaymentMethod({
    loading,
    method,
    onChangeMethod,
}) {
    return (<div className="billing-summary card-item col-md-12">
        <div className="row">
        {loading && !method && (<div className="spinner-contained">
            <div className="spinner-position">
                <div className="animation-target">
                </div>
            </div>
        </div>)}
        {(() => {
            switch ((method || {}).type) {
            case 'creditCard':
                return (
                    <div className="col-md-8">
                        <h3>Active payment method</h3>
                        <h4>{method.cardType} ****{method.last4}</h4>
                        <h4>{method.cardholderName}</h4>
                        <p>Expires {method.expirationDate}</p>
                    </div>
                );
            case 'paypal':
                return (
                    <div className="col-md-8">
                        <h3>Active payment method</h3>
                        <h4>Paypal {method.email}</h4>
                    </div>
                );
            default:
                return (
                    <div className="col-md-8">
                        <h3>Active payment method</h3>
                        <h4>No Payment Method on File</h4>
                    </div>
                );
            }
        })()}
            <div className="col-md-4 btn-wrap">
                <button
                    type="button"
                    className="btn btn-primary btn-lg btn-block"
                    onClick={onChangeMethod}
                >
                    {method ? 'Change' : 'Add'}
                </button>
            </div>
        </div>
    </div>);
}

PaymentMethod.propTypes = {
    method: PropTypes.object,
    onChangeMethod: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};
