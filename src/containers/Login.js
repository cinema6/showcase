import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { loginUser } from '../actions/login';
import { Link } from 'react-router';
import classnames from 'classnames';
import DocumentTitle from 'react-document-title';

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
            <DocumentTitle title="Reelcontent Apps: Login" />
            <div className="container main-section">
                <div className="row">
                    <div className="rc-logo-white col-md-4 col-md-offset-4 col-xs-12 text-center">
                        <img src="images/rc-logo-white.png" />
                    </div>
                    <div className="pre-login-form
                        col-md-4
                        col-md-offset-4
                        col-xs-12
                        animated
                        fadeIn
                        card-item">
                        <h1 className="text-center">Login</h1>
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
                                    <i className="fa fa-exclamation-triangle" aria-hidden="true">
                                    </i>
                                </span>*/}
                                {/*<span id="inputError2Status" className="sr-only">(error)
                                    </span>*/}
                            </div>
                            {error && !submitting && (<div className="alert alert-danger" 
                                role="alert">
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
                        <div className="text-center">
                            <Link to="forgot-password" className="text-center">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <br />
                    <div className="light-text col-md-4 col-md-offset-4 col-xs-12">
                        
                        <div className="text-center">
                            New User? <Link to="/sign-up">Sign up now</Link>
                        </div>
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
