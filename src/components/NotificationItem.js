import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class NotificationItem extends Component {
    render() {
        const {
            notification: {
                type,
                message,
                id
            },

            onClose
        } = this.props;

        return (<div className={classnames('alert alert-dismissible', `alert-${type}`)}
            role="alert">
            <button type="button"
                onClick={() => onClose(id)}
                className="close"
                aria-label="Close">
                <span aria-hidden="true">×</span>
            </button>
            {message}
        </div>);
    }
}

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired
    }).isRequired,

    onClose: PropTypes.func.isRequired
};
