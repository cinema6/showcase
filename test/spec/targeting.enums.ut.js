'use strict';

import { AGE, GENDER } from '../../src/enums/targeting';

describe('targeting enums', function() {
    describe('AGE', function() {
        it('should exist', function() {
            expect(AGE).toEqual({
                ALL: 'ALL',
                ZERO_TO_TWELVE: '0-12',
                THIRTEEN_PLUS: '13+',
                EIGHTEEN_PLUS: '18+'
            });
        });
    });

    describe('GENDER', function() {
        it('should exist', function() {
            expect(GENDER).toEqual({
                ALL: 'ALL',
                FEMALE: 'Female',
                MALE: 'Male'
            });
        });
    });
});
