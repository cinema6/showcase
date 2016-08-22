import billingCycle from '../../src/resources/billing_cycle';
import { LiveResource } from 'rc-live-resource';

describe('billingCycle', () => {
    it('should exist', () => {
        expect(billingCycle).toEqual(jasmine.any(LiveResource));
    });

    it('should poll the current payment', () => {
        expect(billingCycle.config.endpoint).toBe('/api/transactions/showcase/current-payment');
    });

    it('should poll once overy 10 seconds', () => {
        expect(billingCycle.config.pollInterval).toBe(10000);
    });
});
