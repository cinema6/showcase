import React, { PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import AdPreview from './AdPreview';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import { productDataFromCampaign } from '../utils/campaign';

const CARD_OPTIONS = {
    cardType: 'showcase-app',
    advanceInterval: 3,
};
const PLACEMENT_OPTIONS = {
    type: 'mobile-card',
    branding: 'showcase-app--interstitial',
};

export default function AdPreviewModal({
    show,
    campaign,

    onClose,
}) {
    return (<Modal className="app-preview-modal" show={show} onHide={onClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
            <AdPreview
                productData={productDataFromCampaign(campaign)}
                cardOptions={CARD_OPTIONS}
                placementOptions={PLACEMENT_OPTIONS}
                factory={createInterstitialFactory}
            />
        </Modal.Body>
    </Modal>);
}
AdPreviewModal.propTypes = {
    show: PropTypes.bool.isRequired,
    campaign: PropTypes.object,

    onClose: PropTypes.func.isRequired,
};
