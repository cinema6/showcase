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

        return (<div>
            <button onClick={resendConfirmationEmail}
                disabled={sending}
                className={classnames('btn btn-primary btn-lg', {
                    'btn-wating': sending
                })}>
                Resend Email
            </button>
            {error && !sending && (
                <div className="alert alert-danger" role="alert">
                    <strong>Failed to resend email!</strong> {error.response || error.message}
                </div>
            )}
            {success && !sending && (
                <div className="alert alert-success" role="alert">
                    <strong>Success!</strong>&nbsp;
                    Take a look in your email.
                </div>
            )}
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
