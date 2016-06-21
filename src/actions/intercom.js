import { createThunk } from '../middleware/fsa_thunk';
import intercom from '../utils/intercom';

export const trackLogin = createThunk(user => (
    function doTrackLogin() {
        return intercom.track('boot', {
            app_id: intercom.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            created_at: user.created,
            rc_app: 'showcase apps',
        });
    }
));

export const trackLogout = createThunk(() => (
    function doTrackLogout() {
        return intercom.track('shutdown');
    }
));
