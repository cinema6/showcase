import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { loginUser } from '../actions/login';
import { Link } from 'react-router';
import classnames from 'classnames';

function onSubmit({ email, password }, dispatch) {
    return dispatch(loginUser({ email, password, redirect: '/dashboard' }))
        .catch(reason => Promise.reject({ _error: reason }));
}

export class Login extends Component {
    render() {
        const {
            fields: { email, password },
            handleSubmit,
            error,
            submitting
        } = this.props;

        return (<div className="bg-dark-wrap">
            <div className="container main-section">
                <div className="row">
                    <div className="login-form
                        col-md-4
                        col-md-offset-4
                        col-xs-12
                        animated
                        fadeIn
                        card-item">
                        <h1 className="text-center">Please Login</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="usernameInput">Email address</label>
                                <input {...email}
                                    type="email"
                                    className="form-control"
                                    id="usernameInput"
                                    placeholder="Email" />
                                {/*<span className="form-control-feedback" aria-hidden="true">
                                    <i className="fa fa-check" aria-hidden="true"></i>
                                </span>*/}
                                {/*<span id="inputSuccess2Status" className="sr-only">
                                    (success)
                                </span>*/}
                            </div>
                            <div className="form-group">
                                <label htmlFor="passwordInput">Password</label>
                                <input {...password}
                                    type="password"
                                    className="form-control"
                                    id="passwordInput"
                                    placeholder="Password" />
                                {/*<span className="form-control-feedback" aria-hidden="true">
                                    <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                </span>*/}
                                {/*<span id="inputError2Status" className="sr-only">(error)</span>*/}
                            </div>
                            {error && !submitting && (<div className="alert alert-danger" role="alert">
                                <strong>Login failed!</strong> {error.response}.
                            </div>)}
                            <button type="submit"
                                disabled={submitting}
                                className={classnames(
                                    'btn', 'btn-primary', 'btn-lg', 'btn-block',
                                    { 'btn-waiting': submitting }
                                )}>
                                Login
                            </button>

                        </form>
                        <br />
                        <Link to="forgot-password" className="text-center">Forgot Password?</Link>
                        <span className="pull-right">
                            New User? <Link to="/sign-up">Sign up now</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>);
    }
}

Login.propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.any
};

export default reduxForm({
    fields: ['email', 'password'],
    form: 'loginPage',
    onSubmit
})(Login);
