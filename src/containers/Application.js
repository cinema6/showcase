'use strict';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export class Application extends Component {
    render() {
        return this.props.children;
    }
}

Application.propTypes = {
    children: PropTypes.node.isRequired
};

export default connect()(Application);
