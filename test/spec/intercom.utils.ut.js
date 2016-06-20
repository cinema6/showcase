import defer from 'promise-defer';

const proxyquire = require('proxyquire');

describe('utils: intercom', function() {
    let intercom;
    let intercomId;

    beforeEach(function() {
        intercomId = 'xyz123';
        intercom = proxyquire('../../src/utils/intercom', {
            '../../config': {
                intercomId: intercomId
            }
        }).default;
    });

    it('should exist', function() {
        expect(intercom).toEqual(jasmine.any(Object));
    });

    describe('properties', function() {
        describe('pending', function() {
            it('should be null', function() {
                expect(intercom.pending).toBe(null);
            });
        });

        describe('id', function() {
            it('should be the intercom id from app config', function() {
                expect(intercom.id).toEqual(intercomId);
            });
        });
    });

    describe('methods', function() {
        describe('load()', function() {
            let $script;
            let $scriptTags;
            let $firstScript;

            beforeEach(function() {
                $script = {};
                $firstScript = {
                    parentNode: {
                        insertBefore: jasmine.createSpy('insertBefore()')
                    }
                };
                $scriptTags = [$firstScript];

                spyOn(document, 'createElement').and.returnValue($script);
                spyOn(document, 'getElementsByTagName').and.returnValue($scriptTags);
            });

            it('should only load the script in the page once', function() {
                const call1 = intercom.load();
                const call2 = intercom.load();
                const call3 = intercom.load();

                expect(call1).toEqual(call2);
                expect(call2).toEqual(call3);

                expect(document.createElement.calls.count()).toEqual(1);
                expect($firstScript.parentNode.insertBefore.calls.count()).toEqual(1);
            });

            it('should return a promise', function() {
                expect(intercom.load().then).toBeDefined();
            });

            it('should put pending property to the promise', function() {
                const promise = intercom.load();

                expect(intercom.pending).toBe(promise);
            });

            it('should set properties on the script', function() {
                intercom.load();

                expect($script.type).toEqual('text/javascript');
                expect($script.async).toBe(true);
                expect($script.onload).toEqual(jasmine.any(Function));
                expect($script.src).toEqual('https://widget.intercom.io/widget/' + intercomId);
            });

            it('should insert before first script', function() {
                intercom.load();

                expect($firstScript.parentNode.insertBefore).toHaveBeenCalledWith($script, $firstScript);
            });

            describe('when script onload() is called', function() {
                let success;

                beforeEach(function(done) {
                    success = jasmine.createSpy('success()');

                    window.Intercom = {};

                    intercom.load().then(success);

                    expect(success).not.toHaveBeenCalled();

                    $script.onload();
                    setTimeout(done);
                });

                it('should resolve the promise with the Intercom object', function() {
                    expect(success).toHaveBeenCalledWith(window.Intercom);
                });
            });
        });

        describe('track(...args)', function() {
            let loadDeferred;
            let success;
            let result;

            beforeEach(function() {
                loadDeferred = defer();
                success = jasmine.createSpy('success()');

                spyOn(intercom, 'load').and.returnValue(loadDeferred.promise);

                result = intercom.track('boot', 123, {}).then(success);
            });

            it('should return a promise', function() {
                expect(result.then).toBeDefined();
            });

            it('should call intercom.load() access the Intercom library', function() {
                expect(intercom.load).toHaveBeenCalled();
            });

            describe('when Intercom library is resolved', function() {
                let Intercom;

                beforeEach(function(done) {
                    Intercom = jasmine.createSpy('Intercom()');

                    loadDeferred.resolve(Intercom);

                    setTimeout(done);
                });

                it('should call Intercom with ..args', function() {
                    expect(Intercom).toHaveBeenCalledWith('boot', 123, {});
                });

                it('should resolve promise', function() {
                    expect(success).toHaveBeenCalled();
                });
            });
        });
    });
});