'use strict';

import { createAction } from 'redux-actions';
import { confirmUser } from './user';
import { replace } from 'react-router-redux';
import { notify } from './notification';
import { TYPE as NOTIFICATION_TYPE } from '../enums/notification';

function prefix(type) {
    return `CONFIRM_ACCOUNT/${type}`;
}

export const CONFIRM_ACCOUNT = prefix('CONFIRM_ACCOUNT');
export function confirmAccount({ id, token }) {
    return function thunk(dispatch) {
        return dispatch(createAction(CONFIRM_ACCOUNT)(
            dispatch(confirmUser({ id, token }))
        )).then(({ value }) => {
            dispatch(replace('/login'));
            dispatch(notify({
                type: NOTIFICATION_TYPE.SUCCESS,
                message: 'Your account has been confirmed! Please log in.',
                time: 10000
            }));

            return value;
        }).catch(({ reason }) =>{
            dispatch(replace('/login'));
            dispatch(notify({
                type: NOTIFICATION_TYPE.DANGER,
                message: 'Failed to confirm your account. ' +
                    'Please log in again to resend a confirmation email.',
                time: 30000
            }));

            return Promise.reject(reason);
        });
    };
}
