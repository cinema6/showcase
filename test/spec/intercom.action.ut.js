import intercom from '../../src/utils/intercom';
import { getThunk } from '../../src/middleware/fsa_thunk';
import defer from 'promise-defer';

const proxyquire = require('proxyquire');

describe('actions: intercom', function() {
    let intercomUtil;
    let actions;
    let intercomTrackLogin;

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
            let dispatch;
            let dispatchDeferred;

            beforeEach(function() {
                dispatch = jasmine.createSpy('dispatch()').and.returnValue((dispatchDeferred = defer()).promise);

                thunk(dispatch);
            });

            it('should call intercom.track()', function() {
                expect(intercomUtil.track).toHaveBeenCalledWith('boot', {
                    app_id: 'xyz123',
                    name: 'Scott Munson',
                    email: 'scott@cinema6.com',
                    created_at: '2014-03-13T15:28:23.653Z',
                    rc_app: 'showcase apps',
                });
            });
        });
    });
});
