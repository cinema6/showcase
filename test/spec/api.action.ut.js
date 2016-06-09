import { callAPI, StatusCodeError } from '../../src/actions/api';
import defer from 'promise-defer';
import fetchMock from 'fetch-mock';
import { getThunk } from '../../src/middleware/fsa_thunk';
import { dispatch } from '../helpers/stubs';

const REQUEST = 'REQUEST';
const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
const REQUEST_FAILURE = 'REQUEST_FAILURE';

describe('api actions', function() {
    afterEach(function() {
        fetchMock.restore();
    });

    describe('callAPI(config)', function() {
        beforeEach(function() {
            this.config = {
                endpoint: '/foo/bar',
                types: [REQUEST, REQUEST_SUCCESS, REQUEST_FAILURE]
            };

            this.thunk = getThunk(callAPI(this.config));
        });

        it('should return a thunk', function() {
            expect(this.thunk).toEqual(jasmine.any(Function));
        });

        describe('when executed', function() {
            beforeEach(function(done) {
                this.dispatch = dispatch();
                this.getState = jasmine.createSpy('getState()').and.returnValue({});

                this.success = jasmine.createSpy('success()');
                this.failure = jasmine.createSpy('failure()');

                this.fetchDeferred = defer();

                fetchMock.mock(this.config.endpoint, this.fetchDeferred.promise);

                this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                setTimeout(done);
            });

            it('should make a GET request', function() {
                expect(fetchMock.calls().unmatched.length).toBe(0, 'Unmatched calls were made.');
                expect(fetchMock.calls().matched.length).toBe(1, 'Incorrect number of calls were made.');
                expect(fetchMock.called(this.config.endpoint)).toBe(true, 'Endpoint was not called.');
                expect(fetchMock.lastOptions(this.config.endpoint)).toEqual({
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'same-origin'
                });
            });

            it('should dispatch an action', function() {
                expect(this.dispatch).toHaveBeenCalledWith({
                    type: REQUEST,
                    meta: {}
                });
            });

            describe('if the request succeeds', function() {
                beforeEach(function(done) {
                    this.response = {
                        status: 200,
                        body: {
                            foo: 'bar',
                            hello: 'world'
                        },
                        headers: {
                            'content-encoding': '',
                            'x-powered-by': 'express',
                            'content-type': 'text/plain;charset=UTF-8'
                        }
                    };

                    this.dispatch.calls.reset();

                    this.fetchDeferred.resolve(this.response);
                    setTimeout(done);
                });

                it('should dispatch an action', function() {
                    expect(this.dispatch).toHaveBeenCalledWith({
                        type: REQUEST_SUCCESS,
                        payload: this.response.body,
                        meta: {
                            status: 200,
                            ok: true,
                            statusText: 'OK',
                            headers: new Headers(this.response.headers)
                        }
                    });
                });

                it('should fulfill the promise', function() {
                    expect(this.success).toHaveBeenCalledWith(this.response.body);
                });

                describe('with a string body', function() {
                    beforeEach(function(done) {
                        fetchMock.reset();

                        this.response.body = 'I know I\'m not JSON...';

                        fetchMock.mock(this.config.endpoint, this.response);

                        this.success.calls.reset();
                        this.failure.calls.reset();

                        this.dispatch.calls.reset();

                        this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                        setTimeout(done);
                    });

                    it('should parse the JSON', function() {
                        expect(this.dispatch).toHaveBeenCalledWith({
                            type: REQUEST_SUCCESS,
                            payload: this.response.body,
                            meta: {
                                status: 200,
                                ok: true,
                                statusText: 'OK',
                                headers: new Headers(this.response.headers)
                            }
                        });
                        expect(this.success).toHaveBeenCalledWith(this.response.body);
                    });
                });
            });

            describe('if the request fails', function() {
                beforeEach(function(done) {
                    this.response = {
                        status: 404,
                        body: 'Could not find that thing...',
                        headers: {
                            'content-encoding': '',
                            'x-powered-by': 'express',
                            'content-type': 'text/plain;charset=UTF-8'
                        }
                    };

                    this.dispatch.calls.reset();

                    this.fetchDeferred.resolve(this.response);
                    setTimeout(done);
                });

                it('should dispatch an action', function() {
                    expect(this.dispatch).toHaveBeenCalledWith({
                        type: REQUEST_FAILURE,
                        error: true,
                        payload: new StatusCodeError(this.response.status, this.response.body),
                        meta: {
                            status: 404,
                            ok: false,
                            statusText: 'Not Found',
                            headers: new Headers(this.response.headers)
                        }
                    });
                });

                it('should reject the Promise', function() {
                    expect(this.failure).toHaveBeenCalledWith(new StatusCodeError(this.response.status, this.response.body));
                });

                describe('with a JSON body', function() {
                    beforeEach(function(done) {
                        fetchMock.reset();

                        this.response.body = {
                            reason: 'It went wrong!'
                        };

                        fetchMock.mock(this.config.endpoint, this.response);

                        this.success.calls.reset();
                        this.failure.calls.reset();

                        this.dispatch.calls.reset();

                        this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                        setTimeout(done);
                    });

                    it('should parse the JSON', function() {
                        expect(this.dispatch).toHaveBeenCalledWith({
                            type: REQUEST_FAILURE,
                            error: true,
                            payload: new StatusCodeError(this.response.status, this.response.body),
                            meta: {
                                status: 404,
                                ok: false,
                                statusText: 'Not Found',
                                headers: new Headers(this.response.headers)
                            }
                        });
                        expect(this.failure).toHaveBeenCalledWith(new StatusCodeError(this.response.status, this.response.body));
                    });
                });
            });

            describe('if sending the request fails', function() {
                beforeEach(function(done) {
                    this.reason = new Error('Something unexpected and bad happened.');

                    this.fetchDeferred.resolve({
                        throws: this.reason
                    });

                    setTimeout(done);
                });

                it('should dispatch an action', function() {
                    expect(this.dispatch).toHaveBeenCalledWith({
                        type: REQUEST_FAILURE,
                        error: true,
                        payload: this.reason,
                        meta: {}
                    });
                });

                it('should reject the Promise', function() {
                    expect(this.failure).toHaveBeenCalledWith(this.reason);
                });
            });

            describe('if there is a body', function() {
                beforeEach(function(done) {
                    this.config.body = {
                        foo: 'bar'
                    };

                    this.thunk = getThunk(callAPI(this.config));

                    fetchMock.reset();
                    this.dispatch.calls.reset();
                    this.success.calls.reset();
                    this.failure.calls.reset();

                    this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should stringify it', function() {
                    expect(fetchMock.calls().unmatched.length).toBe(0, 'Unmatched calls were made.');
                    expect(fetchMock.calls().matched.length).toBe(1, 'Incorrect number of calls were made.');
                    expect(fetchMock.called(this.config.endpoint)).toBe(true, 'Endpoint was not called.');
                    expect(fetchMock.lastOptions(this.config.endpoint)).toEqual({
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify(this.config.body)
                    });
                });
            });

            describe('if defaults are overridden', function() {
                beforeEach(function(done) {
                    this.config.method = 'PUT';
                    this.config.headers = {
                        'Accept-Encoding': 'gzip'
                    };
                    this.config.credentials = '*';

                    this.thunk = getThunk(callAPI(this.config));

                    fetchMock.reset();
                    this.dispatch.calls.reset();
                    this.success.calls.reset();
                    this.failure.calls.reset();

                    this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should respect the overrides', function() {
                    expect(fetchMock.calls().unmatched.length).toBe(0, 'Unmatched calls were made.');
                    expect(fetchMock.calls().matched.length).toBe(1, 'Incorrect number of calls were made.');
                    expect(fetchMock.called(this.config.endpoint)).toBe(true, 'Endpoint was not called.');
                    expect(fetchMock.lastOptions(this.config.endpoint)).toEqual({
                        method: 'PUT',
                        headers: {
                            'Accept-Encoding': 'gzip',
                            'Content-Type': 'application/json'
                        },
                        credentials: '*'
                    });
                });
            });

            describe('if the types are Objects', function() {
                beforeEach(function(done) {
                    this.config.types = [
                        {
                            type: REQUEST,
                            meta: { start: true }
                        },
                        {
                            type: REQUEST_SUCCESS,
                            meta: jasmine.createSpy('meta()').and.returnValue({ success: true })
                        },
                        {
                            type: REQUEST_FAILURE,
                            meta: { failure: true }
                        }
                    ];

                    this.thunk = getThunk(callAPI(this.config));

                    fetchMock.reset();
                    this.dispatch.calls.reset();
                    this.success.calls.reset();
                    this.failure.calls.reset();

                    this.thunk(this.dispatch, this.getState).then(this.success, this.failure);
                    setTimeout(done);
                });

                it('should dispatch an action', function() {
                    expect(this.dispatch).toHaveBeenCalledWith({
                        type: REQUEST,
                        meta: this.config.types[0].meta
                    });
                });

                describe('if the request succeeds', function() {
                    beforeEach(function(done) {
                        this.response = {
                            status: 200,
                            body: {
                                foo: 'bar',
                                hello: 'world'
                            },
                            headers: {
                                'content-encoding': '',
                                'x-powered-by': 'express',
                                'content-type': 'text/plain;charset=UTF-8'
                            }
                        };

                        this.dispatch.calls.reset();

                        this.fetchDeferred.resolve(this.response);
                        setTimeout(done);
                    });

                    it('should dispatch an action', function() {
                        expect(this.config.types[1].meta).toHaveBeenCalledWith(jasmine.any(Response), this.response.body);
                        expect(this.dispatch).toHaveBeenCalledWith({
                            type: REQUEST_SUCCESS,
                            payload: this.response.body,
                            meta: {
                                status: 200,
                                ok: true,
                                statusText: 'OK',
                                headers: new Headers(this.response.headers),
                                success: true
                            }
                        });
                    });
                });

                describe('if the request fails', function() {
                    beforeEach(function(done) {
                        this.response = {
                            status: 404,
                            body: 'Could not find that thing...',
                            headers: {
                                'content-encoding': '',
                                'x-powered-by': 'express',
                                'content-type': 'text/plain;charset=UTF-8'
                            }
                        };

                        this.dispatch.calls.reset();

                        this.fetchDeferred.resolve(this.response);
                        setTimeout(done);
                    });

                    it('should dispatch an action', function() {
                        expect(this.dispatch).toHaveBeenCalledWith({
                            type: REQUEST_FAILURE,
                            error: true,
                            payload: new StatusCodeError(this.response.status, this.response.body),
                            meta: {
                                status: 404,
                                ok: false,
                                statusText: 'Not Found',
                                headers: new Headers(this.response.headers),
                                failure: true
                            }
                        });
                    });
                });
            });
        });
    });
});
