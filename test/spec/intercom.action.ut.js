import { getThunk } from '../../src/middleware/fsa_thunk';

const proxyquire = require('proxyquire');

describe('actions: intercom', function() {
    let intercomUtil;
    let actions;
    let intercomTrackLogin;
    let intercomTrackLogout;

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

        intercomTrackLogin = actions.intercomTrackLogin;
        intercomTrackLogout = actions.intercomTrackLogout;
    });

    describe('intercomTrackLogin', function() {
        let user;
        let thunk;

        beforeEach(function() {
            user = {
                firstName: 'Scott',
                lastName: 'Munson',
                email: 'scott@cinema6.com',
                created: '2014-03-13T15:28:23.653Z'
            };

            thunk = getThunk(intercomTrackLogin(user));
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

    describe('intercomTrackLogout', function() {
        let thunk;

        beforeEach(function() {
            thunk = getThunk(intercomTrackLogout());
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
