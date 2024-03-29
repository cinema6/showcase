import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as notificationActions from '../actions/notification';
import NotificationItem from '../components/NotificationItem';

function NotificationCenter({
    notifications,

    removeNotification,
}) {
    return (<div>
        {notifications.map(notification => <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={id => removeNotification(id)}
        />)}
    </div>);
}

NotificationCenter.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        message: PropTypes.node.isRequired,
    }).isRequired).isRequired,

    removeNotification: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        notifications: state.notification.items,
    };
}

export default connect(mapStateToProps, notificationActions)(NotificationCenter);
