'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import NotificationCenter from './NotificationCenter';
import AlertManager from './AlertManager';
import DocumentTitle from 'react-document-title';

export class Application extends Component {
    render() {
        return (<div>
            <DocumentTitle title="Reelcontent Apps" />
            <NotificationCenter />
            <AlertManager />
            {this.props.children}
        </div>);
    }
}

Application.propTypes = {
    children: PropTypes.node.isRequired
};

export default connect()(Application);
