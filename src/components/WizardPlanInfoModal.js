import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import classnames from 'classnames';

export default class WizardPlanInfoModal extends Component {
    render() {
        const {
            show,
            actionPending,
            promotionString,
            onClose,
            onContinue,
            numOfImpressions
        } = this.props;

        return (<Modal show={show} className="trial-modal" onHide={onClose}>
            <Modal.Header className="text-center" closeButton>
                <h1 className="modal-title">Reach {numOfImpressions} people for FREE</h1>
                <p>Your {promotionString} of advertising is on us</p>
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
                                            <span>Basic Stats</span>
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
                                            <span>Custom Reports</span>
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
                                            <span>Custom Reports</span>
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
                            <Button onClick={onContinue}
                                disabled={actionPending}
                                className={classnames('col-xs-12', {
                                    'btn-waiting': actionPending
                                })}
                                bsSize="lg"
                                bsStyle="danger">
                                Get {promotionString} FREE trial
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>);
    }
}
WizardPlanInfoModal.propTypes = {
    show: PropTypes.bool.isRequired,
    actionPending: PropTypes.bool.isRequired,

    onClose: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    promotionString: PropTypes.string.isRequired,
    numOfImpressions: PropTypes.number.isRequired
};
WizardPlanInfoModal.defaultProps = {
    actionPending: false
};
