import { createDbActions } from '../utils/db';

export default createDbActions({
    type: 'org',
    endpoint: '/api/account/orgs'
});
