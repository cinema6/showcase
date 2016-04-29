import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { resetPassword } from '../actions/auth';
import { compose } from 'redux';
import { pageify } from '../utils/page';

export class ResetPassword extends Component {
    constructor() {
        super(...arguments);

        this.send = this.send.bind(this);
    }

    send({ newPassword }, dispatch) {
        const {
            location: {
                query: { id, token }
            }
        } = this.props;

        return dispatch(resetPassword({ newPassword, id, token }))
            .catch(reason => Promise.reject({ _error: reason }));
    }

    render() {
        const {
            fields: { newPassword, newPasswordRepeat },
            handleSubmit, submitFailed, valid, error,
            page: { submitSuccess }
        } = this.props;

        return <form onSubmit={handleSubmit(this.send)}>
            <div><label>New Password:</label><input type="password" {...newPassword}/></div>
            <div>
                <label>New Password (Again):</label>
                <input type="password" {...newPasswordRepeat}/>
            </div>
            {newPassword.touched && newPasswordRepeat.touched && newPassword.error && (
                <div>{newPassword.error}</div>
            )}

            {submitFailed && error && (<div>{error.response}</div>)}
            {submitSuccess && (<div>Successfully changed password!</div>)}

            <div><button disabled={!valid} type="submit">Change Password</button></div>
        </form>;
    }
}

ResetPassword.propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.any,
    page: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    submitFailed: PropTypes.bool,
    valid: PropTypes.bool
};

export function validate(values) {
    const { newPassword, newPasswordRepeat } = values;
    const errors = {};

    if (newPassword !== newPasswordRepeat) {
        errors.newPassword = 'Passwords don\'t match!';
    }

    return errors;
}

export default compose(
    reduxForm({
        fields: ['newPassword', 'newPasswordRepeat'],
        form: 'resetPassword',
        validate
    }),
    pageify({ path: 'reset_password' })
)(ResetPassword);
