import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import NotificationCenter from './NotificationCenter';
import AlertManager from './AlertManager';
import DocumentTitle from 'react-document-title';

function Application({
    children,
}) {
    return (<div>
        <DocumentTitle title="Reelcontent Apps" />
        <NotificationCenter />
        <AlertManager />
        {children}
    </div>);
}

Application.propTypes = {
    children: PropTypes.node.isRequired,
};

export default connect()(Application);
