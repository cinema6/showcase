'use strict';

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import * as TARGETING from '../enums/targeting';
import classnames from 'classnames';

function value(field) {
    return field.visited ? field.value : field.initialValue;
}

class EditTargeting extends Component {
    render() {
        const {
            fields: { age, gender },
            handleSubmit,
            submitting
        } = this.props;

        return (<form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="targetAge-radio">Age</label>
                <radiogroup className="btn-group btn-group-justified" data-toggle="buttons">
                    <label className={classnames('btn btn-default', {
                        active: value(age) === TARGETING.AGE.ALL
                    })}>
                        <input type="radio" {...age} value={TARGETING.AGE.ALL}
                            checked={value(age) === TARGETING.AGE.ALL} /> Everyone
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: value(age) === TARGETING.AGE.ZERO_TO_TWELVE
                    })}>
                        <input type="radio" {...age} value={TARGETING.AGE.ZERO_TO_TWELVE}
                            checked={value(age) === TARGETING.AGE.ZERO_TO_TWELVE} /> Under 12
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: value(age) === TARGETING.AGE.THIRTEEN_PLUS
                    })}>
                        <input type="radio" {...age} value={TARGETING.AGE.THIRTEEN_PLUS}
                            checked={value(age) === TARGETING.AGE.THIRTEEN_PLUS} /> 13+
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: value(age) === TARGETING.AGE.EIGHTEEN_PLUS
                    })}>
                        <input type="radio" {...age} value={TARGETING.AGE.EIGHTEEN_PLUS}
                            checked={value(age) === TARGETING.AGE.EIGHTEEN_PLUS} /> 18+
                    </label>
                </radiogroup>
            </div>
            <div className="form-group">
                <label htmlFor="targetGender-radio">Gender</label>
                <radiogroup className="btn-group btn-group-justified" data-toggle="buttons">
                    <label className={classnames('btn btn-default', {
                        active: value(gender) === TARGETING.GENDER.ALL
                    })}>
                        <input type="radio" {...gender} value={TARGETING.GENDER.ALL}
                            checked={value(gender) === TARGETING.GENDER.ALL} /> Everyone
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: value(gender) === TARGETING.GENDER.FEMALE
                    })}>
                        <input type="radio" {...gender} value={TARGETING.GENDER.FEMALE}
                            checked={value(gender) === TARGETING.GENDER.FEMALE} /> Female
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: value(gender) === TARGETING.GENDER.MALE
                    })}>
                        <input type="radio" {...gender} value={TARGETING.GENDER.MALE}
                            checked={value(gender) === TARGETING.GENDER.MALE} /> Male
                    </label>
                </radiogroup>
            </div>
            <button type="submit"
                className={classnames('col-sm-6 col-xs-12 btn btn-danger btn-lg', {
                    'btn-waiting': submitting
                })}>
                Next
            </button>
        </form>);
    }
}

EditTargeting.propTypes = {
    fields: PropTypes.shape({
        age: PropTypes.object.isRequired,
        gender: PropTypes.object.isRequired
    }).isRequired,
    submitting: PropTypes.bool.isRequred,

    handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
    form: 'productWizard',
    fields: [
        'gender', 'age',
        'name', 'description' // This is the last form of the wizard. Inject all form fields.
    ],
    destroyOnUnmount: false
})(EditTargeting);
