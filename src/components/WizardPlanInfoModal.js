import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import classnames from 'classnames';
import numeral from 'numeral';

function trialText(length) {
    const denomination = (() => {
        if (length % 7 === 0) {
            return 'week';
        }

        if (length % 30 === 0) {
            return 'month';
        }

        return 'day';
    })();
    const amount = (() => {
        switch (denomination) {
        case 'week':
            return length / 7;
        case 'month':
            return length / 30;
        case 'day':
        default:
            return length;
        }
    })();

    return `${amount} ${denomination}${amount > 1 ? 's' : ''}`;
}

export default function WizardPlanInfoModal({
    show,
    actionPending,
    onClose,
    onContinue,
    trialLength,
    freeViews,
}) {
    const title = freeViews ?
        `Reach ${numeral(freeViews).format('0,0')} people for FREE` :
        'Reach thousands of people';
    const cta = trialLength ?
        `Get ${trialText(trialLength)} FREE trial` :
        'Continue';

    return (<Modal show={show} className="trial-modal" onHide={onClose}>
        <Modal.Header className="text-center" closeButton>
            <h1 className="modal-title">{title}</h1>
            <h1 className="modal-title">Change your plan</h1>
            {!!trialLength && <p>Your first {trialText(trialLength)} of advertising is on us</p>}
            <p>Start promoting your app now</p> {/* show this message when selecting first plan*/}
            <p>Your billing cycle ends on Feb 24</p> {/* show this message when upgrading/
            downgrading*/}
        </Modal.Header>
        <Modal.Body className="text-center">
            <div className="row">
                <div className="trail-wrap">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-xs-12 col-middle payment-plan">
                            <label htmlFor="starter-plan">
                                <input type="radio" name="plan-name" id="starter-plan" />
                                <div className="plan-info-box plan-starter">
                                    <div className="plan-box-header">
                                        <h3>Starter</h3>
                                    </div>
                                    <div className="plan-box-content">
                                        <div className="plan-box-item stacked-item">
                                            <h2>2,000</h2>
                                            <span>Unique Views</span>
                                        </div>
                                        <div className="plan-box-item stacked-item">
                                            <h3>$49.99</h3>
                                            <span>/mo</span>
                                        </div>
                                        <div className="plan-box-item stacked-item">
                                            <span>Promote 1 App</span>
                                        </div>
                                        <div className="plan-box-item stacked-item last-item">
                                            <span>Real-time Stats</span>
                                        </div>
                                    </div>
                                    <div className="plan-box-footer current-plan">
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className="col-sm-4 col-md-4 col-xs-12 col-middle payment-plan">
                            <label htmlFor="pro-plan">
                                <input type="radio" name="plan-name" id="pro-plan" />
                                <div className="plan-info-box plan-pro">
                                    <div className="plan-box-header">
                                        <h3>Pro</h3>
                                    </div>
                                    <div className="plan-box-content">
                                        <div className="plan-box-item stacked-item">
                                            <h2>7,500</h2>
                                            <span>Unique Views</span>
                                        </div>
                                        <div className="plan-box-item stacked-item">
                                            <h3>$149.99</h3>
                                            <span>/mo</span>
                                        </div>
                                        <div className="plan-box-item stacked-item">
                                            <span>Promote 3 Apps</span>
                                        </div>
                                        <div className="plan-box-item stacked-item last-item">
                                            <span>Real-time Stats</span>
                                        </div>
                                    </div>
                                    <div className="plan-box-footer choose-plan">

                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className="col-sm-4 col-md-4 col-xs-12 col-middle payment-plan">
                            <label htmlFor="business-plan">
                                <input type="radio" name="plan-name" id="business-plan" />
                                <div className="plan-info-box plan-business">
                                    <div className="plan-box-header">
                                        <h3>Business</h3>
                                    </div>
                                    <div className="plan-box-content">
                                        <div className="plan-box-item stacked-item">
                                            <h2>25,000</h2>
                                            <span>Unique Views</span>
                                        </div>
                                        <div className="plan-box-item stacked-item">
                                            <h3>$499.99</h3>
                                            <span>/mo</span>
                                        </div>
                                        <div className="plan-box-item stacked-item">
                                            <span>Promote 10 Apps</span>
                                        </div>
                                        <div className="plan-box-item stacked-item last-item">
                                            <span>Real-time Stats</span>
                                        </div>
                                    </div>
                                    <div className="plan-box-footer choose-plan">

                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-12 col-middle text-left">
                        <div className="alert alert-warning text-center">
                            <p>You must archive your ads to downgrade to this plan. If you select to
                            downgrade and have more than allowed apps for the selected plan, we will
                            archive the oldest ads for you to be able to downgrade.
                            </p>{/* show this paragraph when users have more apps than their new
                            plan */}
                        </div>

                        <div className="alert alert-success text-center">
                            Upgrade will take effect immediately.
                        </div> {/* show this alert when user tries to downgrade a plan*/}

                        <h3>We Give Your App The Royal Treatment With:</h3>
                        <ul className="checked-feature-list">
                            <li>
                                <h4>Stunning ad formats</h4>
                            </li>
                            <li>
                                <h4>Intelligent self-optimizing ads</h4>
                            </li>
                            <li>
                                <h4>Weekly performance reports</h4>
                            </li>
                            <li>
                                <h4>Insights into views, clicks, installs &amp; more
                                </h4>
                            </li>
                        </ul>
                        {/* Hide the UL and H3 above when users are upgrading/downgrading*/}
                    </div>
                    <div className="clearfix">
                    </div>
                    <div className="col-md-12 text-center">
                        <Button
                            onClick={onContinue}
                            disabled={actionPending}
                            className={classnames('col-xs-12', {
                                'btn-waiting': actionPending,
                            })}
                            bsSize="lg"
                            bsStyle="danger"
                        >
                            {cta}
                            Continue {/* Show "Continue" label if users need to add payment info*/}
                            Confirm {/* Show "Confirm" label when users are upgrading/downgrading*/}
                        </Button>
                    </div>
                    <div className="col-md-12 text-center cancel-plan">
                        <p>Don't want to run ads anymore?</p>
                        <a href="#">Cancel my plan</a>
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>);
}
WizardPlanInfoModal.propTypes = {
    show: PropTypes.bool.isRequired,
    actionPending: PropTypes.bool.isRequired,
    trialLength: PropTypes.number.isRequired,
    freeViews: PropTypes.number.isRequired,

    onClose: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
};
WizardPlanInfoModal.defaultProps = {
    actionPending: false,
    trialLength: 0,
    freeViews: 0,
};
