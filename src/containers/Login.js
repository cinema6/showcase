import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { loginUser } from '../actions/login';
import { Link } from 'react-router';

function onSubmit({ email, password }, dispatch) {
    return dispatch(loginUser({ email, password, redirect: '/dashboard' }))
        .catch(reason => Promise.reject({ _error: reason }));
}

export class Login extends Component {
    render() {
        const { fields: { email, password }, handleSubmit, error } = this.props;

        return <form onSubmit={handleSubmit}>
            <input type="email"
                placeholder="Email" {...email} />
            <input type="password"
                placeholder="Password" {...password} />

            <button type="submit">Submit</button>

            {error && (<div>{error.response}</div>)}

            <div><Link to="forgot-password">Forgot Your Password?</Link></div>
        </form>;
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
