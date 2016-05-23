import React, { Component, PropTypes } from 'react';
import BraintreeCreditCardForm from './BraintreeCreditCardForm';

export default class ChangePaymentMethodModal extends Component {
    render() {
        const {
            getToken,
            handleClose,
            onSubmit
        } = this.props;
        return (<div className="modal payment-modal fade in show">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header text-center">
                        <button onClick={handleClose} className="close" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h1 className="modal-title" id="myPaymentModal">Change Payment Method</h1>
                    </div>
                    <div className="modal-body text-center">
                        <BraintreeCreditCardForm getToken={getToken} onSubmit={onSubmit} />
                        <div className="secured-locked">
                            <div className="signup__secured">
                                <span className="signup__secured--icon">
                                    <i className="fa fa-shield" />
                                </span>
                                <span className="signup__secured--label" 
                                    title="RSA 2048bit security">
                                    Secured Platform
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <p>Your information is secured with 256-bit RSA encryption</p>
                    </div>
                </div>
            </div>
        </div>);
    }
}

ChangePaymentMethodModal.propTypes = {
    handleClose: PropTypes.func.isRequired,
    getToken: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
