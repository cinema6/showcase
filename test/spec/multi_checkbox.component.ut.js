import MultiCheckbox from '../../src/components/MultiCheckbox';
import React from 'react';
import { mount } from 'enzyme';

describe('MultiCheckbox', function() {
    beforeEach(function() {
        this.props = {
            value: ['foo', 'bar', 'baz'],
            onChange: jasmine.createSpy('onChange()'),
            option: 'bar',
            className: 'foo',
            'data-foo': 'bar'
        };
        this.component = mount(
            <MultiCheckbox {...this.props} />
        );
        this.checkbox = this.component.find('input');
    });

    it('should exist', function() {
        expect(this.component.length).toEqual(1, 'MultiCheckbox is not rendered');
    });

    it('should render a checkbox', function() {
        expect(this.checkbox.prop('type')).toBe('checkbox');
    });

    it('should pass some props to the checkbox', function() {
        expect(this.checkbox.prop('className')).toEqual('foo');
        expect(this.checkbox.prop('data-foo')).toBe('bar');
    });

    describe('if the initialValue does not contains the option', function() {
        beforeEach(function() {
            this.component.setProps({ value: undefined, initialValue: ['foo', 'baz'] });
        });

        it('should not be checked', function() {
            expect(this.checkbox.prop('checked')).toBe(false);
        });
    });

    describe('if the option is in the value array', function() {
        beforeEach(function() {
            this.component.setProps({ option: this.props.value[1] });
        });

        it('should be checked', function() {
            expect(this.checkbox.prop('checked')).toBe(true);
        });

        describe('when the box is unchecked', function() {
            beforeEach(function() {
                this.checkbox.simulate('change', {
                    target: { checked: false }
                });
            });

            it('should call onChange() with the correct option removed', function() {
                expect(this.component.props().onChange).toHaveBeenCalledWith(['foo', 'baz']);
            });
        });
    });

    describe('if the option is not in the value array', function() {
        beforeEach(function() {
            this.component.setProps({ option: 'BLAM' });
        });

        it('should not be checked', function() {
            expect(this.checkbox.prop('checked')).toBe(false);
        });

        describe('when the box is checked', function() {
            beforeEach(function() {
                this.checkbox.simulate('change', {
                    target: { checked: true }
                });
            });

            it('should call onChange() with the correct option removed', function() {
                expect(this.component.props().onChange).toHaveBeenCalledWith(['foo', 'bar', 'baz', 'BLAM']);
            });
        });
    });
});
