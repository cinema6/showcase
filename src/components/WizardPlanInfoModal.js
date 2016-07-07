import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import classnames from 'classnames';
import moment from 'moment';
import config from '../../config';
import { estimateImpressions } from '../utils/billing';
import numeral from 'numeral';

const [paymentPlan] = config.paymentPlans;

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

function impressions(length) {
    return numeral(estimateImpressions({
        end: moment().add(length, 'days'),
        viewsPerDay: paymentPlan.viewsPerDay,
    })).format('0,0');
}

export default function WizardPlanInfoModal({
    show,
    actionPending,
    onClose,
    onContinue,
    trialLength,
}) {
    const title = trialLength ?
        `Reach ${impressions(trialLength)} people for FREE` :
        'Reach thousands of people';
    const cta = trialLength ?
        `Get ${trialText(trialLength)} FREE trial` :
        'Continue';

    return (<Modal show={show} className="trial-modal" onHide={onClose}>
        <Modal.Header className="text-center" closeButton>
            <h1 className="modal-title">{title}</h1>
            {!!trialLength && <p>Your first {trialText(trialLength)} of advertising is on us</p>}
        </Modal.Header>
        <Modal.Body className="text-center">
            <div className="row">
                <div className="trail-wrap">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-xs-12 col-middle">
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
                                        <span>Promote 1 App</span>
                                    </div>
                                    <div className="plan-box-item stacked-item">
                                        <span>Real-time Stats</span>
                                    </div>
                                    <div className="plan-box-item stacked-item last-item">
                                        <h3>$49.99</h3>
                                        <span>/mo</span>
                                    </div>
                                </div>
                                <div className="plan-box-footer plan-selected">
                                    <h4>Selected</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-md-4 col-xs-12 col-middle">
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
                                        <span>Promote 3 Apps</span>
                                    </div>
                                    <div className="plan-box-item stacked-item">
                                        <span>Real-time Stats</span>
                                    </div>
                                    <div className="plan-box-item stacked-item last-item">
                                        <h3>$149.99</h3>
                                        <span>/mo</span>
                                    </div>
                                </div>
                                <div className="plan-box-footer plan-coming-soon">
                                    <h4>coming soon</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-md-4 col-xs-12 col-middle">
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
                                        <span>Promote 10 Apps</span>
                                    </div>
                                    <div className="plan-box-item stacked-item">
                                        <span>Real-time Stats</span>
                                    </div>
                                    <div className="plan-box-item stacked-item last-item">
                                        <h3>$499.99</h3>
                                        <span>/mo</span>
                                    </div>
                                </div>
                                <div className="plan-box-footer plan-coming-soon">
                                    <h4>coming soon</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-middle text-left">
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
                    </div>
                    <div className="clearfix">
                    </div>
                    <div className="col-md-12 text-center">
                        <br />
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
                        </Button>
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

    onClose: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
};
WizardPlanInfoModal.defaultProps = {
    actionPending: false,
    trialLength: 0,
};
