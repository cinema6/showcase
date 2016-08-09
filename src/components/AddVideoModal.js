import React, { PropTypes } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import VideoPreviewForm from '../forms/VideoPreview';

export default function AddVideoModal({
    action,
    onSubmit,
    onClose,
}) {
    return (<div className="modal fade in show">
        {action === 'edit' && (<div
            className="modal-dialog"
            style={{ marginTop: 150 }}
            role="document"
        >
            <div className="modal-content">
                <div className="modal-header text-center">
                    <button onClick={onClose} className="close" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h1 className="modal-title" id="addVideo-modal">Add Your Video</h1>
                </div>
                <div className="modal-body text-center">
                    <VideoPreviewForm onSubmit={({ url }) => onSubmit(url)} />
                </div>
            </div>
        </div>)}
        {action === 'delete' && (<div className="modal-sm modal-dialog">
            <div className="modal-content" role="document">
                <div className="modal-header">
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 className="modal-title">Delete Your Video</h4>
                </div>
                <div className="modal-body">
                    <p><span><strong>Are you sure you want to delete your video? </strong><br />
                    Your video ad will stop showing and the unused views will be applied to app ad.
                    </span></p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default">Cancel</button>
                    <button type="button" className="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>)}
    </div>);
}

AddVideoModal.propTypes = {
    action: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};
