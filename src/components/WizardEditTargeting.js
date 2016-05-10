'use strict';

import React, { Component, PropTypes } from 'react';
import EditTargetingForm from '../forms/EditTargeting';

export default class WizardEditTargeting extends Component {
    render() {
        const {
            targeting,

            onFinish
        } = this.props;

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

        return (<div className="col-md-5 col-sm-6 col-xs-12 col-middle animated fadeInRight">
            <h1>Who is your app for?</h1>
            <EditTargetingForm initialValues={targeting} onSubmit={values => onFinish(values)} />
        </div>);
    }
}

WizardEditTargeting.propTypes = {
    targeting: PropTypes.shape({
        age: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired
    }),

    onFinish: PropTypes.func.isRequired
};
