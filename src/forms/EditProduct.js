'use strict';

import { reduxForm } from 'redux-form';
import React, { Component, PropTypes } from 'react';

class EditProduct extends Component {
    render() {
        const {
            fields: { title, description },
            handleSubmit
        } = this.props;

        return (<form onSubmit={handleSubmit}>
            <fieldset>
                <label>Title</label>
                <input type="text" {...title} />
            </fieldset>
            <fieldset>
                <label>Description</label>
                <textarea {...description} />
            </fieldset>

            <button type="submit">Proceed</button>
        </form>);
    }
}

EditProduct.propTypes = {
    fields: PropTypes.shape({
        title: PropTypes.object.isRequired,
        description: PropTypes.object.isRequired
    }).isRequired,

    handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
    form: 'productWizard',
    fields: ['title', 'description'],
    destroyOnUnmount: false
})(EditProduct);
