import AdPreviewModal from '../../src/components/AdPreviewModal';
import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';
import React from 'react';
import { Modal } from 'react-bootstrap';
import AdPreview from '../../src/components/AdPreview';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import { productDataFromCampaign } from '../../src/utils/campaign';

describe('AdPreviewModal', function() {
    beforeEach(function() {
        this.campaign = {
            product: {
                name: 'My Awesome App',
                description: 'The best description.',
                images: [
                    { type: 'thumbnail', uri: 'img.jpg' }
                ],
                price: '$2.99',
                rating: 4.5
            }
        };
        this.props = {
            show: true,
            campaign: this.campaign,

            onClose: jasmine.createSpy('onClose()')
        };
        this.component = renderIntoDocument(
            <AdPreviewModal {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component).toEqual(jasmine.any(Object));
    });

    it('should render a modal', function() {
        const modal = findRenderedComponentWithType(this.component, Modal);

        expect(modal).toEqual(jasmine.any(Object));
        expect(modal.props.show).toBe(this.props.show);
        expect(modal.props.onHide).toBe(this.props.onClose);
    });

    describe('the Modal', function() {
        beforeEach(function() {
            this.modal = findRenderedComponentWithType(this.component, Modal)._modal;
        });

        it('should exist', function() {
            expect(this.modal).toEqual(jasmine.any(Object));
        });

        describe('AdPreview', function() {
            beforeEach(function() {
                this.preview = findRenderedComponentWithType(this.modal, AdPreview);
            });

            it('should exist', function() {
                expect(this.preview).toEqual(jasmine.any(Object));
            });

            describe('props', function() {
                describe('productData', function() {
                    it('should be the campaign\'s productData', function() {
                        expect(this.preview.props.productData).toEqual(productDataFromCampaign(this.campaign));
                    });
                });

                describe('cardOptions', function() {
                    it('should be an Object', function() {
                        expect(this.preview.props.cardOptions).toEqual({
                            cardType: 'showcase-app',
                            advanceInterval: 3
                        });
                    });
                });

                describe('placementOptions', function() {
                    it('should be some placement options', function() {
                        expect(this.preview.props.placementOptions).toEqual({
                            type: 'mobile-card',
                            branding: 'showcase-app--interstitial'
                        });
                    });
                });

                describe('factory', function() {
                    it('should be the interstitial factory', function() {
                        expect(this.preview.props.factory).toBe(createInterstitialFactory);
                    });
                });
            });
        });
    });
});
