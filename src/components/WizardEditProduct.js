import React, { PropTypes } from 'react';
import EditProductForm from '../forms/EditProduct';

export default function WizardEditProduct({
    productData,
    onFinish,
}) {
    if (!productData) {
        return (<div className="app-details col-md-5 col-sm-6 col-xs-12 col-middle">
            <div className="spinner-contained">
                <div className="spinner-position">
                    <div className="animation-target">
                    </div>
                </div>
            </div>
        </div>);
    }

    const { name, description } = productData;

    return (<div className="app-details col-md-6 col-sm-6 col-xs-12 col-middle animated fadeIn">
        <h1>App Details</h1>
        <EditProductForm
            initialValues={{ name, description, video }}
            onSubmit={values => onFinish(values)}
        />
    </div>);
}

WizardEditProduct.propTypes = {
    productData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        video: PropTypes.string.isRequired,
    }),

    onFinish: PropTypes.func.isRequired,
};
