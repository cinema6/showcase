'use strict';

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import * as TARGETING from '../enums/targeting';

class EditTargeting extends Component {
    render() {
        const {
            fields: { age, gender },
            handleSubmit
        } = this.props;

        return (<form onSubmit={handleSubmit}>
            <label>Age:</label>
            <radiogroup>
                <input type="radio" {...age} value={TARGETING.AGE.ALL}
                    checked={age.value === TARGETING.AGE.ALL} /> All
                <input type="radio" {...age} value={TARGETING.AGE.ZERO_TO_TWELVE}
                    checked={age.value === TARGETING.AGE.ZERO_TO_TWELVE} /> Under 12
                <input type="radio" {...age} value={TARGETING.AGE.THIRTEEN_PLUS}
                    checked={age.value === TARGETING.AGE.THIRTEEN_PLUS} /> 13+
                <input type="radio" {...age} value={TARGETING.AGE.EIGHTEEN_PLUS}
                    checked={age.value === TARGETING.AGE.EIGHTEEN_PLUS} /> 18+
            </radiogroup>
            <label>Gender</label>
            <radiogroup>
                <input type="radio" {...gender} value={TARGETING.GENDER.ALL}
                    checked={gender.value === TARGETING.GENDER.ALL} /> All
                <input type="radio" {...gender} value={TARGETING.GENDER.FEMALE}
                    checked={gender.value === TARGETING.GENDER.FEMALE} /> Female
                <input type="radio" {...gender} value={TARGETING.GENDER.MALE}
                    checked={gender.value === TARGETING.GENDER.MALE} /> Male
            </radiogroup>

            <button type="submit">Next</button>
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
