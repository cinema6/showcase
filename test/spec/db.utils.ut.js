import { createDbActions, createDbReducer } from '../../src/utils/db';
import {
    LIST,
    GET,
    CREATE,
    UPDATE,
    REMOVE
} from '../../src/utils/db';
import { callAPI } from '../../src/actions/api';
import { createUuid } from 'rc-uuid';
import { assign, clone, keyBy, omit } from 'lodash';
import { createAction } from 'redux-actions';
import { CALL_API } from 'redux-api-middleware';
import defer from 'promise-defer';
import { format as formatURL } from 'url';

describe('utils/db', function() {
    describe('createDbActions({ type, endpoint, queries })', function() {
        let type, endpoint;
        let actions;

        beforeEach(function() {
            type = 'campaign';
            endpoint = '/api/campaigns';

            actions = createDbActions({ type, endpoint });
        });

        it('should return an Object of Functions', function() {
            expect(actions).toEqual({
                list: jasmine.any(Function),
                get: jasmine.any(Function),
                create: jasmine.any(Function),
                update: jasmine.any(Function),
                remove: jasmine.any(Function)
            });
        });

        describe('if queries are provided', function() {
            let queries, id;

            function getCall(action) {
                if (typeof action === 'function') {
                    let result;
                    let dispatch = data => {
                        result = data;
                        return new Promise(() => {});
                    };
                    let getState = () => ({
                        db: {
                            [type]: {
                                [id]: {}
                            }
                        }
                    });

                    action(dispatch, getState);
                    return result[CALL_API];
                }

                return action[CALL_API];
            }

            beforeEach(function() {
                queries = {
                    list: {
                        a: 'list-param'
                    },
                    get: {
                        b: 'get-param'
                    },
                    create: {
                        c: 'create-param'
                    },
                    update: {
                        d: 'update-param'
                    },
                    remove: {
                        e: 'remove-param'
                    }
                };

                id = `cam-${createUuid()}`;

                actions = createDbActions({ type, endpoint, queries });
            });

            it('should add the queries to each of the actions', function() {
                expect(getCall(actions.list()).endpoint).toEqual(formatURL({
                    pathname: endpoint,
                    query: queries.list
                }));
                expect(getCall(actions.get({ id })).endpoint).toEqual(formatURL({
                    pathname: `${endpoint}/${id}`,
                    query: queries.get
                }));
                expect(getCall(actions.create({ data: {} })).endpoint).toEqual(formatURL({
                    pathname: endpoint,
                    query: queries.create
                }));
                expect(getCall(actions.update({ data: { id } })).endpoint).toEqual(formatURL({
                    pathname: `${endpoint}/${id}`,
                    query: queries.update
                }));
                expect(getCall(actions.remove({ id })).endpoint).toEqual(formatURL({
                    pathname: `${endpoint}/${id}`,
                    query: queries.remove
                }));
            });
        });

        describe('list()', function() {
            let thunk;

            beforeEach(function() {
                thunk = actions.list();
            });

            it('should return a thunk', function() {
                expect(thunk).toEqual(jasmine.any(Function));
            });

            it('should include action names', function() {
                expect(actions.list.START).toBe(`@@db:${type}/LIST/START`);
                expect(actions.list.SUCCESS).toBe(`@@db:${type}/LIST/SUCCESS`);
                expect(actions.list.FAILURE).toBe(`@@db:${type}/LIST/FAILURE`);
            });

            describe('when called', function() {
                let items, dispatchDeferred;
                let dispatch, getState;
                let success, failure;

                beforeEach(function(done) {
                    items = Array.apply([], new Array(10)).map(() => ({
                        id: createUuid(),
                        foo: 'bar',
                        hello: 'world'
                    }));
                    dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                    getState = jasmine.createSpy('getState()').and.returnValue({});

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should dispatch a START action for the type', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(actions.list.START)());
                });

                it('should call the api', function() {
                    expect(dispatch).toHaveBeenCalledWith(callAPI({
                        types: [
                            {
                                type: LIST.START,
                                meta: { type, key: 'id', id: null }
                            },
                            {
                                type: LIST.SUCCESS,
                                meta: { type, key: 'id', id: null }
                            },
                            {
                                type: LIST.FAILURE,
                                meta: { type, key: 'id', id: null }
                            }
                        ],
                        endpoint: endpoint,
                        method: 'GET'
                    }));
                });

                describe('if the action succeeds', function() {
                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        dispatchDeferred.resolve(items);
                        setTimeout(done);
                    });

                    it('should dispatch a SUCCESS action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.list.SUCCESS)(items.map(item => item.id)));
                    });

                    it('should fulfill with an Array of ids', function() {
                        expect(success).toHaveBeenCalledWith(items.map(item => item.id));
                    });
                });

                describe('if the action fails', function() {
                    let reason;

                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        reason = new Error('It went wrong.');
                        dispatchDeferred.reject(reason);
                        setTimeout(done);
                    });

                    it('should dispatch a FAILURE action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.list.FAILURE)(reason));
                    });

                    it('should reject with the reason', function() {
                        expect(failure).toHaveBeenCalledWith(reason);
                    });
                });

                describe('if another key is specified', function() {
                    let key;

                    beforeEach(function(done) {
                        key = 'token';
                        dispatch.calls.reset();

                        createDbActions({ type, endpoint, key }).list()(dispatch, getState).then(success, failure);
                        setTimeout(done);
                    });

                    it('should call the api with that key in the meta', function() {
                        expect(dispatch.calls.mostRecent().args[0][CALL_API].types).toEqual([0, 1, 2].map(() => jasmine.objectContaining({ meta: { type, key, id: null } })));
                    });
                });
            });
        });

        describe('get({ id })', function() {
            let id;
            let thunk;

            beforeEach(function() {
                id = 'cam-' + createUuid();
                thunk = actions.get({ id });
            });

            it('should return a thunk', function() {
                expect(thunk).toEqual(jasmine.any(Function));
            });

            it('should include action names', function() {
                expect(actions.get.START).toBe(`@@db:${type}/GET/START`);
                expect(actions.get.SUCCESS).toBe(`@@db:${type}/GET/SUCCESS`);
                expect(actions.get.FAILURE).toBe(`@@db:${type}/GET/FAILURE`);
            });

            describe('when called', function() {
                let item, dispatchDeferred;
                let dispatch, getState;
                let success, failure;

                beforeEach(function(done) {
                    item = {
                        id: createUuid(),
                        foo: 'bar',
                        hello: 'world'
                    };
                    dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                    getState = jasmine.createSpy('getState()').and.returnValue({});

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should dispatch a START action for the type', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(actions.get.START)());
                });

                it('should call the api', function() {
                    expect(dispatch).toHaveBeenCalledWith(callAPI({
                        types: [
                            {
                                type: GET.START,
                                meta: { type, key: 'id', id }
                            },
                            {
                                type: GET.SUCCESS,
                                meta: { type, key: 'id', id }
                            },
                            {
                                type: GET.FAILURE,
                                meta: { type, key: 'id', id }
                            }
                        ],
                        endpoint: `${endpoint}/${id}`,
                        method: 'GET'
                    }));
                });

                describe('if the action succeeds', function() {
                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        dispatchDeferred.resolve(item);
                        setTimeout(done);
                    });

                    it('should dispatch a SUCCESS action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.get.SUCCESS)([item.id]));
                    });

                    it('should fulfill with an Array of ids', function() {
                        expect(success).toHaveBeenCalledWith([item.id]);
                    });
                });

                describe('if the action fails', function() {
                    let reason;

                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        reason = new Error('It went wrong.');
                        dispatchDeferred.reject(reason);
                        setTimeout(done);
                    });

                    it('should dispatch a FAILURE action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.get.FAILURE)(reason));
                    });

                    it('should reject with the reason', function() {
                        expect(failure).toHaveBeenCalledWith(reason);
                    });
                });

                describe('if another key is specified', function() {
                    let key;

                    beforeEach(function(done) {
                        key = 'token';
                        dispatch.calls.reset();

                        createDbActions({ type, endpoint, key }).get({ id })(dispatch, getState).then(success, failure);
                        setTimeout(done);
                    });

                    it('should call the api with that key in the meta', function() {
                        expect(dispatch.calls.mostRecent().args[0][CALL_API].types).toEqual([0, 1, 2].map(() => jasmine.objectContaining({ meta: { type, key, id } })));
                    });
                });
            });
        });

        describe('create({ data })', function() {
            let data;
            let thunk;

            beforeEach(function() {
                data = {
                    foo: 'bar',
                    hello: 'world'
                };
                thunk = actions.create({ data });
            });

            it('should return a thunk', function() {
                expect(thunk).toEqual(jasmine.any(Function));
            });

            it('should include action names', function() {
                expect(actions.create.START).toBe(`@@db:${type}/CREATE/START`);
                expect(actions.create.SUCCESS).toBe(`@@db:${type}/CREATE/SUCCESS`);
                expect(actions.create.FAILURE).toBe(`@@db:${type}/CREATE/FAILURE`);
            });

            describe('when called', function() {
                let item, dispatchDeferred;
                let dispatch, getState;
                let success, failure;

                beforeEach(function(done) {
                    item = {
                        id: createUuid(),
                        foo: 'bar',
                        hello: 'world'
                    };
                    dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                    getState = jasmine.createSpy('getState()').and.returnValue({});

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should dispatch a START action for the type', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(actions.create.START)());
                });

                it('should call the api', function() {
                    expect(dispatch).toHaveBeenCalledWith(callAPI({
                        types: [
                            {
                                type: CREATE.START,
                                meta: { type, key: 'id', id: null }
                            },
                            {
                                type: CREATE.SUCCESS,
                                meta: { type, key: 'id', id: null }
                            },
                            {
                                type: CREATE.FAILURE,
                                meta: { type, key: 'id', id: null }
                            }
                        ],
                        endpoint: endpoint,
                        method: 'POST',
                        body: data
                    }));
                });

                describe('if the action succeeds', function() {
                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        dispatchDeferred.resolve(item);
                        setTimeout(done);
                    });

                    it('should dispatch a SUCCESS action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.create.SUCCESS)([item.id]));
                    });

                    it('should fulfill with an Array of ids', function() {
                        expect(success).toHaveBeenCalledWith([item.id]);
                    });
                });

                describe('if the action fails', function() {
                    let reason;

                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        reason = new Error('It went wrong.');
                        dispatchDeferred.reject(reason);
                        setTimeout(done);
                    });

                    it('should dispatch a FAILURE action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.create.FAILURE)(reason));
                    });

                    it('should reject with the reason', function() {
                        expect(failure).toHaveBeenCalledWith(reason);
                    });
                });

                describe('if another key is specified', function() {
                    let key;

                    beforeEach(function() {
                        key = 'token';
                        dispatch.calls.reset();

                        createDbActions({ type, endpoint, key }).create({ data })(dispatch, getState).then(success, failure);
                    });

                    it('should call the api with that key in the meta', function() {
                        expect(dispatch.calls.mostRecent().args[0][CALL_API].types).toEqual([0, 1, 2].map(() => jasmine.objectContaining({ meta: { type, key, id: null } })));
                    });
                });
            });
        });

        describe('update({ data })', function() {
            let data;
            let thunk;

            beforeEach(function() {
                data = {
                    id: 'cam-' + createUuid(),
                    foo: 'bar',
                    hello: 'world'
                };
                thunk = actions.update({ data });
            });

            it('should return a thunk', function() {
                expect(thunk).toEqual(jasmine.any(Function));
            });

            it('should include action names', function() {
                expect(actions.update.START).toBe(`@@db:${type}/UPDATE/START`);
                expect(actions.update.SUCCESS).toBe(`@@db:${type}/UPDATE/SUCCESS`);
                expect(actions.update.FAILURE).toBe(`@@db:${type}/UPDATE/FAILURE`);
            });

            describe('when evaluated', function() {
                let dispatch, getState;
                let state, fullData, dispatchDeferred;
                let success, failure;

                beforeEach(function(done) {
                    state = {
                        db: {
                            campaign: {
                                [data.id]: {
                                    name: 'Me',
                                    what: 'isup?'
                                }
                            }
                        }
                    };

                    fullData = assign({}, state.db.campaign[data.id], data, { server: true });

                    dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                    getState = jasmine.createSpy('getState()').and.returnValue(state);

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should dispatch a START action for the type', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(actions.update.START)());
                });

                it('should dispatch an api call', function() {
                    expect(dispatch).toHaveBeenCalledWith(callAPI({
                        types: [
                            {
                                type: UPDATE.START,
                                meta: { type, key: 'id', id: data.id }
                            },
                            {
                                type: UPDATE.SUCCESS,
                                meta: { type, key: 'id', id: data.id }
                            },
                            {
                                type: UPDATE.FAILURE,
                                meta: { type, key: 'id', id: data.id }
                            }
                        ],
                        endpoint: `${endpoint}/${data.id}`,
                        method: 'PUT',
                        body: assign({}, state.db.campaign[data.id], data)
                    }));
                });

                describe('if the action succeeds', function() {
                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        dispatchDeferred.resolve(fullData);
                        setTimeout(done);
                    });

                    it('should dispatch a SUCCESS action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.update.SUCCESS)([fullData.id]));
                    });

                    it('should fulfill the Promise', function() {
                        expect(success).toHaveBeenCalledWith([fullData.id]);
                    });
                });

                describe('if the action fails', function() {
                    let reason;

                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        reason = new Error('It went wrong.');
                        dispatchDeferred.reject(reason);
                        setTimeout(done);
                    });

                    it('should dispatch a FAILURE action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.update.FAILURE)(reason));
                    });

                    it('should reject with the reason', function() {
                        expect(failure).toHaveBeenCalledWith(reason);
                    });
                });

                describe('if another key is specified', function() {
                    let key;

                    beforeEach(function(done) {
                        key = 'token';
                        data.token = data.id;
                        fullData.token = data.token;
                        delete data.id;
                        delete fullData.id;

                        success.calls.reset();
                        failure.calls.reset();
                        dispatch.calls.reset();
                        dispatchDeferred.resolve(fullData);

                        createDbActions({ type, endpoint, key }).update({ data })(dispatch, getState).then(success, failure);
                        setTimeout(done);
                    });

                    it('should call the api with that key in the meta', function() {
                        expect(dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ [CALL_API]: jasmine.any(Object) }));
                        expect(dispatch.calls.all()[1].args[0][CALL_API].types).toEqual([0, 1, 2].map(() => jasmine.objectContaining({ meta: { type, key, id: data.token } })));
                    });

                    it('should fulfill with the key value', function() {
                        expect(success).toHaveBeenCalledWith([data.token]);
                    });
                });

                describe('if the data has no id', function() {
                    beforeEach(function(done) {
                        delete data.id;
                        thunk = actions.update({ data });

                        success.calls.reset();
                        failure.calls.reset();
                        dispatch.calls.reset();
                        dispatch.and.callFake(action => Promise.reject(action.payload));

                        thunk(dispatch, getState).then(success, failure);
                        setTimeout(done);
                    });

                    it('should not call the api', function() {
                        expect(dispatch.calls.count()).toBe(1);
                    });

                    it('should dispatch an error', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.update.FAILURE)(new Error('data must have a(n) id')));
                    });

                    it('should reject the promise', function() {
                        expect(failure).toHaveBeenCalledWith(new Error('data must have a(n) id'));
                    });
                });

                describe('if there is no existing object', function() {
                    beforeEach(function(done) {
                        data.id = 'cam-' + createUuid();
                        thunk = actions.update({ data });

                        success.calls.reset();
                        failure.calls.reset();
                        dispatch.calls.reset();
                        dispatch.and.callFake(action => Promise.reject(action.payload));

                        thunk(dispatch, getState).then(success, failure);
                        setTimeout(done);
                    });

                    it('should not call the api', function() {
                        expect(dispatch.calls.count()).toBe(1);
                    });

                    it('should dispatch an error', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.update.FAILURE)(new Error(`have no campaign with id(${data.id})`)));
                    });

                    it('should reject the promise', function() {
                        expect(failure).toHaveBeenCalledWith(new Error(`have no campaign with id(${data.id})`));
                    });
                });
            });
        });

        describe('remove({ id })', function() {
            let id;
            let thunk;

            beforeEach(function() {
                id = 'cam-' + createUuid();
                thunk = actions.remove({ id });
            });

            it('should include action names', function() {
                expect(actions.remove.START).toBe(`@@db:${type}/REMOVE/START`);
                expect(actions.remove.SUCCESS).toBe(`@@db:${type}/REMOVE/SUCCESS`);
                expect(actions.remove.FAILURE).toBe(`@@db:${type}/REMOVE/FAILURE`);
            });

            it('should return a thunk', function() {
                expect(thunk).toEqual(jasmine.any(Function));
            });

            describe('when called', function() {
                let dispatchDeferred;
                let dispatch, getState;
                let success, failure;

                beforeEach(function(done) {
                    dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);
                    getState = jasmine.createSpy('getState()').and.returnValue({});

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    thunk(dispatch, getState).then(success, failure);
                    setTimeout(done);
                });

                it('should dispatch a START action for the type', function() {
                    expect(dispatch).toHaveBeenCalledWith(createAction(actions.remove.START)());
                });

                it('should call the api', function() {
                    expect(dispatch).toHaveBeenCalledWith(callAPI({
                        types: [
                            {
                                type: REMOVE.START,
                                meta: { type, key: 'id', id }
                            },
                            {
                                type: REMOVE.SUCCESS,
                                meta: { type, key: 'id', id }
                            },
                            {
                                type: REMOVE.FAILURE,
                                meta: { type, key: 'id', id }
                            }
                        ],
                        endpoint: `${endpoint}/${id}`,
                        method: 'DELETE'
                    }));
                });

                describe('if the action succeeds', function() {
                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        dispatchDeferred.resolve(undefined);
                        setTimeout(done);
                    });

                    it('should dispatch a SUCCESS action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.remove.SUCCESS)([id]));
                    });

                    it('should fulfill with an Array of ids', function() {
                        expect(success).toHaveBeenCalledWith([id]);
                    });
                });

                describe('if the action fails', function() {
                    let reason;

                    beforeEach(function(done) {
                        dispatch.calls.reset();

                        reason = new Error('It went wrong.');
                        dispatchDeferred.reject(reason);
                        setTimeout(done);
                    });

                    it('should dispatch a FAILURE action for the type', function() {
                        expect(dispatch).toHaveBeenCalledWith(createAction(actions.remove.FAILURE)(reason));
                    });

                    it('should reject with the reason', function() {
                        expect(failure).toHaveBeenCalledWith(reason);
                    });
                });

                describe('if another key is specified', function() {
                    let key;

                    beforeEach(function(done) {
                        key = 'token';

                        createDbActions({ type, endpoint, key }).remove({ id })(dispatch, getState).then(success, failure);
                        setTimeout(done);
                    });

                    it('should call the api with that key in the meta', function() {
                        expect(dispatch.calls.mostRecent().args[0][CALL_API].types).toEqual([0, 1, 2].map(() => jasmine.objectContaining({ meta: { type, key, id } })));
                    });
                });
            });
        });
    });

    describe('createDbReducer(entityReducers)', function() {
        let entityReducers;
        let reducer;

        beforeEach(function() {
            entityReducers = {
                user: jasmine.createSpy('user()').and.returnValue({}),
                campaign: jasmine.createSpy('campaign()').and.returnValue({})
            };

            reducer = createDbReducer(entityReducers);
        });

        it('should return a reducing function', function() {
            expect(reducer).toEqual(jasmine.any(Function));
        });

        describe('on init', function() {
            let state;

            beforeEach(function() {
                state = reducer(undefined, {});
            });

            it('should initialize a cache for each entity', function() {
                expect(state).toEqual({
                    user: {},
                    campaign: {}
                });
            });

            it('should not call any reducers', function() {
                Object.keys(entityReducers).forEach(key => expect(entityReducers[key]).not.toHaveBeenCalled());
            });
        });

        describe('handling actions', function() {
            let state, newState;

            beforeEach(function() {
                state = {
                    user: {
                        [`u-${createUuid()}`]: {
                            foo: 'bar'
                        },
                        [`u-${createUuid()}`]: {
                            bar: 'foo'
                        }
                    },
                    campaign: {
                        [`cam-${createUuid()}`]: {
                            foo: 'bar'
                        },
                        [`cam-${createUuid()}`]: {
                            bar: 'foo'
                        }
                    }
                };
            });

            describe('a non-db action', function() {
                let action;

                beforeEach(function() {
                    action = createAction('FOO')({});

                    newState = reducer(state, action);
                });

                it('should call each reducer', function() {
                    Object.keys(entityReducers).forEach(key => expect(entityReducers[key]).toHaveBeenCalledWith(state[key], action));
                    expect(newState.user).toBe(entityReducers.user.calls.mostRecent().returnValue);
                    expect(newState.campaign).toBe(entityReducers.campaign.calls.mostRecent().returnValue);
                });
            });

            describe('a db action', function() {
                beforeEach(function() {
                    entityReducers.user.and.callFake(state => clone(state));
                    entityReducers.campaign.and.callFake(state => clone(state));
                });

                describe(LIST.SUCCESS, function() {
                    let payload;
                    let meta;
                    let action;
                    let expected;

                    beforeEach(function() {
                        payload = [
                            {
                                id: `cam-${createUuid()}`,
                                name: 'foo'
                            },
                            {
                                id: `cam-${createUuid()}`,
                                name: 'bar'
                            }
                        ];
                        meta = { type: 'campaign', key: 'id' };

                        expected = assign({}, state, {
                            campaign: assign({}, state.campaign, keyBy(payload, 'id'))
                        });

                        action = createAction(LIST.SUCCESS, null, () => meta)(payload);
                        newState = reducer(state, action);
                    });

                    it('should add the object to the store', function() {
                        expect(newState).toEqual(expected);
                    });

                    it('should call each reducer', function() {
                        Object.keys(entityReducers).forEach(type => expect(entityReducers[type]).toHaveBeenCalledWith(expected[type], action));
                        expect(newState.user).toBe(entityReducers.user.calls.mostRecent().returnValue);
                        expect(newState.campaign).toBe(entityReducers.campaign.calls.mostRecent().returnValue);
                    });
                });

                describe(GET.SUCCESS, function() {
                    let payload;
                    let meta;
                    let action;
                    let expected;

                    beforeEach(function() {
                        payload = {
                            _id: `u-${createUuid()}`,
                            name: 'foo'
                        };
                        meta = { type: 'user', key: '_id' };

                        expected = assign({}, state, {
                            user: assign({}, state.user, {
                                [payload._id]: payload
                            })
                        });

                        action = createAction(GET.SUCCESS, null, () => meta)(payload);
                        newState = reducer(state, action);
                    });

                    it('should add the object to the store', function() {
                        expect(newState).toEqual(expected);
                    });

                    it('should call each reducer', function() {
                        Object.keys(entityReducers).forEach(type => expect(entityReducers[type]).toHaveBeenCalledWith(expected[type], action));
                        expect(newState.user).toBe(entityReducers.user.calls.mostRecent().returnValue);
                        expect(newState.campaign).toBe(entityReducers.campaign.calls.mostRecent().returnValue);
                    });
                });

                describe(CREATE.SUCCESS, function() {
                    let payload;
                    let meta;
                    let action;
                    let expected;

                    beforeEach(function() {
                        payload = {
                            id: `cam-${createUuid()}`,
                            name: 'foo'
                        };
                        meta = { type: 'campaign', key: 'id' };

                        expected = assign({}, state, {
                            campaign: assign({}, state.campaign, {
                                [payload.id]: payload
                            })
                        });

                        action = createAction(CREATE.SUCCESS, null, () => meta)(payload);
                        newState = reducer(state, action);
                    });

                    it('should add the object to the store', function() {
                        expect(newState).toEqual(expected);
                    });

                    it('should call each reducer', function() {
                        Object.keys(entityReducers).forEach(type => expect(entityReducers[type]).toHaveBeenCalledWith(expected[type], action));
                        expect(newState.user).toBe(entityReducers.user.calls.mostRecent().returnValue);
                        expect(newState.campaign).toBe(entityReducers.campaign.calls.mostRecent().returnValue);
                    });
                });

                describe(UPDATE.SUCCESS, function() {
                    let payload;
                    let meta;
                    let action;
                    let expected;

                    beforeEach(function() {
                        payload = {
                            id: Object.keys(state.user)[0],
                            name: 'foo',
                            updated: true
                        };
                        meta = { type: 'user', key: 'id' };

                        expected = assign({}, state, {
                            user: assign({}, state.user, {
                                [payload.id]: payload
                            })
                        });

                        action = createAction(UPDATE.SUCCESS, null, () => meta)(payload);
                        newState = reducer(state, action);
                    });

                    it('should add the object to the store', function() {
                        expect(newState).toEqual(expected);
                    });

                    it('should call each reducer', function() {
                        Object.keys(entityReducers).forEach(type => expect(entityReducers[type]).toHaveBeenCalledWith(expected[type], action));
                        expect(newState.user).toBe(entityReducers.user.calls.mostRecent().returnValue);
                        expect(newState.campaign).toBe(entityReducers.campaign.calls.mostRecent().returnValue);
                    });
                });

                describe(REMOVE.SUCCESS, function() {
                    let payload;
                    let meta;
                    let action;
                    let expected;

                    beforeEach(function() {
                        payload = null;
                        meta = { type: 'campaign', key: 'id', id: Object.keys(state.campaign)[0] };

                        expected = assign({}, state, {
                            campaign: omit(state.campaign, [meta.id])
                        });

                        action = createAction(REMOVE.SUCCESS, null, () => meta)(payload);
                        newState = reducer(state, action);
                    });

                    it('should add the object to the store', function() {
                        expect(newState).toEqual(expected);
                    });

                    it('should call each reducer', function() {
                        Object.keys(entityReducers).forEach(type => expect(entityReducers[type]).toHaveBeenCalledWith(expected[type], action));
                        expect(newState.user).toBe(entityReducers.user.calls.mostRecent().returnValue);
                        expect(newState.campaign).toBe(entityReducers.campaign.calls.mostRecent().returnValue);
                    });
                });
            });
        });
    });
});
