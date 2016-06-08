import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { forgotPassword } from '../actions/auth';
import { compose } from 'redux';
import { pageify } from '../utils/page';
import { Link } from 'react-router';
import classnames from 'classnames';
import DocumentTitle from 'react-document-title';

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
            <DocumentTitle title="Reelcontent Apps: Forgot Password" />
            <div className="container main-section">
                <div className="row">
                    <div className="rc-logo-white col-md-4 col-md-offset-4 col-xs-12 text-center">
                        <img src="images/rc-logo-white.png" />
                    </div>
                    <div className="pre-login-form col-md-4 col-md-offset-4 col-xs-12 animated
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
                    </div>
                    <div className="clearfix"></div>
                    <br />
                    <div className="light-text col-md-4 col-md-offset-4 col-xs-12">
                        
                        <div className="text-center">
                            Don't need to reset? <Link className="text-center" to="login">Back to 
                            Login</Link>
                        </div>
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
