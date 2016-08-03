'use strict';

import rootReducer from '../../src/reducers';
import { routerReducer } from 'react-router-redux';
import dbReducer from '../../src/reducers/db';
import sessionReducer from '../../src/reducers/session';
import pageReducer from '../../src/reducers/page';
import analyticsReducer from '../../src/reducers/analytics';
import formReducer from '../../src/reducers/form';
import notificationReducer from '../../src/reducers/notification';
import alertReducer from '../../src/reducers/alert';
import systemReducer from '../../src/reducers/system';

describe('rootReducer', function() {
    it('should exist', function() {
        expect(rootReducer).toEqual(jasmine.any(Function));
    });

    describe('when initialized', function() {
        let state;

        beforeEach(function() {
            state = rootReducer(undefined, 'INIT');
        });

        it('should create the default state of the app', function() {
            expect(state).toEqual({
                analytics: analyticsReducer(undefined, 'INIT'),
                routing: routerReducer(undefined, 'INIT'),
                form: formReducer(undefined, 'INIT'),
                db: dbReducer(undefined, 'INIT'),
                session: sessionReducer(undefined, 'INIT'),
                page: pageReducer(undefined, 'INIT'),
                notification: notificationReducer(undefined, 'INIT'),
                alert: alertReducer(undefined, 'INIT'),
                system: systemReducer(undefined, 'INIT')
            });
        });
    });
});
