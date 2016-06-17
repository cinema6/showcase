import moment from 'moment';
import { estimateImpressions } from '../../src/utils/billing';

describe('billing utils', function() {
    describe('estimateImpressions({ start, end, viewsPerDay })', function() {
        beforeEach(function() {
            this.start = moment().add(3, 'days');
            this.end = moment(this.start).add(14, 'days').subtract(2, 'hours');
            this.viewsPerDay = 70;

            this.result = estimateImpressions({
                start: this.start,
                end: this.end,
                viewsPerDay: this.viewsPerDay
            });
        });

        it('should calculate the number of impressions, rounded to the nearest 50', function() {
            expect(this.result).toBe(1000);
        });
    });
});
