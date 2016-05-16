import { createAction } from 'redux-actions';
import { createUuid } from 'rc-uuid';
import { assign, find } from 'lodash';

function prefix(type) {
    return `@@alert/${type}`;
}

export const SHOW_ALERT = prefix('SHOW_ALERT');
export const showAlert = createAction(SHOW_ALERT, ({ title, description, buttons }) => ({
    id: createUuid(),
    title, description,
    buttons: buttons.map(button => assign({}, button, {
        id: createUuid(),
        submitting: false
    }))
}));

export const DISMISS_ALERT = prefix('DISMISS_ALERT');
export const dismissAlert = createAction(DISMISS_ALERT, id => ({ id }));

export const START_SUBMIT = prefix('START_SUBMIT');
export const startSubmit = createAction(START_SUBMIT);

export const STOP_SUBMIT = prefix('STOP_SUBMIT');
export const stopSubmit = createAction(STOP_SUBMIT);

export function submit({ alert: alertId, button: buttonId }) {
    return function thunk(dispatch, getState) {
        const alert = find(getState().alert.alerts, alert => alert.id === alertId);
        const button = find(alert.buttons, button => button.id === buttonId);

        const done = (() => dispatch(stopSubmit({ alert: alertId, button: buttonId })));
        const dismiss = (() => dispatch(dismissAlert(alertId)));

        return dispatch(startSubmit({ alert: alertId, button: buttonId }))
            .then(() => button.onSelect(dismiss))
            .then(done, done);
    };
}
