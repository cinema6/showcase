'use strict';

import React, { Component, PropTypes } from 'react';

export default class AppSearchItem extends Component {
    render() {
        const data = this.props.suggestion || this.props.token;
        const { active } = this.props;

        return (
            <span>
                <h5>{active && (<span>**</span>)}{data.title}</h5>
            </span>
        );
    }
}

AppSearchItem.propTypes = {
    suggestion: PropTypes.object,
    token: PropTypes.object,
    active: PropTypes.bool
};
