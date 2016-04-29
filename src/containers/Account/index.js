'use strict';

import { connect } from 'react-redux';
import { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import React from 'react';

export class Account extends Component {
    render() {
        return <div>
            <nav>
                <ul>
                    <li><Link to="/dashboard/account/profile">Edit Profile</Link></li>
                    <li><Link to="/dashboard/account/email">Change Email</Link></li>
                    <li><Link to="/dashboard/account/password">Change Password</Link></li>
                </ul>
            </nav>
            <div>{this.props.children}</div>
        </div>;
    }
}

Account.propTypes = {
    children: PropTypes.node.isRequired
};

export default connect()(Account);
