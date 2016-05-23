import { getThunk, createThunk, middleware } from '../../src/middleware/fsa_thunk';

describe('fsa_thunk', function() {
    describe('getThunk(action)', function() {
        beforeEach(function() {
            this.action = {
                type: '@@thunk/EXECUTE',
                payload: {
                    fn: jasmine.createSpy('fn()').and.returnValue(jasmine.createSpy('thunk()')),
                    args: ['foo', 'bar', 'bar']
                }
            };

            this.thunk = getThunk(this.action);
        });

        it('should call the fn() with the args()', function() {
            expect(this.action.payload.fn).toHaveBeenCalledWith(...this.action.payload.args);
        });

        it('should return the thunk', function() {
            expect(this.thunk).toBe(this.action.payload.fn.calls.mostRecent().returnValue);
        });

        describe('if called with a non-thunk FSA', function() {
            beforeEach(function() {
                this.action.type = 'FOO';
            });

            it('should throw', function() {
                expect(() => getThunk(this.action)).toThrow(new Error('Action is not for a thunk.'));
            });
        });
    });

    describe('createThunk(actionCreator)', function() {
        beforeEach(function() {
            this.thunk = jasmine.createSpy('thunk()');
            this.actionCreator = jasmine.createSpy('actionCreator()').and.returnValue(this.thunk);

            this.result = createThunk(this.actionCreator);
        });

        it('should return a Function', function() {
            expect(this.result).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            beforeEach(function() {
                this.args = ['foo', 'bar', 'baz'];
                this.action = this.result(...this.args);
            });

            it('should return an FSA', function() {
                expect(this.action).toEqual({
                    type: '@@thunk/EXECUTE',
                    payload: {
                        fn: this.actionCreator,
                        args: this.args
                    }
                });
            });
        });
    });

    describe('fsa_thunk middleware', function() {
        beforeEach(function() {
            this.dispatch = jasmine.createSpy('dispatch()');
            this.getState = jasmine.createSpy('getState()').and.returnValue({});
            this.next = jasmine.createSpy('next()').and.callFake(value => value);

            this.run = middleware({ dispatch: this.dispatch, getState: this.getState })(this.next);
        });

        describe('if the action is not an FSA', function() {
            beforeEach(function() {
                this.action = { type: 'FOO', foo: 'bar' };
                this.result = this.run(this.action);
            });

            it('should call and return next', function() {
                expect(this.next).toHaveBeenCalledWith(this.action);
                expect(this.result).toBe(this.action);
            });
        });

        describe('if the action is non-thunk FSA', function() {
            beforeEach(function() {
                this.action = { type: 'FOO', payload: { foo: 'bar' } };
                this.result = this.run(this.action);
            });

            it('should call and return next', function() {
                expect(this.next).toHaveBeenCalledWith(this.action);
                expect(this.result).toBe(this.action);
            });
        });

        describe('if the action is a thunk FSA', function() {
            beforeEach(function() {
                this.next.and.returnValue(new Promise(() => {}));
                this.thunk = jasmine.createSpy('thunk()');
                this.action = {
                    type: '@@thunk/EXECUTE',
                    payload: {
                        fn: jasmine.createSpy('actionCreator()').and.returnValue(this.thunk),
                        args: ['foo', 'bar', 'baz']
                    }
                };
                this.result = this.run(this.action);
            });

            it('should execute the Function', function() {
                expect(this.action.payload.fn).toHaveBeenCalledWith(...this.action.payload.args);
            });

            it('should call next() with the return value of the function', function() {
                expect(this.next).toHaveBeenCalledWith(this.thunk);
            });

            it('should return the result of calling next()', function() {
                expect(this.result).toBe(this.next.calls.mostRecent().returnValue);
            });
        });

        describe('if the action is a Function', function() {
            beforeEach(function() {
                this.action = jasmine.createSpy('action()');
                this.result = this.run(this.action);
            });

            it('should call and return next', function() {
                expect(this.next).toHaveBeenCalledWith(this.action);
                expect(this.result).toBe(this.action);
            });
        });
    });
});
