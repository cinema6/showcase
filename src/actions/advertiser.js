import { createDbActions } from '../utils/db';

export default createDbActions({
    type: 'advertiser',
    endpoint: '/api/account/advrs',
});
