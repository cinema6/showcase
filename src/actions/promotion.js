import { createDbActions } from '../utils/db';

export default createDbActions({
    type: 'promotion',
    endpoint: '/api/promotions'
});
