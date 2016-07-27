import { mount, ReactWrapper } from 'enzyme';
import InstallTrackingSetupModal from '../../src/components/InstallTrackingSetupModal';
import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createUuid } from 'rc-uuid';

describe('InstallTrackingSetupModal', function() {
    beforeEach(function() {
        this.getModal = function getModal() {
            return new ReactWrapper(this.component.find('Portal').prop('children'), null, {
                context: {
                    $bs_modal: { onHide: () => {} }
                },
                childContextTypes: {
                    $bs_modal: PropTypes.object.isRequired
                }
            });
        };

        this.props = {
            show: true,
            onClose: jasmine.createSpy('onClose()'),

            campaignId: `cam-${createUuid()}`,
            onCopyCampaignIdSuccess: jasmine.createSpy('onCopyCampaignIdSuccess()'),
            onCopyCampaignIdError: jasmine.createSpy('onCopyCampaignIdError()')
        };

        this.component = mount(
            <InstallTrackingSetupModal {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toEqual(1, 'InstallTrackingSetupModal not rendered');
    });

    describe('the Modal', function() {
        beforeEach(function() {
            this.modal = this.getModal();
        });

        it('should be passed some props', function() {
            expect(this.component.find(Modal).props()).toEqual(jasmine.objectContaining({
                show: this.props.show,
                onHide: this.props.onClose
            }));
        });

        describe('the input', function() {
            beforeEach(function() {
                this.input = this.modal.find('input');
            });

            it('should show the campaignId', function() {
                expect(this.input.prop('value')).toBe(this.props.campaignId);
            });

            it('should be readOnly', function() {
                expect(this.input.prop('readOnly')).toBe(true);
            });
        });

        describe('the copy button', function() {
            beforeEach(function() {
                this.copy = this.modal.find('Copyable');
            });

            it('should exist', function() {
                expect(this.copy.length).toEqual(1);
            });

            it('should wrap a Button', function() {
                expect(this.copy.type().WrappedComponent).toBe(Button);
            });

            describe('copyText', function() {
                it('should be the campaignId', function() {
                    expect(this.copy.prop('copyText')).toBe(this.props.campaignId);
                });
            });

            describe('onCopySuccess()', function() {
                beforeEach(function() {
                    this.copy.prop('onCopySuccess')();
                });

                it('should call onCopyCampaignIdSuccess()', function() {
                    expect(this.props.onCopyCampaignIdSuccess).toHaveBeenCalledWith();
                });
            });

            describe('onCopyError()', function() {
                beforeEach(function() {
                    this.copy.prop('onCopyError')();
                });

                it('should call onCopyCampaignIdError()', function() {
                    expect(this.props.onCopyCampaignIdError).toHaveBeenCalledWith();
                });
            });
        });
    });
});
