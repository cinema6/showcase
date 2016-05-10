'use strict';

import { reduxForm } from 'redux-form';
import React, { Component, PropTypes } from 'react';

class EditProduct extends Component {
    render() {
        const {
            fields: { name, description },
            handleSubmit
        } = this.props;

        return (<form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="adTitle-input">Title</label>
                <input {...name} type="text" id="adTitle-input" className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="adDesc-textarea">Description</label>
                <textarea {...description} className="form-control" id="adDesc-textarea" rows={2} />
            </div>
            <button type="submit" className="col-sm-6 col-xs-12 btn btn-danger btn-lg">Next</button>
        </form>);
    }
}

EditProduct.propTypes = {
    fields: PropTypes.shape({
        name: PropTypes.object.isRequired,
        description: PropTypes.object.isRequired
    }).isRequired,

    handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
    form: 'productWizard',
    fields: ['name', 'description'],
    destroyOnUnmount: false
})(EditProduct);
