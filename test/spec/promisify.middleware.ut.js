'use strict';

import promisify from '../../src/middleware/promisify';
import { createAction } from 'redux-actions';

describe('promisify middleware', function() {
    let dispatch, getState;
    let next;
    let action;
    let run;
    let success, failure;

    beforeEach(function() {
        dispatch = jasmine.createSpy('dispatch()');
        getState = jasmine.createSpy('getState()').and.returnValue({});
        next = jasmine.createSpy('next()');
        action = createAction('DO_SOMETHING')({ foo: 'bar' });

        run = promisify({ dispatch, getState })(next);

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');
    });

    describe('if next() returns a value', function() {
        let value;

        beforeEach(function(done) {
            value = 42;
            next.and.returnValue(value);

            run(action).then(success, failure);
            setTimeout(done);
        });

        it('should call next()', function() {
            expect(next).toHaveBeenCalledWith(action);
        });

        it('should fulfill with the value', function() {
            expect(success).toHaveBeenCalledWith(value);
        });
    });

    describe('if next() returns an Error', function() {
        let error;

        beforeEach(function(done) {
            error = new Error('I failed!');
            next.and.returnValue(error);

            run(action).then(success, failure);
            setTimeout(done);
        });

        it('should call next()', function() {
            expect(next).toHaveBeenCalledWith(action);
        });

        it('should reject with the error', function() {
            expect(failure).toHaveBeenCalledWith(error);
        });
    });

    describe('if next() returns an FSA', function() {
        let fsa;

        describe('for a non-error', function() {
            beforeEach(function(done) {
                fsa = createAction(action.type)({ hello: 'world' });
                next.and.returnValue(fsa);

                run(action).then(success, failure);
                setTimeout(done);
            });

            it('should call next()', function() {
                expect(next).toHaveBeenCalledWith(action);
            });

            it('should fulfill with the RSA payload', function() {
                expect(success).toHaveBeenCalledWith(fsa.payload);
            });
        });

        describe('for an Error', function() {
            beforeEach(function(done) {
                fsa = createAction(action.type)(new Error('This didn\'t work out.'));
                next.and.returnValue(fsa);

                run(action).then(success, failure);
                setTimeout(done);
            });

            it('should call next()', function() {
                expect(next).toHaveBeenCalledWith(action);
            });

            it('should reject with the RSA payload', function() {
                expect(failure).toHaveBeenCalledWith(fsa.payload);
            });
        });
    });

    describe('if next() returns a Promise', function() {
        describe('that is rejected', function() {
            describe('with an Error', function() {
                let error;

                beforeEach(function(done) {
                    error = new Error('I failed!');
                    next.and.returnValue(Promise.reject(error));

                    run(action).then(success, failure);
                    setTimeout(done);
                });

                it('should call next()', function() {
                    expect(next).toHaveBeenCalledWith(action);
                });

                it('should reject with the error', function() {
                    expect(failure).toHaveBeenCalledWith(error);
                });
            });

            describe('with a value', function() {
                let value;

                beforeEach(function(done) {
                    value = 30;
                    next.and.returnValue(Promise.reject(value));

                    run(action).then(success, failure);
                    setTimeout(done);
                });

                it('should call next()', function() {
                    expect(next).toHaveBeenCalledWith(action);
                });

                it('should reject with the value', function() {
                    expect(failure).toHaveBeenCalledWith(value);
                });
            });

            describe('with a FSA', function() {
                let fsa;

                describe('for a non-error', function() {
                    beforeEach(function(done) {
                        fsa = createAction(action.type)({ hello: 'world' });
                        next.and.returnValue(Promise.reject(fsa));

                        run(action).then(success, failure);
                        setTimeout(done);
                    });

                    it('should call next()', function() {
                        expect(next).toHaveBeenCalledWith(action);
                    });

                    it('should fulfill with the RSA payload', function() {
                        expect(success).toHaveBeenCalledWith(fsa.payload);
                    });
                });

                describe('for an Error', function() {
                    beforeEach(function(done) {
                        fsa = createAction(action.type)(new Error('This didn\'t work out.'));
                        next.and.returnValue(Promise.reject(fsa));

                        run(action).then(success, failure);
                        setTimeout(done);
                    });

                    it('should call next()', function() {
                        expect(next).toHaveBeenCalledWith(action);
                    });

                    it('should reject with the RSA payload', function() {
                        expect(failure).toHaveBeenCalledWith(fsa.payload);
                    });
                });
            });
        });
    });
});
