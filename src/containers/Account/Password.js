import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { changePassword } from '../../actions/account';
import { pageify } from '../../utils/page';
import { compose } from 'redux';

const PAGE_PATH = 'dashboard.account.password';

function onSubmit({ oldPassword, newPassword }, dispatch) {
    return dispatch(changePassword({ oldPassword, newPassword }))
        .catch(reason => Promise.reject({ _error: reason }))
        .then(() => undefined);
}

export class Password extends Component {
    render() {
        const {
            fields: { oldPassword, newPassword, newPasswordRepeat },
            handleSubmit, submitFailed, error,
            page: { updateSuccess }
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <div><label>Current Password:</label><input type="password" {...oldPassword}/></div>
                <div><label>New Password:</label><input type="password" {...newPassword}/></div>
                <div>
                    <label>New Password (Again):</label>
                    <input type="password" {...newPasswordRepeat}/>
                </div>
                {newPassword.touched && newPasswordRepeat.touched && newPassword.error && (
                    <div>{newPassword.error}</div>
                )}

                {submitFailed && error && (<div>{error.response}</div>)}
                {updateSuccess && (<div>Successfully changed password!</div>)}

                <div><button type="submit">Change Password</button></div>
            </form>
        );
    }
}

Password.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    error: PropTypes.any,
    page: PropTypes.object.isRequired,
    submitFailed: PropTypes.bool,
    valid: PropTypes.bool
};

export function mapStateToProps() {
    return {};
}

export function validate(values) {
    const { newPassword, newPasswordRepeat } = values;
    const errors = {};

    if (!Object.keys(values).every(key => values[key])) {
        errors._error = 'All fields are required.';
    }

    if (newPassword !== newPasswordRepeat) {
        errors.newPassword = 'Passwords don\'t match!';
    }

    return errors;
}

export default compose(
    reduxForm({
        form: 'accountPassword',
        fields: ['oldPassword', 'newPassword', 'newPasswordRepeat'],
        onSubmit, validate
    }, mapStateToProps),
    pageify({ path: PAGE_PATH })
)(Password);
