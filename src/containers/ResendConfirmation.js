import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { pageify } from '../utils/page';
import { compose } from 'redux';
import * as userActions from '../actions/user';
import * as dashboardActions from '../actions/dashboard';
import classnames from 'classnames';
import { assign } from 'lodash';

function ResendConfirmation({
    page: { sending, success, error },

    resendConfirmationEmail,
    logoutUser,
}) {
    return (<div className="container main-section">
        <div className="row">
            <div className="col-md-6 col-md-offset-3 col-xs-12 animated fadeIn text-center">
                <h2>Activate Your Account</h2>
                <hr />
                <p>Hello there,
                You need to activate your account before you can continue. If you
                haven't received an activation email, you can request one by clicking
                the link below.
                </p>
                <br />
                <button
                    onClick={resendConfirmationEmail}
                    disabled={sending}
                    className={classnames('btn btn-primary btn-lg', {
                        'btn-wating': sending,
                    })}
                >
                    Resend Activation Email
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
                <div className="clearfix"></div>
                <br />
                <button className="btn btn-link" onClick={() => logoutUser()}>Back to login</button>
            </div>
        </div>
    </div>);
}

ResendConfirmation.propTypes = {
    resendConfirmationEmail: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,

    page: PropTypes.shape({
        sending: PropTypes.bool.isRequired,
        success: PropTypes.bool.isRequired,
        error: PropTypes.instanceOf(Error),
    }).isRequired,
};

export default compose(
    pageify({ path: 'resend_confirmation' }),
    connect(null, assign({}, userActions, dashboardActions))
)(ResendConfirmation);
