import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classnames from 'classnames';

function SignUp({
    fields: { firstName, lastName, email, password },
    submitting, error, submitFailed, submitSucceeded, pristine,
    handleSubmit,
}) {
    return (<form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="firstName">First name</label>
            <input
                id="firstName"
                type="text"
                {...firstName}
                className="form-control"
                placeholder="First name"
            />
        </div>
        <div className="form-group">
            <label htmlFor="lastName">Last name</label>
            <input
                id="lastName"
                type="text"
                {...lastName}
                className="form-control"
                placeholder="Last name"
            />
        </div>
        <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
                id="email"
                type="email"
                {...email}
                className="form-control"
                placeholder="Email"
            />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                {...password}
                className="form-control"
                placeholder="Password"
            />
        </div>
        {error && submitFailed && !submitting && (
            <div className="alert alert-danger" role="alert">
                <strong>Login failed!</strong> {error.response || error.message}.
            </div>
        )}
        {submitSucceeded && !submitting && (
            <div className="alert alert-success" role="alert">
                <strong>Thanks for signing up!</strong>&nbsp;
                Please check your email to activate your account. If you don't get the email
                &nbsp;<Link to="/login">log in</Link> to resend it!
            </div>
        )}
        <button
            type="submit"
            disabled={pristine}
            className={classnames('btn btn-primary btn-lg btn-block', {
                'btn-waiting': submitting,
            })}
        >
            Signup
        </button>
    </form>);
}

SignUp.propTypes = {
    fields: PropTypes.shape({
        firstName: PropTypes.object.isRequired,
        lastName: PropTypes.object.isRequired,
        email: PropTypes.object.isRequired,
        password: PropTypes.object.isRequired,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    submitFailed: PropTypes.bool.isRequired,
    submitSucceeded: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    /* eslint-disable no-underscore-dangle */
    return {
        submitSucceeded: state.form.signUp._submitSucceeded,
    };
}

function mapDispatchToProps(dispatch, props) {
    return {
        onSubmit: values => props.onSubmit(values).catch(reason => Promise.reject({
            _error: reason,
        })),
    };
}

export default reduxForm({
    form: 'signUp',
    fields: ['firstName', 'lastName', 'email', 'password'],
}, mapStateToProps, mapDispatchToProps)(SignUp);
