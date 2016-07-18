import { getThunk } from '../../src/middleware/fsa_thunk';
import { trackLogin, trackLogout } from '../../src/actions/intercom';
import loader from '../../src/utils/loader';
import { intercomId } from '../../config';

describe('actions: intercom', function() {
    let intercom;

    beforeEach(function() {
        intercom = jasmine.createSpy('intercom()');

        spyOn(loader, 'load').and.callFake(name => {
            switch (name) {
            case 'intercom':
                return Promise.resolve(intercom);
            default:
                return Promise.reject(new Error(`Unknown: ${name}`));
            }
        });
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
            beforeEach(function(done) {
                thunk();
                setTimeout(done);
            });

            it('should call intercom()', function() {
                expect(intercom).toHaveBeenCalledWith('boot', {
                    app_id: intercomId,
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
            beforeEach(function(done) {
                thunk();
                setTimeout(done);
            });

            it('should call intercom()', function() {
                expect(intercom).toHaveBeenCalledWith('shutdown');
            });
        });
    });
});
