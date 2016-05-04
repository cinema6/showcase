'use strict';

import React, { Component, PropTypes } from 'react';
import EditTargetingForm from '../forms/EditTargeting';

export default class WizardEditTargeting extends Component {
    render() {
        const {
            targeting,

            onFinish
        } = this.props;

        return (<div>
            <EditTargetingForm initialValues={targeting} onSubmit={values => onFinish(values)} />
        </div>);
    }
}

WizardEditTargeting.propTypes = {
    targeting: PropTypes.shape({
        age: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired
    }).isRequired,

    onFinish: PropTypes.func.isRequired
};
