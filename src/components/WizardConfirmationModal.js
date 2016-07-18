import React, { PropTypes } from 'react';
import BraintreeCreditCardForm from './BraintreeCreditCardForm';

export default function WizardConfirmationModal({
    startDate,

    getToken,
    onSubmit,
    handleClose,
}) {
    const start = (startDate && startDate.format('MM/DD/YYYY')) || '...';

    return (<div className="modal payment-modal fade in show" id="pmtModal" role="dialog">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header text-center">
                    <button
                        type="button"
                        onClick={() => handleClose()}
                        className="close"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                    <h1 className="modal-title" id="myPaymentModal">Start promoting your app</h1>
                    <h4>Get 1000 views for FREE. {/*Show the count of free views based on 
                    promotion*/}
                    Cancel anytime.</h4>
                    <h4>Reach thousands fo potential app users</h4> {/*Show this message if 
                    there is no promotion associated with the product*/}
                </div>
                <div className="modal-body text-center">
                    <BraintreeCreditCardForm
                        submitText="Start Your Free Trial"
                        getToken={getToken}
                        onSubmit={onSubmit}
                    />
                    {/*<div className="payment-charge-info">
                        Reach 2,000 users for only $49.99/month after your trial
                    </div>*/}
                    <div className="secured-locked">
                        <div className="signup__secured">
                            <span className="signup__secured--icon">
                                <i className="fa fa-shield" />
                            </span>
                            <span
                                className="signup__secured--label"
                                title="RSA 2048bit security"
                            >
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

WizardConfirmationModal.propTypes = {
    getToken: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    startDate: PropTypes.shape({
        format: PropTypes.func.isRequired,
    }),
};
