import React, { PropTypes } from 'react';
import classnames from 'classnames';

export default function NotificationItem({
    notification: {
        type,
        message,
        id,
    },

    onClose,
}) {
    return (<div
        className={classnames('alert alert-dismissible', `alert-${type}`,
            'alert-fixed')} role="alert"
    >
        <button
            type="button"
            onClick={() => onClose(id)}
            className="close"
            aria-label="Close"
        >
            <span aria-hidden="true">×</span>
        </button>
        {message}
    </div>);
}

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        type: PropTypes.string.isRequired,
        message: PropTypes.node.isRequired,
    }).isRequired,

    onClose: PropTypes.func.isRequired,
};
