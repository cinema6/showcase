import MultiCheckbox from '../../src/components/MultiCheckbox';
import {
    renderIntoDocument,
    findRenderedDOMComponentWithTag,
    Simulate
} from 'react-addons-test-utils';
import React from 'react';

describe('MultiCheckbox', function() {
    beforeEach(function() {
        this.props = {
            value: ['foo', 'bar', 'baz'],
            onChange: jasmine.createSpy('onChange()'),
            option: 'bar',
            className: 'foo',
            'data-foo': 'bar'
        };
        this.component = renderIntoDocument(
            <MultiCheckbox {...this.props} />
        );
        this.checkbox = findRenderedDOMComponentWithTag(this.component, 'input');
    });

    it('should exist', function() {
        expect(this.component).toEqual(jasmine.any(Object));
    });

    it('should render a checkbox', function() {
        expect(this.checkbox.type).toBe('checkbox');
    });

    it('should pass some props to the checkbox', function() {
        expect(this.checkbox.getAttribute('class')).toEqual('foo');
        expect(this.checkbox.getAttribute('data-foo')).toBe('bar');
    });

    describe('if the initialValue does not contains the option', function() {
        beforeEach(function() {
            delete this.props.value;
            this.props.initialValue = ['foo', 'baz'];

            this.component = renderIntoDocument(
                <MultiCheckbox {...this.props} />
            );
            this.checkbox = findRenderedDOMComponentWithTag(this.component, 'input');
        });

        it('should not be checked', function() {
            expect(this.checkbox.checked).toBe(false);
        });
    });

    describe('if the option is in the value array', function() {
        beforeEach(function() {
            this.props.option = this.props.value[1];
            this.component = renderIntoDocument(
                <MultiCheckbox {...this.props} />
            );
            this.checkbox = findRenderedDOMComponentWithTag(this.component, 'input');
        });

        it('should be checked', function() {
            expect(this.checkbox.checked).toBe(true);
        });

        describe('when the box is unchecked', function() {
            beforeEach(function() {
                this.checkbox.checked = false;
                Simulate.change(this.checkbox);
            });

            it('should call onChange() with the correct option removed', function() {
                expect(this.props.onChange).toHaveBeenCalledWith(['foo', 'baz']);
            });
        });
    });

    describe('if the option is not in the value array', function() {
        beforeEach(function() {
            this.props.option = 'BLAM';
            this.component = renderIntoDocument(
                <MultiCheckbox {...this.props} />
            );
            this.checkbox = findRenderedDOMComponentWithTag(this.component, 'input');
        });

        it('should not be checked', function() {
            expect(this.checkbox.checked).toBe(false);
        });

        describe('when the box is checked', function() {
            beforeEach(function() {
                this.checkbox.checked = true;
                Simulate.change(this.checkbox);
            });

            it('should call onChange() with the correct option removed', function() {
                expect(this.props.onChange).toHaveBeenCalledWith(['foo', 'bar', 'baz', 'BLAM']);
            });
        });
    });
});
