import React, { Component, PropTypes } from 'react';
import { omit, noop, get } from 'lodash';
import Clipboard from 'clipboard';
import { findDOMNode } from 'react-dom';

export default function copyable() {
    return function createWrapper(Wrapped) {
        class Copyable extends Component {
            componentDidMount() {
                this.clipboard = new Clipboard(findDOMNode(this), {
                    text: () => this.props.copyText,
                })
                .on('success', event => get(this.props, 'onCopySuccess', noop)(event))
                .on('error', event => get(this.props, 'onCopyError', noop)(event));
            }

            componentWillUnmount() {
                this.clipboard.destroy();
            }

            render() {
                const passable = omit(this.props, Object.keys(Copyable.propTypes));

                return <Wrapped {...passable} />;
            }
        }
        Copyable.WrappedComponent = Wrapped;

        Copyable.propTypes = {
            copyText: PropTypes.string.isRequired,

            onCopySuccess: PropTypes.func,
            onCopyError: PropTypes.func,
        };

        return Copyable;
    };
}
