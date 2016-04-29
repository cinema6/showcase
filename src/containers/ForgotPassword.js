import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { forgotPassword } from '../actions/auth';
import { compose } from 'redux';
import { pageify } from '../utils/page';
import { Link } from 'react-router';

function onSubmit({ email }, dispatch) {
    return dispatch(forgotPassword({ email }))
        .catch(reason => Promise.reject({ _error: reason }));
}

export class ForgotPassword extends Component {
    render() {
        const {
            fields: { email },
            handleSubmit, error, page
        } = this.props;

        return <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" {...email} />

            <button type="submit">Submit</button>

            {page.submitSuccess && (<div>Check your email for further instructions!</div>)}
            {error && (<div>{error.response}</div>)}

            <div><Link to="/login">Back to Login</Link></div>
        </form>;
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
