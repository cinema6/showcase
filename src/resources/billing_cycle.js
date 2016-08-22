import { LiveResource } from 'rc-live-resource';

export default new LiveResource({
    endpoint: '/api/transactions/showcase/current-payment',
    pollInterval: 10000,
});
