import {
    WILL_MOUNT,
    WILL_UNMOUNT
} from '../../src/actions/page';
import { pageWillMount, pageWillUnmount } from '../../src/actions/page';

describe('pageWillMount({ pagePath })', function() {
    let pagePath;

    beforeEach(function() {
        pagePath = 'dashboard.account.profile';
    });

    it('should return an FSA', function() {
        expect(pageWillMount({ pagePath })).toEqual({
            type: WILL_MOUNT,
            payload: {
                path: 'dashboard.account.profile'
            }
        });
    });
});

describe('pageWillUnmount({ pagePath })', function() {
    let pagePath;

    beforeEach(function() {
        pagePath = 'dashboard.account.profile';
    });

    it('should return an FSA', function() {
        expect(pageWillUnmount({ pagePath })).toEqual({
            type: WILL_UNMOUNT,
            payload: {
                path: 'dashboard.account.profile'
            }
        });
    });
});
