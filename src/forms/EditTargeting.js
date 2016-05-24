'use strict';

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import * as TARGETING from '../enums/targeting';
import classnames from 'classnames';
import { includes } from 'lodash';
import MultiCheckbox from '../components/MultiCheckbox';

function value(field) {
    return field.value || field.initialValue;
}

class EditTargeting extends Component {
    render() {
        const {
            fields: { age, gender },
            handleSubmit,
            submitting
        } = this.props;

        return (<form onSubmit={handleSubmit}>
            {/*
            <div class="form-group">
                <label for="adTitle-input">
                    Categories
                    <span data-toggle="tooltip" data-placement="bottom" title="These are the 
                        categories you selected for your app on the app store.">
                        <i class="fa fa-question-circle" aria-hidden="true"></i>
                    </span>
                </label>
                <div>
                    <h4 class="app-categories">
                        <span class="label label-primary">
                            <span class="custom-icon icon-books"></span> Books
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-food-drinks"></span> Food and Drink
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-medical"></span> Medical
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-reference"></span> Reference
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-business"></span> Business
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-games"></span> Games
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-music"></span> Music
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-shopping"></span> Shopping
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-catalogs"></span> Catalogs
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-health-fitness"></span> 
                            Health &amp; Fitness
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-navigation"></span> Navigation
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-social-networking"></span> 
                            Social Networking
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-education"></span> Education
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-lifestyle"></span> Lifestyle
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-news"></span> News
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-sports"></span> Sports
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-entertainment"></span> Entertainment
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-kids"></span> Kids
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-photo-video"></span> Photo &amp; Video
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-travel"></span> Travel
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-finance"></span> Finance
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-magazines-newspapers"></span> 
                            Magazines &amp; Newspapers
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-productivity"></span> Productivity
                        </span>
                        <span class="label label-primary">
                            <span class="custom-icon icon-utilities"></span> Utilities
                        </span>
                    </h4>
                </div>
                <!--<span id="helpBlock" class="help-block">A block of help text that breaks 
                onto a new line and may extend beyond one line.</span>-->
            </div>
            */}
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
                            option={TARGETING.AGE.YOUNG_ADULTS} /> Young Adults
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.ADULTS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.ADULTS} /> Adults
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
                            option={TARGETING.AGE.YOUNG_ADULTS} /> Young Adults
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: includes(value(age), TARGETING.AGE.ADULTS)
                    })}>
                        <MultiCheckbox value={value(age)}
                            onChange={age.onChange}
                            option={TARGETING.AGE.ADULTS} /> Adults
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
