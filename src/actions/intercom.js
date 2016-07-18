import { createThunk } from '../middleware/fsa_thunk';
import loader from '../utils/loader';
import { intercomId } from '../../config';

export const trackLogin = createThunk(user => (
    function doTrackLogin() {
        return loader.load('intercom').then(intercom => intercom('boot', {
            app_id: intercomId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            created_at: user.created,
            rc_app: 'showcase apps',
        }));
    }
));

export const trackLogout = createThunk(() => (
    function doTrackLogout() {
        return loader.load('intercom').then(intercom => intercom('shutdown'));
    }
));
