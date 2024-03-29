import {
    loginUser as authLoginUser,
} from './auth';
import {
    getCampaigns,
    getPaymentPlan,
} from './session';
import {
    trackLogin as intercomTrackLogin,
} from './intercom';
import { replace } from 'react-router-redux';
import { createAction } from 'redux-actions';
import { noop } from 'lodash';
import { createThunk } from '../middleware/fsa_thunk';

function loginType(type) {
    return `LOGIN/${type}`;
}

export const LOGIN_START = loginType('LOGIN_START');
export const LOGIN_SUCCESS = loginType('LOGIN_SUCCESS');
export const LOGIN_FAILURE = loginType('LOGIN_FAILURE');
export const loginUser = createThunk(({ email, password, redirect }) => (
    function doLoginUser(dispatch) {
        dispatch(createAction(LOGIN_START)());

        return dispatch(authLoginUser({ email, password }))
            .then(data => (
                Promise.all([
                    dispatch(getCampaigns()),
                    dispatch(getPaymentPlan()),
                ])
                .catch(noop) // proceed with login even if fetching deps fails
                .then(() => Promise.all([
                    dispatch(createAction(LOGIN_SUCCESS)(data)),
                    dispatch(replace(redirect)),
                    dispatch(intercomTrackLogin(data)),
                ]))
            ))
            .catch(reason => dispatch(createAction(LOGIN_FAILURE)(reason)));
    }
));
