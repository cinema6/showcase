import React, { Component, PropTypes } from 'react';
import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';
import Clipboard from 'clipboard';
import { findDOMNode, unmountComponentAtNode } from 'react-dom';
import { get, assign } from 'lodash';

const proxyquire = require('proxyquire');

describe('copyable()(Component)', function() {
    class Wrapped extends Component {
        render() {
            return <div></div>;
        }
    }

    beforeEach(function() {
        this.Clipboard = jasmine.createSpy('Clipboard()').and.callFake(function() {
            return new Clipboard(...arguments);
        });
        this.copyable = proxyquire('../../src/hocs/copyable', {
            'clipboard': this.Clipboard
        }).default;
        this.Copyable = this.copyable()(Wrapped);
    });

    it('should save a reference to the class it wraps', function() {
        expect(this.Copyable.WrappedComponent).toBe(Wrapped);
    });

    describe('when rendered', function() {
        class Renderer extends Component {
            constructor(props) {
                super(...arguments);

                this.state = {
                    props: props.props
                };
            }

            render() {
                const {
                    Copyable
                } = this.props;

                return <Copyable {...this.state.props} />;
            }
        }
        Renderer.propTypes = {
            props: PropTypes.object.isRequired,
            Copyable: PropTypes.func.isRequired
        };

        beforeEach(function() {
            this.props = {
                foo: 'bar',
                hello: 'world'
            };

            this.copyProps = {
                copyText: 'Hello world!',

                onCopySuccess: jasmine.createSpy('onCopySuccess()'),
                onCopyError: jasmine.createSpy('onCopyError()')
            };

            this.renderer = renderIntoDocument(
                <Renderer Copyable={this.Copyable} props={assign({}, this.copyProps, this.props)} />
            );
            this.component = findRenderedComponentWithType(this.renderer, this.Copyable);
            this.wrapped = findRenderedComponentWithType(this.component, Wrapped);
        });

        it('should render the wrapped component', function() {
            expect(this.wrapped).toEqual(jasmine.any(Object));
        });

        it('should pass all of its props to the wrapped component', function() {
            expect(this.wrapped.props).toEqual(this.props);
        });

        it('should create a Clipboard()', function() {
            expect(this.Clipboard).toHaveBeenCalledWith(findDOMNode(this.component), {
                text: jasmine.any(Function)
            });
            expect(this.component.clipboard).toBe(get(this.Clipboard.calls.mostRecent(), 'returnValue'));
            expect(this.Clipboard.calls.mostRecent().args[1].text()).toBe(this.copyProps.copyText);
        });

        describe('when text is copied', function() {
            beforeEach(function() {
                this.event = {
                    action: 'copy',
                    text: this.copyProps.copyText,
                    trigger: findDOMNode(this.component)
                };

                this.component.clipboard.emit('success', this.event);
            });

            it('should call onCopySuccess()', function() {
                expect(this.copyProps.onCopySuccess).toHaveBeenCalledWith(this.event);
            });

            describe('if onCopySuccess() is not provided', function() {
                beforeEach(function() {
                    delete this.copyProps.onCopySuccess;

                    this.component = renderIntoDocument(
                        <this.Copyable {...this.copyProps} {...this.props} />
                    );
                });

                it('should do nothing', function() {
                    expect(() => this.component.clipboard.emit('success', this.event)).not.toThrow();
                });
            });

            describe('if the onCopySuccess callback changes', function() {
                beforeEach(function() {
                    this.old = this.copyProps.onCopySuccess;
                    this.new = jasmine.createSpy('onCopySuccess()');
                    this.old.calls.reset();

                    this.copyProps = assign({}, this.copyProps, {
                        onCopySuccess: this.new
                    });

                    this.renderer.setState({
                        props: assign({}, this.copyProps, this.props)
                    });

                    this.component.clipboard.emit('success', this.event);
                });

                it('should not call the old function', function() {
                    expect(this.old).not.toHaveBeenCalled();
                    expect(this.new).toHaveBeenCalledWith(this.event);
                });
            });
        });

        describe('when the text cannot be copied', function() {
            beforeEach(function() {
                this.event = {
                    action: 'copy',
                    trigger: findDOMNode(this.component)
                };

                this.component.clipboard.emit('error', this.event);
            });

            it('should call onCopyError()', function() {
                expect(this.copyProps.onCopyError).toHaveBeenCalledWith(this.event);
            });

            describe('if onCopyError() is not provided', function() {
                beforeEach(function() {
                    delete this.copyProps.onCopyError;

                    this.component = renderIntoDocument(
                        <this.Copyable {...this.copyProps} {...this.props} />
                    );
                });

                it('should do nothing', function() {
                    expect(() => this.component.clipboard.emit('error', this.event)).not.toThrow();
                });
            });

            describe('if the onCopyError callback changes', function() {
                beforeEach(function() {
                    this.old = this.copyProps.onCopyError;
                    this.new = jasmine.createSpy('onCopyError()');
                    this.old.calls.reset();

                    this.copyProps = assign({}, this.copyProps, {
                        onCopyError: this.new
                    });

                    this.renderer.setState({
                        props: assign({}, this.copyProps, this.props)
                    });

                    this.component.clipboard.emit('error', this.event);
                });

                it('should not call the old function', function() {
                    expect(this.old).not.toHaveBeenCalled();
                    expect(this.new).toHaveBeenCalledWith(this.event);
                });
            });
        });

        describe('and unmounted', function() {
            beforeEach(function() {
                spyOn(this.component.clipboard, 'destroy');

                unmountComponentAtNode(findDOMNode(this.component).parentNode);
            });

            it('should destroy() the clipboard', function() {
                expect(this.component.clipboard.destroy).toHaveBeenCalledWith();
            });
        });
    });
});
