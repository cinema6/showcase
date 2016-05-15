import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { forgotPassword } from '../actions/auth';
import { compose } from 'redux';
import { pageify } from '../utils/page';
import { Link } from 'react-router';
import classnames from 'classnames';

function onSubmit({ email }, dispatch) {
    return dispatch(forgotPassword({ email }))
        .catch(reason => Promise.reject({ _error: reason }));
}

export class ForgotPassword extends Component {
    render() {
        const {
            fields: { email },
            handleSubmit,
            error,
            submitting,
            page: { submitSuccess }
        } = this.props;

        return (<div className="bg-dark-wrap">
            <div className="container main-section">
                <div className="row">
                    <div className="login-form col-md-4 col-md-offset-4 col-xs-12 animated
                        fadeIn card-item">
                        <h1 className="text-center">Reset Password</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="usernameInput">Email Address</label>
                                <input {...email} type="email"
                                    className="form-control"
                                    id="usernameInput"
                                    placeholder="Email" />
                            </div>
                            {submitSuccess && (<div className="alert alert-success" role="alert">
                                <strong>Sucess!</strong> Check your email for further instructions.
                            </div>)}
                            {error && !submitting && (<div className="alert alert-danger"
                                role="alert">
                                <strong>Uh-oh!</strong> {error.response}
                            </div>)}
                            <button type="submit" disabled={submitting}
                                className={classnames('btn', 'btn-primary', 'btn-lg', 'btn-block', {
                                    'btn-waiting': submitting
                                })}>
                                Reset Password
                            </button>
                        </form>
                        <br />
                        <Link className="text-center" to="login">Login</Link>
                        <span className="pull-right">New User? <a href="#/sign-up">Sign up now</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>);
    }
}

ForgotPassword.propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.any,
    page: PropTypes.object.isRequired
};

export default compose(
    reduxForm({
        fields: ['email'],
        form: 'forgotPassword',
        onSubmit
    }),
    pageify({ path: 'forgot_password' })
)(ForgotPassword);
