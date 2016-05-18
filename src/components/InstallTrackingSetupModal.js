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

        return (<Modal className="tracking-modal" show={show} onHide={onClose}>
            <Modal.Header closeButton className="text-center">
                <h2 className="modal-title">Track Your Installs</h2>
                <p>Add a tracking pixel to track your installs</p>
            </Modal.Header>
            <Modal.Body>
                <div className="tracking-setup">
                    <div className="col-md-8 col-md-offset-2 text-center">
                        <form>
                            <div className="form-group">
                                <label htmlFor="tracking-id">Product ID</label>
                                <input type="text" className="form-control text-center" id="tracking-id" value={campaignId} readOnly />
                            </div>
                            <CopyButton copyText={campaignId}
                                onCopySuccess={onCopyCampaignIdSuccess}
                                onCopyError={onCopyCampaignIdError}
                                bsSize="lg"
                                bsStyle="primary" className="btn-block">
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
