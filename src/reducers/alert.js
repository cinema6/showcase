import { handleActions } from 'redux-actions';
import { assign, reject } from 'lodash';
import {
    SHOW_ALERT,
    DISMISS_ALERT,
    START_SUBMIT,
    STOP_SUBMIT
} from '../actions/alert';

const INITIAL_STATE = {
    alerts: []
};

export default handleActions({
    [SHOW_ALERT]: (state, { payload: alert }) => assign({}, state, {
        alerts: state.alerts.concat([alert])
    }),
    [DISMISS_ALERT]: (state, { payload: { id } }) => assign({}, state, {
        alerts: reject(state.alerts, { id })
    }),

    [START_SUBMIT]: (state, { payload: { alert: alertId, button: buttonId } }) => {
        return assign({}, state, {
            alerts: state.alerts.map(alert => alert.id === alertId ? assign({}, alert, {
                buttons: alert.buttons.map(button => button.id === buttonId ? assign({}, button, {
                    submitting: true
                }) : button)
            }) : alert)
        });
    },

    [STOP_SUBMIT]: (state, { payload: { alert: alertId, button: buttonId } }) => assign({}, state, {
        alerts: state.alerts.map(alert => alert.id === alertId ? assign({}, alert, {
            buttons: alert.buttons.map(button => button.id === buttonId ? assign({}, button, {
                submitting: false
            }) : button)
        }) : alert)
    })
}, INITIAL_STATE);
