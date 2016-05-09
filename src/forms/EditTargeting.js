'use strict';

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import * as TARGETING from '../enums/targeting';
import classnames from 'classnames';

class EditTargeting extends Component {
    render() {
        const {
            fields: { age, gender },
            handleSubmit
        } = this.props;

        return (<form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="targetAge-radio">Age</label>
                <radiogroup className="btn-group btn-group-justified" data-toggle="buttons">
                    <label className={classnames('btn btn-default', {
                        active: age.value === TARGETING.AGE.ALL
                    })}>
                        <input type="radio" {...age} value={TARGETING.AGE.ALL}
                            checked={age.value === TARGETING.AGE.ALL} /> Everyone
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: age.value === TARGETING.AGE.ZERO_TO_TWELVE
                    })}>
                        <input type="radio" {...age} value={TARGETING.AGE.ZERO_TO_TWELVE}
                            checked={age.value === TARGETING.AGE.ZERO_TO_TWELVE} /> Under 12
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: age.value === TARGETING.AGE.THIRTEEN_PLUS
                    })}>
                        <input type="radio" {...age} value={TARGETING.AGE.THIRTEEN_PLUS}
                            checked={age.value === TARGETING.AGE.THIRTEEN_PLUS} /> 13+
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: age.value === TARGETING.AGE.EIGHTEEN_PLUS
                    })}>
                        <input type="radio" {...age} value={TARGETING.AGE.EIGHTEEN_PLUS}
                            checked={age.value === TARGETING.AGE.EIGHTEEN_PLUS} /> 18+
                    </label>
                </radiogroup>
            </div>
            <div className="form-group">
                <label htmlFor="targetGender-radio">Gender</label>
                <radiogroup className="btn-group btn-group-justified" data-toggle="buttons">
                    <label className={classnames('btn btn-default', {
                        active: gender.value === TARGETING.GENDER.ALL
                    })}>
                        <input type="radio" {...gender} value={TARGETING.GENDER.ALL}
                            checked={gender.value === TARGETING.GENDER.ALL} /> Everyone
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: gender.value === TARGETING.GENDER.FEMALE
                    })}>
                        <input type="radio" {...gender} value={TARGETING.GENDER.FEMALE}
                            checked={gender.value === TARGETING.GENDER.FEMALE} /> Female
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: gender.value === TARGETING.GENDER.MALE
                    })}>
                        <input type="radio" {...gender} value={TARGETING.GENDER.MALE}
                            checked={gender.value === TARGETING.GENDER.MALE} /> Male
                    </label>
                </radiogroup>
            </div>
            <button type="button"
                className="col-sm-6 col-xs-12 btn btn-danger btn-lg">
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
    handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
    form: 'productWizard',
    fields: ['gender', 'age'],
    destroyOnUnmount: false
})(EditTargeting);
