'use strict';

import React, { PropTypes, Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { pageify } from '../utils/page';
import SignUpForm from '../forms/SignUp';
import { signUp } from '../actions/user';
import { Link } from 'react-router';
import APP_CONFIG from '../../config';
import { assign } from 'lodash';

class SignUp extends Component {
    constructor() {
        super(...arguments);

        this.signUp = this.signUp.bind(this);
    }

    signUp(formValues) {
        const {
            location: {
                query: { promotion }
            }
        } = this.props;

        return this.props.signUp(assign({}, formValues, {
            company: `${formValues.firstName} ${formValues.lastName}`,

            paymentPlanId: APP_CONFIG.paymentPlans[0].id,
            promotion: promotion || APP_CONFIG.defaultPromotion
        }));
    }

    render() {
        return (<div className="bg-dark-wrap">
            <div className="container main-section">
                <div className="row">
                    <div className="rc-logo-white col-md-4 col-md-offset-4 col-xs-12 text-center">
                        <img src="images/rc-logo-white.png" />
                    </div>
                    <div className="pre-login-form col-md-4 col-md-offset-4 col-xs-12
                        animated fadeIn card-item">
                        <h1 className="text-center">Signup</h1>
                        <SignUpForm onSubmit={this.signUp} />
                        <br />
                        <div className="text-center">By signing up, you agree to our
                            <a href="#"> Terms of service</a>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <br />
                    <div className="light-text text-center">Existing User? <Link to="/login">
                        Login</Link>
                    </div>
                </div>
            </div>
        </div>);
    }
}

SignUp.propTypes = {
    signUp: PropTypes.func.isRequired,
    location: PropTypes.shape({
        query: PropTypes.shape({
            promotion: PropTypes.string
        }).isRequired
    }).isRequired
};

export default compose(
    pageify({ path: 'signUp' }),
    connect(null, {
        signUp
    })
)(SignUp);
