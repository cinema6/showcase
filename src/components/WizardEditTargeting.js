import React, { PropTypes } from 'react';
import EditTargetingForm from '../forms/EditTargeting';

export default function WizardEditTargeting({
    targeting,
    categories,

    onFinish,
}) {
    if (!targeting) {
        return (<div className="col-md-5 col-sm-6 col-xs-12 col-middle">
            <div className="spinner-contained">
                <div className="spinner-position">
                    <div className="animation-target">
                    </div>
                </div>
            </div>
        </div>);
    }

    return (<div className="app-details col-md-6 col-sm-6 col-xs-12 col-middle animated fadeIn">
        <h1>Who is your app for?</h1>
        <EditTargetingForm
            initialValues={targeting}
            categories={categories}
            onSubmit={values => onFinish(values)}
        />
    </div>);
}

WizardEditTargeting.propTypes = {
    targeting: PropTypes.shape({
        age: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        gender: PropTypes.string.isRequired,
    }),
    categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,

    onFinish: PropTypes.func.isRequired,
};
