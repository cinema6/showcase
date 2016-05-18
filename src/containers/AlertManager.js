import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Alert from '../components/Alert';
import { last } from 'lodash';
import {
    dismissAlert,
    submit
} from '../actions/alert';

class AlertManager extends Component {
    render() {
        const {
            alerts,

            dismissAlert,
            submit
        } = this.props;
        const alert = last(alerts);

        if (!alert) { return null; }

        const {
            id
        } = alert;

        return <Alert alert={alert}
            onDismiss={() => dismissAlert(id)}
            onSelect={submit} />;
    }
}

AlertManager.propTypes = {
    alerts: PropTypes.array.isRequired,

    dismissAlert: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        alerts: state.alert.alerts
    };
}

export default connect(mapStateToProps, {
    dismissAlert,
    submit
})(AlertManager);
