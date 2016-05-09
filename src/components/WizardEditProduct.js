'use strict';

import React, { Component, PropTypes } from 'react';
import EditProductForm from '../forms/EditProduct';

export default class WizardEditProduct extends Component {
    render() {
        const {
            productData: { name, description },
            onFinish
        } = this.props;

        return (<div className="app-details col-md-5 col-sm-6 col-xs-12 col-middle
            animated fadeInRight">
            <h1>App Details</h1>
            <EditProductForm initialValues={{ title: name, description }}
                onSubmit={values => onFinish(values)} />
        </div>);
    }
}

WizardEditProduct.propTypes = {
    productData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,

    onFinish: PropTypes.func.isRequired
};
