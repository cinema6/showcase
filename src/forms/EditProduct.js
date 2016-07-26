import { reduxForm } from 'redux-form';
import React, { PropTypes } from 'react';
import classnames from 'classnames';

function EditProduct({
    fields: { name, description },
    handleSubmit,
    addVideo,
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
        <button
            type="button"
            onClick={addVideo}
        >
            Add Video
        </button>
        <button
            type="submit"
            className={classnames('col-sm-6 col-xs-12 btn btn-danger btn-lg', {
                'btn-waiting': submitting,
            })}
        >
            Next
        </button>
    </form>);
}

EditProduct.propTypes = {
    fields: PropTypes.shape({
        name: PropTypes.object.isRequired,
        description: PropTypes.object.isRequired,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,

    handleSubmit: PropTypes.func.isRequired,
    addVideo: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'productWizard',
    fields: ['name', 'description'],
    destroyOnUnmount: false,
})(EditProduct);
