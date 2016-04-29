import { Component } from 'react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/dashboard';
import { Link } from 'react-router';

export class Dashboard extends Component {
    render() {
        return (<div>
            <nav>
                <ul>
                    <li><Link to="/dashboard">Home</Link></li>
                    <li><Link to="/dashboard/account">Manage Account</Link></li>
                    <li><Link to="/dashboard/billing">Billing</Link></li>
                    <li><button onClick={this.props.logoutUser}>Log Out</button></li>
                </ul>
            </nav>
            {this.props.children}
        </div>);
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default connect(null, {
    logoutUser
})(Dashboard);
