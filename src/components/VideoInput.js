import React, { Component, PropTypes } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import AddVideoModal from './AddVideoModal';

export default class VideoInput extends Component {
    constructor(...args) {
        super(...args);

        this.showModal = this.showModal.bind(this);

        this.state = {
            showModal: false,
            action: null,
        };
    }

    showModal(e, bool, action) {
        e.preventDefault();

        this.setState({
            showModal: bool,
            action,
        });
    }

    render() {
        const {
            value,
            onChange,
        } = this.props;

        const {
            showModal,
            action,
        } = this.state;

        return (<div className="form-group">
            <label htmlFor="addVideo-modal">Add Video (optional)
                &nbsp;
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>
                        You can promote your app using your YouTube video
                    </Tooltip>}
                >
                    <i className="fa fa-question-circle" aria-hidden="true" />
                </OverlayTrigger>
            </label><br />
            {value && (<a href={value} className="btn-link">
                {value}
            </a>)}
            <div role="toolbar" className="btn-toolbar">
                <div className="clearfix"></div>
                {/* Hide this button when there is an existing video tied to the app campaign */}
                {!value && (<button
                    onClick={(e) => this.showModal(e, true, 'edit')}
                    className="btn btn-primary"
                >
                    <i className="fa fa-file-video-o" aria-hidden="true"></i> Add Video
                </button>)}

                {/* Show these buttons when video has already been added to the app campaign */}
                {value && (<span>
                    <button className="btn btn-primary">
                        <i className="fa fa-file-video-o" aria-hidden="true"></i> Edit Video
                    </button>
                    <button className="btn btn-primary">
                        <i className="fa fa-trash-o" aria-hidden="true"></i> Delete Video
                    </button>
                </span>)}
            </div>
            {showModal && (<AddVideoModal
                action={action}
                {/* we also want to close the modal when onSubmit is called */}
                onSubmit={(url) => onChange(url)}
                onClose={(e) => this.showModal(e, false)}
            />)}
        </div>);
    }
}

VideoInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
