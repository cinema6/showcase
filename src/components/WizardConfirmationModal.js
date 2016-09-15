import React, { PropTypes } from 'react';
import BraintreeCreditCardForm from './BraintreeCreditCardForm';
import numeral from 'numeral';
import moment from 'moment';

function format(number) {
    return numeral(number).format('0,0');
}

export default function WizardConfirmationModal({
    freeViews,

    getToken,
    onSubmit,
    handleClose,
    planPrice,
    trialLength,
}) {
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
                    {!!freeViews && (
                        <h4>Get {format(freeViews)} views for FREE. Cancel anytime.</h4>
                    )}
                    {!freeViews && (
                        <h4>Reach thousands of potential app users</h4>
                    )}
                    <div className="alert alert-info">
                        You will be charged{
                            planPrice ? ` $${planPrice}/month ` : ' '
                        }starting {
                            trialLength > 0 ?
                                moment().add(trialLength, 'days').format('MMM D, YYYY') :
                                'today'
                        }
                    </div>
                </div>
                <div className="modal-body text-center">
                    <BraintreeCreditCardForm
                        submitText="Start Your Free Trial"
                        getToken={getToken}
                        onSubmit={onSubmit}
                    />
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
    freeViews: PropTypes.number.isRequired,
    trialLength: PropTypes.number.isRequired,
    planPrice: PropTypes.number,
};

WizardConfirmationModal.defaultProps = {
    freeViews: 0,
    trialLength: 0,
};
