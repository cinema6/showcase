'use strict';

import React, { PropTypes, Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { pageify } from '../utils/page';
import SignUpForm from '../forms/SignUp';
import { signUp } from '../actions/user';
import { Link } from 'react-router';

class SignUp extends Component {
    render() {
        const {
            signUp
        } = this.props;

        return (<div className="container main-section">
            <div className="row">
                <div className="login-form col-md-4 col-md-offset-4 col-xs-12
                    animated fadeIn card-item">
                    <h1 className="text-center">Signup</h1>
                    <SignUpForm onSubmit={signUp} />
                    <br />
                    <div className="text-center">Existing User? <Link to="/login">Login</Link></div>
                </div>
            </div>
        </div>);
    }
}

SignUp.propTypes = {
    signUp: PropTypes.func.isRequired
};

export default compose(
    pageify({ path: 'signUp' }),
    connect(null, {
        signUp
    })
)(SignUp);
