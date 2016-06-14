import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Alert from '../components/Alert';
import { last } from 'lodash';
import * as alertActions from '../actions/alert';

function AlertManager({
    alerts,

    dismissAlert,
    submit,
}) {
    const alert = last(alerts);

    if (!alert) { return null; }

    const {
        id,
    } = alert;

    return (<Alert
        alert={alert}
        onDismiss={() => dismissAlert(id)}
        onSelect={submit}
    />);
}

AlertManager.propTypes = {
    alerts: PropTypes.array.isRequired,

    dismissAlert: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        alerts: state.alert.alerts,
    };
}

export default connect(mapStateToProps, alertActions)(AlertManager);
