'use strict';

import { TYPE } from '../../src/enums/notification';

describe('targeting enums', function() {
    describe('TYPE', function() {
        it('should exist', function() {
            expect(TYPE).toEqual({
                SUCCESS: 'success',
                INFO: 'info',
                WARNING: 'warning',
                DANGER: 'danger'
            });
        });
    });
});
