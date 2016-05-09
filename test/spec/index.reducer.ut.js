'use strict';

import rootReducer from '../../src/reducers';
import { routerReducer } from 'react-router-redux';
import dbReducer from '../../src/reducers/db';
import sessionReducer from '../../src/reducers/session';
import pageReducer from '../../src/reducers/page';
import formReducer from '../../src/reducers/form';
import notificationReducer from '../../src/reducers/notification';

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
                routing: routerReducer(undefined, 'INIT'),
                form: formReducer(undefined, 'INIT'),
                db: dbReducer(undefined, 'INIT'),
                session: sessionReducer(undefined, 'INIT'),
                page: pageReducer(undefined, 'INIT'),
                notification: notificationReducer(undefined, 'INIT')
            });
        });
    });
});
