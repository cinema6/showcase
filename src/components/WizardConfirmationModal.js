'use strict';

import React, { Component, PropTypes } from 'react';
import BraintreeCreditCardForm from './BraintreeCreditCardForm';

export default class WizardConfirmationModal extends Component {
    render() {
        const {
            getToken,
            onSubmit,
            handleClose
        } = this.props;

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
                        <h1 className="modal-title" id="myPaymentModal">Enter Payment Details</h1>
                        <h4>to launch and reach 2,000 users</h4>
                    </div>
                    <div className="modal-body text-center">
                        <BraintreeCreditCardForm getToken={getToken} onSubmit={onSubmit} />
                    </div>
                </div>
            </div>
        </div>);
    }
}

WizardConfirmationModal.propTypes = {
    getToken: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
};
