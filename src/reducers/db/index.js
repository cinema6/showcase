'use strict';

import userReducer from './user';
import { createDbReducer } from '../../utils/db';

export default createDbReducer({
    user: userReducer
});
