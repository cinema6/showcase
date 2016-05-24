'use strict';

import React, { Component, PropTypes } from 'react';
import BraintreeCreditCardForm from './BraintreeCreditCardForm';

export default class WizardConfirmationModal extends Component {
    render() {
        const {
            startDate,

            getToken,
            onSubmit,
            handleClose
        } = this.props;

        const start = (startDate && startDate.format('MM/DD/YYYY')) || '...';

        return (<div className="modal payment-modal fade in show" id="pmtModal" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header text-center">
                        <button type="button"
                            onClick={() => handleClose()}
                            className="close"
                            aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h1 className="modal-title" id="myPaymentModal">Start Your FREE Trial</h1>
                        <h4>You will not be charged until after your free trial ends on {start}.
                            Cancel anytime.</h4>
                    </div>
                    <div className="modal-body text-center">
                        <BraintreeCreditCardForm submitText="Start Your Free Trial"
                            getToken={getToken}
                            onSubmit={onSubmit} />
                        <div className="payment-charge-info">
                            Reach 2,000 users for only $49.99/month after your trial
                        </div>
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

WizardConfirmationModal.propTypes = {
    getToken: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    startDate: PropTypes.shape({
        format: PropTypes.func.isRequired
    })
};
