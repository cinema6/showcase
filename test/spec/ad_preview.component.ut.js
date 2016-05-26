import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';
import React, { Component, PropTypes } from 'react';
import { Player } from 'c6embed';
import defer from 'promise-defer';
import { defaults, assign } from 'lodash';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import {
    findDOMNode,
    unmountComponentAtNode
} from 'react-dom';

const proxyquire = require('proxyquire');

function wait(ticks = 5) {
    return Array.apply([], new Array(ticks)).reduce(promise => {
        return promise.then(() => {});
    }, Promise.resolve());
}

describe('AdPreview', function() {
    class Renderer extends Component {
        constructor(props) {
            super(...arguments);

            this.state = {
                childProps: props.childProps
            };
        }

        render() {
            const {
                AdPreview
            } = this.props;
            const {
                childProps
            } = this.state;

            return <AdPreview {...childProps} />;
        }
    }
    Renderer.propTypes = {
        childProps: PropTypes.object.isRequired,
        AdPreview: PropTypes.func.isRequired
    };

    beforeEach(function() {
        this.Player = jasmine.createSpy('Player()').and.callFake((endpoint, params, data) => {
            const player = new Player(endpoint, params, data);

            spyOn(player, 'bootstrap').and.callFake(container => {
                const iframe = document.createElement('iframe');

                container.appendChild(iframe);

                player.frame = iframe;

                return (this.bootstrapDeferred = defer()).promise;
            });

            return player;
        });

        this.AdPreview = proxyquire('../../src/components/AdPreview', {
            'react': React,
            'c6embed': {
                Player: this.Player
            }
        }).default;

        this.productData = {
            type: 'app',
            platform: 'iOS',
            name: 'Dogs Monthly Magazine',
            description: 'Expert vet, behaviour and training advice for dog owners',
            uri: 'https://itunes.apple.com/us/app/dogs-monthly-magazine-expert/id452674411?mt=8&uo=4',
            categories: [
                'Lifestyle',
                'Magazines & Newspapers',
                'Pets'
            ],
            price: 'Free',
            extID: 452674411,
            images: [
                {
                    uri: 'http://a2.mzstatic.com/us/r30/Purple6/v4/24/06/1e/24061e89-b4ef-39c8-8fbb-21bbf9717249/screen1136x1136.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a2.mzstatic.com/us/r30/Purple69/v4/32/76/06/327606f6-4897-5fff-2594-81188ef5ee4a/screen1136x1136.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a1.mzstatic.com/us/r30/Purple69/v4/84/5f/3d/845f3d0f-b683-07c7-49ed-ca1c6b5cfca1/screen1136x1136.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a4.mzstatic.com/us/r30/Purple69/v4/17/68/d5/1768d543-8f97-edf6-b472-b8521eca8ada/screen1136x1136.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a3.mzstatic.com/us/r30/Purple6/v4/7a/d9/a4/7ad9a426-cde4-5622-5784-1914ffc56043/screen1136x1136.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a1.mzstatic.com/us/r30/Purple6/v4/ae/14/01/ae140115-a977-dc93-490f-1657d2e0a0f9/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://a1.mzstatic.com/us/r30/Purple6/v4/27/ab/d1/27abd10e-8790-b2a1-3b38-6a998d764545/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://a1.mzstatic.com/us/r30/Purple6/v4/71/b4/1c/71b41c6e-521f-0722-b4f1-6dc268c67e7e/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://a3.mzstatic.com/us/r30/Purple6/v4/a8/c3/88/a8c38862-ea29-4d8c-5b03-f5b1f5a68d53/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://a1.mzstatic.com/us/r30/Purple6/v4/81/cf/dc/81cfdc21-52be-c9fe-66e6-65ccb3ea77bb/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://is3.mzstatic.com/image/thumb/Purple6/v4/14/f8/b0/14f8b064-29f3-ce4c-7c75-a6c64d2f467f/source/512x512bb.jpg',
                    type: 'thumbnail'
                }
            ]
        };
        this.placementOptions = {
            type: 'mobile-card',
            branding: 'showcase-app--interstitial'
        };
        this.cardOptions = {
            duration: 15,
            slideCount: 3,
            cardType: 'showcase-app'
        };

        jasmine.clock().install();
        jasmine.clock().mockDate();

        this.renderer = renderIntoDocument(
            <Renderer AdPreview={this.AdPreview} childProps={{
                productData: this.productData,
                placementOptions: this.placementOptions,
                cardOptions: this.cardOptions,
                factory: createInterstitialFactory,
                showLoadingAnimation: false,
                loadDelay: 0,
                onLoadComplete: jasmine.createSpy('onLoadComplete()')
            }} />
        );
        this.component = findRenderedComponentWithType(this.renderer, this.AdPreview);
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('should exist', function() {
        expect(this.component).toEqual(jasmine.any(Object));
    });

    it('should render a <div>', function() {
        expect(this.component.refs.root.tagName).toBe('DIV');
    });

    it('should not render the loading animation', function() {
        expect(this.component.refs.root.querySelector('[data-test="animation"]')).toBeNull();
    });

    it('should create a Player', function() {
        expect(this.Player).toHaveBeenCalledWith('/api/public/players/mobile-card', defaults({
            mobileType: this.placementOptions.type,
            preview: true,
            container: 'showcase',
            context: 'showcase',
            autoLaunch: false
        }, this.placementOptions), {
            experience: {
                id: 'e-showcase_preview',
                data: {
                    campaign: {},
                    collateral: {},
                    params: {},
                    links: {},
                    deck: [createInterstitialFactory(this.cardOptions)(this.productData)]
                }
            }
        });
        expect(this.component.player).toBe(this.Player.calls.mostRecent().returnValue);
    });

    it('should bootstrap() the player', function() {
        expect(this.component.player.bootstrap).toHaveBeenCalledWith(this.component.refs.root, {
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%',
            zIndex: 'auto'
        });
    });

    describe('if there is an apiRoot', function() {
        beforeEach(function() {
            this.Player.calls.reset();
            this.renderer = renderIntoDocument(
                <Renderer AdPreview={this.AdPreview} childProps={{
                    productData: this.productData,
                    placementOptions: this.placementOptions,
                    cardOptions: this.cardOptions,
                    factory: createInterstitialFactory,
                    showLoadingAnimation: true,
                    loadDelay: 4000,
                    onLoadComplete: jasmine.createSpy('onLoadComplete()'),
                    apiRoot: 'https://dev.reelcontent.com/'
                }} />
            );
            this.component = findRenderedComponentWithType(this.renderer, this.AdPreview);
        });

        it('should be used when creating the Player', function() {
            expect(this.Player).toHaveBeenCalledWith('https://dev.reelcontent.com/api/public/players/mobile-card', jasmine.any(Object), jasmine.any(Object));
        });
    });

    describe('if there is a loadDelay', function() {
        beforeEach(function() {
            this.Player.calls.reset();
            this.renderer = renderIntoDocument(
                <Renderer AdPreview={this.AdPreview} childProps={{
                    productData: this.productData,
                    placementOptions: this.placementOptions,
                    cardOptions: this.cardOptions,
                    factory: createInterstitialFactory,
                    showLoadingAnimation: true,
                    loadDelay: 4000,
                    onLoadComplete: jasmine.createSpy('onLoadComplete()')
                }} />
            );
            this.component = findRenderedComponentWithType(this.renderer, this.AdPreview);
            this.animation = this.component.refs.root.querySelector('[data-test="animation"]');
        });

        describe('when the player is bootstrapped', function() {
            beforeEach(function(done) {
                spyOn(this.component.player, 'show').and.returnValue((this.showDeferred = defer()).promise);

                jasmine.clock().tick(2000);
                this.bootstrapDeferred.resolve(this.component.player);
                wait().then(done);
            });

            it('should not show the player', function() {
                expect(this.component.player.show).not.toHaveBeenCalled();
            });

            describe('before the delay is reached', function() {
                beforeEach(function(done) {
                    this.renderer.state.childProps.onLoadComplete.calls.reset();

                    jasmine.clock().tick(1999);
                    wait().then(done);
                });

                it('should not show the player', function() {
                    expect(this.component.player.show).not.toHaveBeenCalled();
                });

                it('should not hide the animation', function() {
                    expect(this.animation.classList).not.toContain('hidden');
                });

                it('should not call onLoadComplete()', function() {
                    expect(this.renderer.state.childProps.onLoadComplete).not.toHaveBeenCalled();
                });
            });

            describe('after the delay is reached', function() {
                beforeEach(function(done) {
                    this.renderer.state.childProps.onLoadComplete.calls.reset();

                    jasmine.clock().tick(2000);
                    wait().then(done);
                });

                it('should show the player', function() {
                    expect(this.component.player.show).toHaveBeenCalledWith();
                });

                describe('when the player is shown', function() {
                    beforeEach(function(done) {
                        this.showDeferred.resolve(this.component.player);
                        wait().then(done);
                    });

                    it('should hide the animation', function() {
                        expect(this.animation.classList).toContain('hidden');
                    });

                    it('should call onLoadComplete()', function() {
                        expect(this.renderer.state.childProps.onLoadComplete).toHaveBeenCalledWith();
                    });
                });
            });
        });
    });

    describe('if showLoadingAnimation is true', function() {
        beforeEach(function() {
            this.renderer.setState({
                childProps: assign({}, this.renderer.state.childProps, {
                    showLoadingAnimation: true
                })
            });
            this.animation = this.component.refs.root.querySelector('[data-test="animation"]');
        });

        it('should render the loading animation', function() {
            expect(this.animation).toEqual(jasmine.any(Object));
        });

        it('should show the animation', function() {
            expect(this.animation.classList).not.toContain('hidden');
        });

        describe('when the player is bootstrapped', function() {
            beforeEach(function(done) {
                spyOn(this.component.player, 'show').and.returnValue((this.showDeferred = defer()).promise);

                this.bootstrapDeferred.resolve(this.component.player);
                wait().then(done);
            });

            it('should show the player', function() {
                expect(this.component.player.show).toHaveBeenCalledWith();
            });

            it('should not hide the animation', function() {
                expect(this.animation.classList).not.toContain('hidden');
            });

            describe('when the player is shown', function() {
                beforeEach(function(done) {
                    this.showDeferred.resolve(this.component.player);
                    wait().then(done);
                });

                it('should hide the animation', function() {
                    expect(this.animation.classList).toContain('hidden');
                });
            });
        });
    });

    describe('when the player is bootstraped', function() {
        beforeEach(function(done) {
            spyOn(this.component.player, 'show').and.returnValue((this.showDeferred = defer()).promise);

            this.bootstrapDeferred.resolve(this.component.player);
            wait().then(done);
        });

        it('should show the player', function() {
            expect(this.component.player.show).toHaveBeenCalledWith();
        });

        describe('when the player is shown', function() {
            beforeEach(function(done) {
                this.showDeferred.resolve(this.component.player);
                wait().then(done);
            });

            it('should call onLoadComplete()', function() {
                expect(this.renderer.state.childProps.onLoadComplete).toHaveBeenCalledWith();
            });
        });
    });

    describe('when the productData is updated', function() {
        beforeEach(function() {
            this.previousPlayer = this.component.player;
            this.Player.calls.reset();

            this.productData = assign({}, this.productData, {
                name: 'Awesome new name!',
                description: 'A much better description.'
            });
            this.renderer.setState({
                childProps: assign({}, this.renderer.state.childProps, {
                    productData: this.productData
                })
            });

            this.component.createPlayerDebounced.flush();
        });

        it('should remove the iframe from the DOM', function() {
            expect(this.component.refs.root.contains(this.previousPlayer.frame)).toBe(false, '<iframe> has not been removed.');
        });

        it('should create a new Player', function() {
            expect(this.Player).toHaveBeenCalledWith('/api/public/players/mobile-card', defaults({
                mobileType: this.placementOptions.type,
                preview: true,
                container: 'showcase',
                context: 'showcase',
                autoLaunch: false
            }, this.placementOptions), {
                experience: {
                    id: 'e-showcase_preview',
                    data: jasmine.objectContaining({
                        deck: [createInterstitialFactory(this.cardOptions)(this.productData)]
                    })
                }
            });
            expect(this.component.player).toBe(this.Player.calls.mostRecent().returnValue);
        });

        it('should bootstrap the new player', function() {
            expect(this.component.player.bootstrap).toHaveBeenCalledWith(this.component.refs.root, {
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%',
                zIndex: 'auto'
            });
        });

        describe('when the player is bootstraped', function() {
            beforeEach(function(done) {
                spyOn(this.component.player, 'show').and.returnValue(Promise.resolve(this.component.player));

                this.bootstrapDeferred.resolve(this.component.player);
                wait().then(done);
            });

            it('should show the player', function() {
                expect(this.component.player.show).toHaveBeenCalledWith();
            });
        });
    });

    describe('if the new productData is identical to the previous productData', function() {
        beforeEach(function() {
            this.Player.calls.reset();
            this.component.player.bootstrap.calls.reset();

            this.productData = assign({}, this.productData);
            this.renderer.setState({
                childProps: assign({}, this.renderer.state.childProps, {
                    productData: this.productData
                })
            });

            this.component.createPlayerDebounced.flush();
        });

        it('should not create a new Player', function() {
            expect(this.component.refs.root.contains(this.component.player.frame)).toBe(true, 'Player <iframe> was removed.');
            expect(this.Player).not.toHaveBeenCalled();
        });
    });

    describe('if there is no more productData', function() {
        beforeEach(function() {
            this.Player.calls.reset();
            this.previousPlayer = this.component.player;
            this.renderer.setState({
                childProps: assign({}, this.renderer.state.childProps, {
                    productData: null
                })
            });

            this.component.createPlayerDebounced.flush();
        });

        it('should remove the iframe from the DOM', function() {
            expect(this.component.refs.root.contains(this.previousPlayer.frame)).toBe(false, '<iframe> has not been removed.');
        });

        it('should set the player to null', function() {
            expect(this.component.player).toBeNull();
        });

        it('should not create a new Player', function() {
            expect(this.Player).not.toHaveBeenCalled();
        });
    });

    describe('when removed', function() {
        beforeEach(function() {
            spyOn(this.component.createPlayerDebounced, 'cancel').and.callThrough();

            unmountComponentAtNode(findDOMNode(this.component).parentNode);
        });

        it('should cancel any pending update', function() {
            expect(this.component.createPlayerDebounced.cancel).toHaveBeenCalledWith();
        });

        it('should set player to null', function() {
            expect(this.component.player).toBeNull();
        });
    });
});
