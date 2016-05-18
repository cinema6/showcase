import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import copyable from '../hocs/copyable';

const CopyButton = copyable()(Button);

export default class InstallTrackingSetupModal extends Component {
    render() {
        const {
            show,
            campaignId,

            onClose,
            onCopyCampaignIdSuccess,
            onCopyCampaignIdError
        } = this.props;

        return (<Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Track Your Installs</Modal.Title>
                <p>Add a tracking pixel to track your installs</p>
            </Modal.Header>
            <Modal.Body>
                <div className="tracking-setup">
                    <div className="col-md-8 col-md-offset-2 text-center">
                        <form>
                            <div className="form-group">
                                <label htmlFor="usernameInput">Product ID</label>
                                <input type="text" value={campaignId} readOnly />
                            </div>
                            <CopyButton copyText={campaignId}
                                onCopySuccess={onCopyCampaignIdSuccess}
                                onCopyError={onCopyCampaignIdError}
                                bsSize="lg"
                                bsStyle="primary">
                                Copy
                            </CopyButton>
                        </form>
                        <div className="clearfix" />
                        <hr />
                        <p>Follow the setup instructions on the link below</p>
                        <Button bsSize="lg"
                            bsStyle="primary"
                            href="https://github.com/cinema6/RCAnalytics#installation"
                            target="_blank"
                            block>
                            View Instructions
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>);
    }
}

InstallTrackingSetupModal.propTypes = {
    show: PropTypes.bool.isRequired,
    campaignId: PropTypes.string.isRequired,

    onClose: PropTypes.func.isRequired,
    onCopyCampaignIdSuccess: PropTypes.func,
    onCopyCampaignIdError: PropTypes.func
};
