import React, { PropTypes } from 'react';

export default function AddVideoModal({
    handleClose,
    handleSubmit,
}) {
    return (<div className="modal payment-modal fade in show">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header text-center">
                    <button onClick={handleClose} className="close" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h1 className="modal-title" id="myPaymentModal">Add Video</h1>
                </div>
                <div className="modal-body text-center">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="videoTitle-input">Title</label>
                            <input type="text" id="videoTitle-input" className="form-control" />
                        </div>
                        <button
                            type="submit"
                            className="col-sm-6 col-xs-12 btn btn-danger btn-lg"
                        >
                            Done
                        </button>
                    </form>
                </div>
                <div className="modal-footer">
                    <p>Footer text</p>
                </div>
            </div>
        </div>
    </div>);
}

AddVideoModal.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};
