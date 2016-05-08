'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import NotificationCenter from './NotificationCenter';

export class Application extends Component {
    render() {
        return (<div>
            <NotificationCenter />
            {this.props.children}
        </div>);
    }
}

Application.propTypes = {
    children: PropTypes.node.isRequired
};

export default connect()(Application);
