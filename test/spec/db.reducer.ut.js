import dbReducer from '../../src/reducers/db';
import usersReducer from '../../src/reducers/db/users';

describe('dbReducer()', function() {
    it('should return inital state', function() {
        expect(dbReducer(undefined, 'INIT')).toEqual({
            users: usersReducer(undefined, 'INIT')
        });
    });
});
