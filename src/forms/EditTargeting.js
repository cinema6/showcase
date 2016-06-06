'use strict';

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import * as TARGETING from '../enums/targeting';
import classnames from 'classnames';
import _, { includes } from 'lodash';
import MultiCheckbox from '../components/MultiCheckbox';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function value(field) {
    return field.value || field.initialValue;
}

class EditTargeting extends Component {
    render() {
        const {
            fields: { age, gender },
            handleSubmit,
            submitting,

            categories
        } = this.props;

        return (<form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="adTitle-input">
                    Categories&nbsp;
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>
                            These are the categories you selected 
                            for your app on the app store
                        </Tooltip>}>
                        <i className="fa fa-question-circle" aria-hidden="true" />
                    </OverlayTrigger>
                </label>
                <div>
                    <h4 className="app-categories">
                        {categories.map(category => {
                            const iconClass = `icon-${_(category.split(/\W/))
                                .filter()
                                .join('-')
                                .toLowerCase()}`;

                            return <span key={category} className="label label-primary">
                                <span className={classnames('custom-icon', iconClass)} /> {category}
                            </span>;
                        })}
                    </h4>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="targetAge-radio">Age</label>
                <div className="select-target-options
                    hidden-sm hidden-xs" data-toggle="buttons">
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.ALL)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.ALL} /> Everyone
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.KIDS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.KIDS}/> Kids
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.TEENS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.TEENS} /> Teens
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.YOUNG_ADULTS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.YOUNG_ADULTS} /> Adults <small>(18-35)</small>
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.ADULTS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.ADULTS} /> Adults <small>(35+)</small>
                    </label>
                </div>
                {/*swapping mobile with vertical class*/}
                <div className="select-target-options-vertical visible-sm visible-xs" 
                    data-toggle="buttons">
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.ALL)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.ALL} /> Everyone
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.KIDS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.KIDS}/> Kids
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.TEENS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.TEENS} /> Teens
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.YOUNG_ADULTS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.YOUNG_ADULTS} /> Adults <small>(18-35)</small>
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.ADULTS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.ADULTS} /> Adults <small>(35+)</small>
                    </label>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="targetGender-radio">Gender</label>
                <radiogroup className="select-target-options 
                    hidden-sm hidden-xs" data-toggle="buttons">
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
                            checked={value(gender) === TARGETING.GENDER.FEMALE} /> Women
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: value(gender) === TARGETING.GENDER.MALE
                    })}>
                        <input type="radio" {...gender} value={TARGETING.GENDER.MALE}
                            checked={value(gender) === TARGETING.GENDER.MALE} /> Men
                    </label>
                </radiogroup>
                {/*swapping mobile with vertical class*/}
                <radiogroup className="select-target-options-vertical visible-sm visible-xs" 
                    data-toggle="buttons">
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
                            checked={value(gender) === TARGETING.GENDER.FEMALE} /> Women
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: value(gender) === TARGETING.GENDER.MALE
                    })}>
                        <input type="radio" {...gender} value={TARGETING.GENDER.MALE}
                            checked={value(gender) === TARGETING.GENDER.MALE} /> Men
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
    submitting: PropTypes.bool.isRequired,

    categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,

    handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
    form: 'productWizard',
    fields: ['gender', 'age'],
    destroyOnUnmount: false
})(EditTargeting);
