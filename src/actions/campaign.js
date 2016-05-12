'use strict';

import { createDbActions } from '../utils/db';

export default createDbActions({
    type: 'campaign',
    endpoint: '/api/campaigns',
    queries: {
        list: { application: 'showcase' }
    }
});
