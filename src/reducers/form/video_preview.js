import { assign } from 'lodash';
import { handleActions } from 'redux-actions';
import { ADD_VIDEO } from '../../actions/video_preview';

export default handleActions({
    [ADD_VIDEO]: (state, { payload: { url } }) => assign({}, state, {
        url,
    }),
});
