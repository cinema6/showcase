import { reduxForm } from 'redux-form';
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import VideoInput from '../components/VideoInput';

function EditProduct({
    fields: { name, description, video },
    handleSubmit,
    submitting,
}) {
    return (<form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="adTitle-input">Title</label>
            <input {...name} type="text" id="adTitle-input" className="form-control" />
        </div>
        <div className="form-group">
            <label htmlFor="adDesc-textarea">Description</label>
            <textarea {...description} className="form-control" id="adDesc-textarea" rows={3} />
        </div>
        <VideoInput {...video} />
        <button
            type="submit"
            className={classnames('col-sm-6 col-xs-12 btn btn-danger btn-lg', {
                'btn-waiting': submitting,
            })}
        >
            Next
        </button>
        <div className="clearfix" />
        {/* Show this message after user ads a video for preview but doesn't have a video
            supported plan*/}
        <div className="unsupported-plan">
            * Video Ad is shown for preview only and will not be added to campaign.
            You can upgrade your plan to promote videos.
        </div>
    </form>);
}

EditProduct.propTypes = {
    fields: PropTypes.shape({
        name: PropTypes.object.isRequired,
        description: PropTypes.object.isRequired,
        video: PropTypes.object.isRequired,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,

    handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'productWizard',
    fields: ['name', 'description', 'video'],
    destroyOnUnmount: false,
})(EditProduct);
