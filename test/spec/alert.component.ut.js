import { mount } from 'enzyme';
import Alert from '../../src/components/Alert';
import { createUuid } from 'rc-uuid';
import React from 'react';
import { Modal } from 'react-bootstrap';

describe('Alert', function() {
    beforeEach(function() {
        this.alert = {
            id: createUuid(),
            title: 'My Alert Rules!',
            description: 'Yes, indeed it does.',
            buttons: [
                {
                    id: createUuid(),
                    type: 'success',
                    text: 'Yes',
                    onSelect: jasmine.createSpy('onSelect()'),
                    submitting: false
                },
                {
                    id: createUuid(),
                    type: 'danger',
                    text: 'No',
                    onSelect: jasmine.createSpy('onSelect()'),
                    submitting: false
                }
            ]
        };
        this.props = {
            alert: this.alert,

            onDismiss: jasmine.createSpy('onDismiss()'),
            onSelect: jasmine.createSpy('onSelect()')
        };

        this.component = mount(
            <Alert {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toEqual(1, 'Alert is not rendered');
    });

    describe('the Modal', function() {
        beforeEach(function() {
            this.modal = this.component.find(Modal);
        });

        it('should exist', function() {
            expect(this.modal.length).toEqual(1, 'Modal is not rendered');
        });

        it('should be small', function() {
            expect(this.modal.props().bsSize).toBe('small');
        });

        it('should be shown', function() {
            expect(this.modal.props().show).toBe(true);
        });

        describe('when the modal is closed', function() {
            beforeEach(function() {
                this.modal.props().onHide();
            });

            it('should call onDismiss()', function() {
                expect(this.props.onDismiss).toHaveBeenCalledWith();
            });
        });
    });
});
