import { callAPI } from '../../src/actions/api';
import { CALL_API, ApiError } from 'redux-api-middleware';
import defer from 'promise-defer';
import { assign } from 'lodash';

const REQUEST = 'REQUEST';
const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
const REQUEST_FAILURE = 'REQUEST_FAILURE';

describe('callAPI(config)', function() {
    let config;
    let result;

    beforeEach(function() {
        config = {
            endpoint: '/foo/bar',
            types: [REQUEST, REQUEST_SUCCESS, REQUEST_FAILURE]
        };

        result = callAPI(config);
    });

    it('should return an api call with some defaults', function() {
        expect(result).toEqual({
            [CALL_API]: {
                endpoint: config.endpoint,
                types: config.types.map(type => ({
                    type,
                    payload: jasmine.any(Function)
                })),
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        });
    });

    describe('if defaults are overridden', function() {
        beforeEach(function() {
            config.method = 'PUT';
            config.headers = {
                'Accept-Encoding': 'foo'
            };

            result = callAPI(config);
        });

        it('should respect the overrides', function() {
            expect(result).toEqual({
                [CALL_API]: {
                    endpoint: config.endpoint,
                    types: config.types.map(type => ({
                        type,
                        payload: jasmine.any(Function)
                    })),
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Encoding': 'foo'
                    }
                }
            });
        });
    });

    describe('if there is a body', function() {
        beforeEach(function() {
            config.body = { foo: 'bar' };

            result = callAPI(config);
        });

        it('should stringify it', function() {
            expect(result).toEqual({
                [CALL_API]: {
                    endpoint: config.endpoint,
                    types: config.types.map(type => ({
                        type,
                        payload: jasmine.any(Function)
                    })),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(config.body)
                }
            });
        });
    });

    describe('if objects are passed as types', function() {
        beforeEach(function() {
            config.types = config.types.map(type => ({
                type
            }));

            result = callAPI(config);
        });

        it('should not create new Objects', function() {
            expect(result).toEqual({
                [CALL_API]: {
                    endpoint: config.endpoint,
                    types: config.types.map(config => assign({}, config, { payload: jasmine.any(Function) })),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            });
        });
    });

    describe('the function used to create the request payload', function() {
        let createRequestPayload;
        let action, state;
        let payload;

        beforeEach(function() {
            createRequestPayload = result[CALL_API].types[0].payload;

            action = result;
            state = {};

            payload = createRequestPayload(action, state);
        });

        it('should return undefined', function() {
            expect(payload).toBe(undefined);
        });
    });

    describe('the function used to parse the success response', function() {
        let parseSuccessResponse;
        let action, state, res;
        let textDeferred;
        let success, failure;

        beforeEach(function(done) {
            parseSuccessResponse = result[CALL_API].types[1].payload;

            action = result;
            state = {};
            res = {
                text: jasmine.createSpy('res.text()').and.returnValue((textDeferred = defer()).promise)
            };

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            parseSuccessResponse(action, state, res).then(success, failure);
            setTimeout(done);
        });

        it('should call res.test()', function() {
            expect(res.text).toHaveBeenCalledWith();
        });

        describe('if the text is json', function() {
            let json;

            beforeEach(function(done) {
                json = { foo: 'bar' };
                textDeferred.resolve(JSON.stringify(json));

                setTimeout(done);
            });

            it('should fulfill with the json', function() {
                expect(success).toHaveBeenCalledWith(json);
            });
        });

        describe('if the response is text', function() {
            let text;

            beforeEach(function(done) {
                text = 'hello world!';
                textDeferred.resolve(text);

                setTimeout(done);
            });

            it('should fulfill with the text', function() {
                expect(success).toHaveBeenCalledWith(text);
            });
        });
    });

    describe('the function used to parse the failure response', function() {
        let parseFailureResponse;
        let action, state, res;
        let textDeferred;
        let success, failure;

        beforeEach(function(done) {
            parseFailureResponse = result[CALL_API].types[2].payload;

            action = result;
            state = {};
            res = {
                status: 400,
                statusText: 'INVALID REQUEST',
                text: jasmine.createSpy('res.text()').and.returnValue((textDeferred = defer()).promise)
            };

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            parseFailureResponse(action, state, res).then(success, failure);
            setTimeout(done);
        });

        it('should call res.test()', function() {
            expect(res.text).toHaveBeenCalledWith();
        });

        describe('if the text is json', function() {
            let json;

            beforeEach(function(done) {
                json = { foo: 'bar' };
                textDeferred.resolve(JSON.stringify(json));

                setTimeout(done);
            });

            it('should fulfill with an ApiError for the json', function() {
                expect(success).toHaveBeenCalledWith(new ApiError(res.status, res.statusText, json));
            });
        });

        describe('if the response is text', function() {
            let text;

            beforeEach(function(done) {
                text = 'hello world!';
                textDeferred.resolve(text);

                setTimeout(done);
            });

            it('should fulfill with an ApiError for the text', function() {
                expect(success).toHaveBeenCalledWith(new ApiError(res.status, res.statusText, text));
            });
        });
    });
});
