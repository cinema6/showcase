import loader, { Loader } from '../../src/utils/loader';
import { intercomId } from '../../config';
import {
    noop
} from 'lodash';

describe('loader utils', function() {
    describe('Loader(config)', function() {
        beforeEach(function() {
            this.Intercom = jasmine.createSpy('Intercom()');

            this.config = {
                intercom: {
                    src: 'https://widget.intercom.io/widget/foo.js',
                    preload: jasmine.createSpy('preload()'),
                    postload: jasmine.createSpy('postload()').and.returnValue(Promise.resolve(this.Intercom))
                },
                youtube: {
                    src: 'https://youtube.com/api.js'
                }
            };

            this.loader = new Loader(this.config);
        });

        it('should exist', function() {
            expect(this.loader).toEqual(jasmine.any(Object));
        });

        describe('methods:', function() {
            describe('load(name)', function() {
                beforeEach(function(done) {
                    this.name = 'intercom';

                    this.success = jasmine.createSpy('success()');
                    this.failure = jasmine.createSpy('failure()');

                    const createElement = document.createElement;
                    spyOn(document, 'createElement').and.callFake(tag => {
                        switch (tag.toLowerCase()) {
                        case 'script':
                            return createElement.call(document, 'span');
                        default:
                            return createElement.apply(document, tag);
                        }
                    });

                    this.promise = this.loader.load(this.name);
                    this.promise.then(this.success, this.failure);

                    this.script = document.createElement.calls.mostRecent().returnValue;

                    setTimeout(done);
                });

                afterEach(function() {
                    document.head.removeChild(this.script);
                });

                it('should call preload()', function() {
                    expect(this.config.intercom.preload).toHaveBeenCalledWith();
                });

                it('should create a <script>', function() {
                    expect(document.createElement).toHaveBeenCalledWith('script');
                    expect(this.script.src).toBe(this.config.intercom.src);
                    expect(this.script.async).toBe(true);
                    expect(this.script.parentNode).toBe(document.head);
                });

                describe('if there is an error', function() {
                    beforeEach(function(done) {
                        this.script.onerror();
                        setTimeout(done);
                    });

                    it('should reject the Promise', function() {
                        expect(this.failure).toHaveBeenCalledWith(new Error(`Failed to load [intercom](${this.config.intercom.src}).`));
                    });
                });

                describe('when the script is loaded', function() {
                    beforeEach(function(done) {
                        this.script.onload();
                        setTimeout(done);
                    });

                    it('should call postload()', function() {
                        expect(this.config.intercom.postload).toHaveBeenCalledWith();
                    });

                    it('should fulfill with the result of calling postload()', function() {
                        expect(this.success).toHaveBeenCalledWith(this.Intercom);
                    });
                });

                describe('if postload() throws an Error', function() {
                    beforeEach(function(done) {
                        this.error = new TypeError('Made a mistake...');

                        this.config.intercom.postload.and.throwError(this.error);

                        this.script.onload();
                        setTimeout(done);
                    });

                    it('should reject the Promise', function() {
                        expect(this.failure).toHaveBeenCalledWith(this.error);
                    });
                });

                describe('if called again with the same name', function() {
                    beforeEach(function(done) {
                        this.config.intercom.preload.calls.reset();
                        document.createElement.calls.reset();

                        this.result = this.loader.load(this.name);
                        setTimeout(done);
                    });

                    it('should do nothing', function() {
                        expect(document.createElement).not.toHaveBeenCalled();
                        expect(this.config.intercom.preload).not.toHaveBeenCalled();
                    });

                    it('should return the same Promise', function() {
                        expect(this.result).toBe(this.promise);
                    });
                });

                describe('if called again with a different name', function() {
                    beforeEach(function(done) {
                        document.createElement.calls.reset();

                        this.name = 'youtube';

                        this.success.calls.reset();
                        this.failure.calls.reset();

                        this.loader.load(this.name).then(this.success, this.failure);
                        setTimeout(done);

                        this.newScript = document.createElement.calls.mostRecent().returnValue;
                    });

                    afterEach(function() {
                        document.head.removeChild(this.newScript);
                    });

                    it('should create a new <script>', function() {
                        expect(document.createElement).toHaveBeenCalledWith('script');
                        expect(this.newScript.src).toBe(this.config.youtube.src);
                        expect(this.newScript.async).toBe(true);
                        expect(this.newScript.parentNode).toBe(document.head);
                    });

                    describe('when the script is loaded', function() {
                        beforeEach(function(done) {
                            window.youtube = jasmine.createSpy('youtube()');

                            this.newScript.onload();
                            setTimeout(done);
                        });

                        afterEach(function() {
                            delete window.youtube;
                        });

                        it('should fulfill the Promise', function() {
                            expect(this.success).toHaveBeenCalledWith(window.youtube);
                        });
                    });
                });

                describe('if called with an unknown name', function() {
                    beforeEach(function(done) {
                        this.name = 'foo';

                        this.success.calls.reset();
                        this.failure.calls.reset();

                        this.loader.load(this.name).then(this.success, this.failure);
                        setTimeout(done);
                    });

                    it('should reject the Promise', function() {
                        expect(this.failure).toHaveBeenCalledWith(new Error(`Unknown resource: [${this.name}].`));
                    });
                });
            });
        });
    });

    describe('loader', function() {
        it('should exist', function() {
            expect(loader).toEqual(jasmine.any(Loader));
        });

        describe('intercom', function() {
            it('should load the intercom src', function() {
                expect(loader.config.intercom.src).toBe(`https://widget.intercom.io/widget/${intercomId}`);
            });

            describe('postload()', function() {
                beforeEach(function() {
                    window.Intercom = jasmine.createSpy('Intercom()');

                    this.result = loader.config.intercom.postload();
                });

                afterEach(function() {
                    delete window.Intercom;
                });

                it('should return window.Intercom', function() {
                    expect(this.result).toBe(window.Intercom);
                });
            });
        });

        describe('adwords', function() {
            it('should load the adwords source', function() {
                expect(loader.config.adwords.src).toBe('https://www.googleadservices.com/pagead/conversion_async.js');
            });

            describe('postload()', function() {
                describe('if window.google_trackConversion is undefined', function() {
                    beforeEach(function() {
                        delete window.google_trackConversion;

                        this.result = loader.config.adwords.postload();
                    });

                    it('should return a noop()', function() {
                        expect(this.result).toBe(noop);
                    });
                });

                describe(' if window.google_trackConversion is defined', function() {
                    beforeEach(function() {
                        window.google_trackConversion = jasmine.createSpy('google_trackConversion()');

                        this.result = loader.config.adwords.postload();
                    });

                    afterEach(function() {
                        delete window.google_trackConversion;
                    });

                    it('should return window.google_trackConversion', function() {
                        expect(this.result).toBe(window.google_trackConversion);
                    });
                });
            });
        });

        describe('twitter', function() {
            it('should the twitter source', function() {
                expect(loader.config.twitter.src).toBe('https://platform.twitter.com/oct.js');
            });

            describe('postload()', function() {
                beforeEach(function() {
                    window.twttr = {
                        conversion: {
                            trackPid: jasmine.createSpy('twttr.conversion.trackPid()')
                        }
                    };

                    this.result = loader.config.twitter.postload();
                });

                afterEach(function() {
                    delete window.twttr;
                });

                it('should return window.twttr', function() {
                    expect(this.result).toBe(window.twttr);
                });
            });
        });

        describe('facebook', function() {
            it('should load the facebook source', function() {
                expect(loader.config.facebook.src).toBe('https://connect.facebook.net/en_US/fbevents.js');
            });

            describe('preload()', function() {
                beforeEach(function() {
                    loader.config.facebook.preload();
                });

                afterEach(function() {
                    delete window._fbq;
                    delete window.fbq;
                });

                it('should define a window.fbq Function', function() {
                    expect(window.fbq).toEqual(jasmine.any(Function));
                    expect(window._fbq).toBe(window.fbq);
                    expect(window.fbq.push).toBe(window._fbq);
                    expect(window.fbq.loaded).toBe(true);
                    expect(window.fbq.version).toBe('2.0');
                    expect(window.fbq.queue).toEqual([]);
                });

                describe('the fbq Function', function() {
                    describe('if fbq.callMethod is defined', function() {
                        beforeEach(function() {
                            window.fbq.callMethod = jasmine.createSpy('fbq.callMethod()');

                            window.fbq('foo', 'bar');
                        });

                        it('should call it', function() {
                            expect(window.fbq.callMethod).toHaveBeenCalledWith('foo', 'bar');
                        });
                    });

                    describe('if window.fbq.callMethod is not defined', function() {
                        beforeEach(function() {
                            delete window.fbq.callMethod;

                            window.fbq('foo', 'bar');
                        });

                        it('should push the arguments into the queue', function() {
                            expect(window.fbq.queue[0]).toEqual(['foo', 'bar']);
                        });
                    });
                });
            });

            describe('postload()', function() {
                beforeEach(function() {
                    window.fbq = jasmine.createSpy('fbq()');

                    this.result = loader.config.facebook.postload();
                });

                afterEach(function() {
                    delete window.fbq;
                });

                it('should call fbq(\'init\', ...)', function() {
                    expect(window.fbq).toHaveBeenCalledWith('init', '202344783438882');
                });

                it('should return window.fbq', function() {
                    expect(this.result).toBe(window.fbq);
                });
            });
        });
    });
});
