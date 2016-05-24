import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { resetPassword } from '../actions/auth';
import { compose } from 'redux';
import { pageify } from '../utils/page';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import classnames from 'classnames';

function tooltip(
    text,
    id,
    trigger = <i className="fa fa-question-circle" aria-hidden="true" />,
    placement = 'right'
) {
    const tip = <Tooltip id={`tooltip--${id}`}>{text}</Tooltip>;

    return <OverlayTrigger placement={placement} overlay={tip}>{trigger}</OverlayTrigger>;
}

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
            handleSubmit, submitFailed, valid, error, submitting, pristine,
            page: { submitSuccess }
        } = this.props;

        return (<div className="container main-section">
            <div className="row">
                <div className="rc-logo-white col-md-4 col-md-offset-4 col-xs-12 text-center">
                    <img src="images/rc-logo-white.png" />
                </div>
                <div className="pre-login-form col-md-4 col-md-offset-4 col-xs-12
                    animated fadeIn card-item">
                    <h1 className="text-center">Reset Password</h1>
                    <form onSubmit={handleSubmit(this.send)}>
                        <div className="form-group">
                            <label htmlFor="inputHelpBlock">
                                New Password {tooltip('Your new password.', 'new-password')}
                            </label>
                            <input type="password" {...newPassword} className="form-control" />
                        </div>
                        <div className={classnames('form-group', {
                            'has-feedback': newPasswordRepeat.value && newPassword.error,
                            'has-warning': newPasswordRepeat.value && newPassword.error
                        })}>
                            <label htmlFor="inputHelpBlock">
                                Confirm New Password 
                                {tooltip('Your new password (again.)', 'new-password-again')}
                            </label>
                            <input type="password" {...newPasswordRepeat} className="form-control"/>
                            {newPasswordRepeat.value && newPassword.error && tooltip(
                                newPassword.error,
                                'password-mismatch',
                                <span className="glyphicon glyphicon-warning-sign
                                    form-control-feedback"
                                    aria-hidden="true">
                                </span>
                            )}
                        </div>
                        {submitSuccess && (<div className="alert alert-success" role="alert">
                            <strong>Your password has been reset!</strong>
                        </div>)}
                        {error && submitFailed && !submitting && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Uh-oh!</strong> {error.response}
                            </div>
                        )}
                        <button type="submit"
                            disabled={submitting || pristine || !valid}
                            className={classnames('btn btn-primary btn-lg btn-block', {
                                'btn-waiting': submitting
                            })}>
                            Confirm Reset
                        </button>
                    </form>
                    <br />
                </div>
            </div>
        </div>);
    }
}

ResetPassword.propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    submitFailed: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,

    page: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
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
