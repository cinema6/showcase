'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeNotification } from '../actions/notification';
import NotificationItem from '../components/NotificationItem';

class NotificationCenter extends Component {
    render() {
        const {
            notifications,

            removeNotification
        } = this.props;

        return (<div>
            {notifications.map(notification => {
                return <NotificationItem key={notification.id}
                    notification={notification}
                    onClose={id => removeNotification(id)} />;
            })}
        </div>);
    }
}

NotificationCenter.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired
    }).isRequired).isRequired,

    removeNotification: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        notifications: state.notification.items
    };
}

export default connect(mapStateToProps, {
    removeNotification
})(NotificationCenter);
