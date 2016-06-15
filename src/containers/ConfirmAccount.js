import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as confirmAccountActions from '../actions/confirm_account';

class ConfirmAccount extends Component {
    componentWillMount() {
        const {
            location: {
                query: { token, id },
            },

            confirmAccount,
        } = this.props;

        return confirmAccount({ token, id });
    }

    render() {
        return (<div className="spinner-wrap">
            <div className="spinner-position">
                <div className="animation-target"></div>
            </div>
        </div>);
    }
}

ConfirmAccount.propTypes = {
    location: PropTypes.shape({
        query: PropTypes.shape({
            token: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,

    confirmAccount: PropTypes.func.isRequired,
};

export default connect(null, confirmAccountActions)(ConfirmAccount);
