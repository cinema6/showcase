'use strict';

import { AGE, GENDER } from '../../src/enums/targeting';

describe('targeting enums', function() {
    describe('AGE', function() {
        it('should exist', function() {
            expect(AGE).toEqual({
                ALL: 'ALL',
                KIDS: '0-12',
                TEENS: '13-18',
                YOUNG_ADULTS: '19-35',
                ADULTS: '36+'
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
