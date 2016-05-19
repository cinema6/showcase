'use strict';

import { TYPE } from '../../src/enums/notification';
import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION
} from '../../src/actions/notification';
import { getThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

function wait(ticks) {
    return Array.apply([], new Array(ticks)).reduce(promise => promise.then(() => {}), Promise.resolve());
}

describe('notification actions', function() {
    let createUuid;
    let actions;
    let addNotification, removeNotification, notify;

    beforeEach(function() {
        createUuid = jasmine.createSpy('createUuid()').and.callFake(require('rc-uuid').createUuid);

        actions = proxyquire('../../src/actions/notification', {
            'rc-uuid': {
                createUuid
            }
        });
        addNotification = actions.addNotification;
        removeNotification = actions.removeNotification;
        notify = actions.notify;
    });

    describe('addNotification({ message, type })', function() {
        let message, type;
        let result;

        beforeEach(function() {
            message = 'It worked!';
            type = TYPE.SUCCESS;

            result = addNotification({ message, type });
        });

        it('should be an RSA', function() {
            expect(result).toEqual({
                type: ADD_NOTIFICATION,
                payload: {
                    id: createUuid.calls.mostRecent().returnValue,
                    type,
                    message
                }
            });
        });
    });

    describe('removeNotification(id)', function() {
        let id;
        let result;

        beforeEach(function() {
            id = createUuid();

            result = removeNotification(id);
        });

        it('should return an FSA', function() {
            expect(result).toEqual({
                type: REMOVE_NOTIFICATION,
                payload: id
            });
        });
    });

    describe('notify({ message, type, time })', function() {
        let message, type, time;
        let thunk;

        beforeEach(function() {
            jasmine.clock().install();
            createUuid.and.returnValue(createUuid());

            message = 'Hello!';
            type = TYPE.DANGER;
            time = 10000;

            thunk = getThunk(notify({ message, type, time }));
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            let dispatch, getState;
            let success, failure;

            beforeEach(function(done) {
                dispatch = jasmine.createSpy('dispatch()').and.callFake(action => Promise.resolve(action.payload));
                getState = jasmine.createSpy('getState()').and.returnValue({});

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                thunk(dispatch, getState).then(success, failure);
                Promise.resolve().then(done);
            });

            it('should dispatch addNotification()', function() {
                expect(dispatch).toHaveBeenCalledWith(addNotification({ message, type }));
            });

            describe('before the time has elapsed', function() {
                beforeEach(function(done) {
                    dispatch.calls.reset();

                    jasmine.clock().tick(time - 1);
                    wait(5).then(done);
                });

                it('should not dispatch anything', function() {
                    expect(dispatch).not.toHaveBeenCalled();
                });
            });

            describe('when the time has elapsed', function() {
                beforeEach(function(done) {
                    dispatch.calls.reset();

                    jasmine.clock().tick(time);
                    wait(5).then(done);
                });

                it('should dispatch', function() {
                    expect(dispatch).toHaveBeenCalledWith(removeNotification(createUuid.calls.mostRecent().returnValue));
                });
            });
        });
    });
});
