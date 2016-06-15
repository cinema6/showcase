import { mount } from 'enzyme';
import InstallTrackingSetupModal from '../../src/components/InstallTrackingSetupModal';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createUuid } from 'rc-uuid';
import {
    findRenderedDOMComponentWithTag,
    findAllInRenderedTree
} from 'react-addons-test-utils';

describe('InstallTrackingSetupModal', function() {
    beforeEach(function() {
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
            this.modal = this.component.find(Modal).node._modal;
        });

        it('should exist', function() {
            expect(this.modal).toEqual(jasmine.any(Object));
        });

        it('should be passed some props', function() {
            expect(this.modal.props).toEqual(jasmine.objectContaining({
                show: this.props.show,
                onHide: this.props.onClose
            }));
        });

        describe('the input', function() {
            beforeEach(function() {
                this.input = findRenderedDOMComponentWithTag(this.modal, 'input');
            });

            it('should show the campaignId', function() {
                expect(this.input.value).toBe(this.props.campaignId);
            });

            it('should be readOnly', function() {
                expect(this.input.readOnly).toBe(true);
            });
        });

        describe('the copy button', function() {
            beforeEach(function() {
                this.copy = findAllInRenderedTree(this.modal, component => component.constructor.name === 'Copyable')[0];
            });

            it('should exist', function() {
                expect(this.copy).toEqual(jasmine.any(Object));
            });

            it('should wrap a Button', function() {
                expect(this.copy.constructor.WrappedComponent).toBe(Button);
            });

            describe('copyText', function() {
                it('should be the campaignId', function() {
                    expect(this.copy.props.copyText).toBe(this.props.campaignId);
                });
            });

            describe('onCopySuccess()', function() {
                beforeEach(function() {
                    this.copy.props.onCopySuccess();
                });

                it('should call onCopyCampaignIdSuccess()', function() {
                    expect(this.props.onCopyCampaignIdSuccess).toHaveBeenCalledWith();
                });
            });

            describe('onCopyError()', function() {
                beforeEach(function() {
                    this.copy.props.onCopyError();
                });

                it('should call onCopyCampaignIdError()', function() {
                    expect(this.props.onCopyCampaignIdError).toHaveBeenCalledWith();
                });
            });
        });
    });
});
