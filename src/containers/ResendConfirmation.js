'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pageify } from '../utils/page';
import { compose } from 'redux';
import { resendConfirmationEmail } from '../actions/user';
import classnames from 'classnames';

class ResendConfirmation extends Component {
    render() {
        const {
            page: { sending, success, error },

            resendConfirmationEmail
        } = this.props;

        return (<div className="container main-section">
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2 col-xs-12 animated fadeIn">
                            <p>Hello there,<br>
                            You need to activate your account before you can continue. If you 
                            haven't received an activation email, you can request another activation
                            email.
                            </p>
                            <button onClick={resendConfirmationEmail}
                            disabled={sending}
                            className={classnames('btn btn-primary btn-lg', {
                                'btn-wating': sending
                            })}>
                                Resend Email
                            </button>
                        {error && !sending && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Failed to resend email!</strong> 
                                {error.response || error.message}
                            </div>
                        )}
                        {success && !sending && (
                            <div className="alert alert-success" role="alert">
                                <strong>Success!</strong>&nbsp;
                                Take a look in your email.
                            </div>
                        )}
                        </div>
                    </div>
                </div>);
    }
}

ResendConfirmation.propTypes = {
    resendConfirmationEmail: PropTypes.func.isRequired,

    page: PropTypes.shape({
        sending: PropTypes.bool.isRequired,
        success: PropTypes.bool.isRequired,
        error: PropTypes.instanceOf(Error)
    }).isRequired
};

export default compose(
    pageify({ path: 'resend_confirmation' }),
    connect(null, {
        resendConfirmationEmail
    })
)(ResendConfirmation);
