import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { changePassword } from '../../actions/account';
import { pageify } from '../../utils/page';
import { compose } from 'redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import classnames from 'classnames';

const PAGE_PATH = 'dashboard.account.password';

function onSubmit({ oldPassword, newPassword }, dispatch) {
    return dispatch(changePassword({ oldPassword, newPassword }))
        .catch(reason => Promise.reject({ _error: reason }))
        .then(() => undefined);
}

function tooltip(
    text,
    id,
    trigger = <i className="fa fa-question-circle" aria-hidden="true" />,
    placement = 'right'
) {
    const tip = <Tooltip id={`tooltip--${id}`}>{text}</Tooltip>;

    return <OverlayTrigger placement={placement} overlay={tip}>{trigger}</OverlayTrigger>;
}

export class Password extends Component {
    render() {
        const {
            fields: { oldPassword, newPassword, newPasswordRepeat },
            handleSubmit, error, submitting, pristine, submitFailed, valid,
            page: { updateSuccess }
        } = this.props;

        return (<div>
            <div className="col-md-9">
                <h3>Change Password</h3>
            </div>
            <div className="col-md-6">
                <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="inputHelpBlock">
                                Current Password 
                                {tooltip('Your current password.', 'current-password')}
                            </label>
                            <input type="password" {...oldPassword} className="form-control" />
                        </div>
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
                        {updateSuccess && (<div className="alert alert-success" role="alert">
                            <strong>Your password has been updated!</strong>
                        </div>)}
                        {error && submitFailed && !submitting && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Uh-oh!</strong> {error.response}
                            </div>
                        )}
                        <button type="submit"
                            disabled={submitting || pristine || !valid}
                            className={classnames('col-md-4 col-xs-12 btn btn-danger btn-lg', {
                                'btn-waiting': submitting
                            })}>
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>);
    }
}

Password.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    error: PropTypes.any,
    submitFailed: PropTypes.bool,
    valid: PropTypes.bool,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,

    page: PropTypes.object.isRequired
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
