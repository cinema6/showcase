import AdPreviewModal from '../../src/components/AdPreviewModal';
import { mount, ReactWrapper } from 'enzyme';
import React, { PropTypes } from 'react';
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
        this.component = mount(
            <AdPreviewModal {...this.props} />,
            { attachTo: document.createElement('div') }
        );
    });

    it('should exist', function() {
        expect(this.component.length).toEqual(1, 'AdPreviewModal is not rendered');
    });

    it('should render a modal', function() {
        const modal = this.component.find(Modal);

        expect(modal).toEqual(jasmine.any(Object));
        expect(modal.props().show).toBe(this.props.show);
        expect(modal.props().onHide).toBe(this.props.onClose);
    });

    describe('the Modal', function() {
        beforeEach(function() {
            this.modal = new ReactWrapper(this.component.find('Portal').prop('children'), null, {
                context: { $bs_modal: { onHide: () => {} } },
                childContextTypes: { $bs_modal: PropTypes.object.isRequired }
            });
        });

        it('should exist', function() {
            expect(this.modal.length).toBe(1);
        });

        describe('AdPreview', function() {
            beforeEach(function() {
                this.preview = this.modal.find(AdPreview);
            });

            it('should exist', function() {
                expect(this.preview.length).toBe(1, 'AdPreview not rendered.');
            });

            describe('props', function() {
                describe('productData', function() {
                    it('should be the campaign\'s productData', function() {
                        expect(this.preview.prop('productData')).toEqual(productDataFromCampaign(this.campaign));
                    });
                });

                describe('cardOptions', function() {
                    it('should be an Object', function() {
                        expect(this.preview.prop('cardOptions')).toEqual({
                            cardType: 'showcase-app',
                            advanceInterval: 3
                        });
                    });
                });

                describe('placementOptions', function() {
                    it('should be some placement options', function() {
                        expect(this.preview.prop('placementOptions')).toEqual({
                            type: 'mobile-card',
                            branding: 'showcase-app--interstitial'
                        });
                    });
                });

                describe('factory', function() {
                    it('should be the interstitial factory', function() {
                        expect(this.preview.prop('factory')).toBe(createInterstitialFactory);
                    });
                });
            });
        });
    });
});
