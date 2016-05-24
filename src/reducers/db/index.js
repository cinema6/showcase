'use strict';

import userReducer from './user';
import { createDbReducer } from '../../utils/db';
import { identity } from 'lodash';

export default createDbReducer({
    user: userReducer,
    payment: identity,
    paymentMethod: identity,
    campaign: identity,
    advertiser: identity,
    org: identity
});
