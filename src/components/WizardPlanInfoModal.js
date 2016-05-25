import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class WizardPlanInfoModal extends Component {
    render() {
        const {
            show,

            onClose,
            onContinue
        } = this.props;

        return (<Modal show={show} className="trial-modal" onHide={onClose}>
            <Modal.Header className="text-center" closeButton>
                <h1 className="modal-title">Get 2 Weeks FREE Trial</h1>
                <p>and reach 1,000 people at no cost</p>
            </Modal.Header>
            <Modal.Body className="text-center">
                <div className="row">
                    <div className="trail-wrap">
                        <div className="col-sm-12 col-xs-12 col-middle">
                            <div className="plan-info-box">
                                <div className="plan-box-header">
                                    <h3>Start now</h3>
                                </div>
                                <div className="plan-box-content">
                                    <div className="plan-box-item stacked-item">
                                        <span>Reach</span>
                                        <h2>2,000</h2>
                                        <span>people each month</span>
                                    </div>
                                    <hr />
                                    <div className="plan-box-item stacked-item">
                                        <span>Only</span>
                                        <h2>$49.99</h2>
                                        <span>per month</span>
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
                                className="col-xs-12"
                                bsSize="lg"
                                bsStyle="danger">
                                Continue
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

    onClose: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired
};