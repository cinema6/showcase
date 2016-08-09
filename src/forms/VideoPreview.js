import { reduxForm } from 'redux-form';
import React, { PropTypes } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function VideoPreview({
    fields: { url },
    handleSubmit,
    submitting,
}) {
    return (<form onSubmit={handleSubmit}>
        <div className="input-group">
            <input
                type="text"
                {...url}
                className="form-control"
                placeholder="Paste YouTube link..."
            />
            <span className="input-group-btn input-group-btn-primary">
                <button className="btn btn-primary" type="button">Add</button>
            </span>
        </div>
        <span id="helpBlock" className="help-block">
            Video should be under 60 seconds.
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip>
                    Short and sweet delivers better ad performance and more leads.
                </Tooltip>}
            ><a href="#">Why?</a>
            </OverlayTrigger>
        </span>
        <div className="embed-responsive embed-responsive-16by9">
            <iframe
                className="embed-responsive-item"
                width="560"
                height="315"
                src="https://www.youtube.com/embed/MWmbLpeoLZA"
                frameborder="0"
                allowfullscreen
            >
            </iframe>
        </div>
        <div className="clearfix"></div>
        <br />
        {/* CTA for when the plan supports video */}
        <div className="form-group">
            <button className="btn btn-primary btn-lg">
                Promote this video
            </button>
        </div>
        {/* CTA and message for when the plan doesn't support video */}
        <div className="form-group">
            <button className="btn btn-primary btn-lg">
                Preview this video
            </button>
        </div>
        <div className="alert alert-warning">Video ads are available exclusively to
        Pro &amp; Business users only. However, you can preview how your video
        ad would look like.</div>
    </form>);
}

VideoPreview.propTypes = {
    fields: PropTypes.shape({
        url: PropTypes.object.isRequired,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,

    handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'videoPreview',
    fields: ['url'],
    destroyOnUnmount: false,
})(VideoPreview);
