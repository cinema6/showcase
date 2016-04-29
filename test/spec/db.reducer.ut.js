import dbReducer from '../../src/reducers/db';
import userReducer from '../../src/reducers/db/user';
import { createDbReducer } from '../../src/utils/db';

describe('dbReducer()', function() {
    it('should return inital state', function() {
        expect(dbReducer(undefined, 'INIT')).toEqual(createDbReducer({
            user: userReducer
        })(undefined, 'INIT'));
    });
});
