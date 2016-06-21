import { getThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

describe('actions: intercom', function() {
    let intercomUtil;
    let actions;
    let trackLogin;
    let trackLogout;

    beforeEach(function() {
        intercomUtil = {
            id: 'xyz123',
            track: jasmine.createSpy('intercom.track()')
        };

        actions = proxyquire('../../src/actions/intercom', {
            '../utils/intercom': {
                default: intercomUtil,
                __esModule: true
            }
        });

        trackLogin = actions.trackLogin;
        trackLogout = actions.trackLogout;
    });

    describe('trackLogin', function() {
        let user;
        let thunk;

        beforeEach(function() {
            user = {
                firstName: 'Scott',
                lastName: 'Munson',
                email: 'scott@cinema6.com',
                created: '2014-03-13T15:28:23.653Z'
            };

            thunk = getThunk(trackLogin(user));
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            it('should call intercom.track()', function() {
                thunk();

                expect(intercomUtil.track).toHaveBeenCalledWith('boot', {
                    app_id: 'xyz123',
                    name: 'Scott Munson',
                    email: 'scott@cinema6.com',
                    created_at: '2014-03-13T15:28:23.653Z',
                    rc_app: 'showcase apps'
                });
            });
        });
    });

    describe('trackLogout', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(trackLogout());
        });

        it('should return a thunk', function() {
            expect(thunk).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            it('should call intercom.track()', function() {
                thunk();

                expect(intercomUtil.track).toHaveBeenCalledWith('shutdown');
            });
        });
    });
});
