import React, { PropTypes, Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { pageify } from '../../utils/page';
import { logoutUser, toggleNav } from '../../actions/dashboard';
import { Link } from 'react-router';
import { Dropdown, MenuItem } from 'react-bootstrap';
import classnames from 'classnames';

class Dashboard extends Component {
    render() {
        const {
            children,
            user,
            page: { showNav },

            logoutUser,
            toggleNav
        } = this.props;

        if (!user) { return null; }

        const initials = user.firstName.charAt(0).toUpperCase() +
            user.lastName.charAt(0).toUpperCase();

        return (<div>
            {/* top navigation bar */}
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" onClick={toggleNav}>
                            <img src="images/rc-logo-square.png" />
                        </a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse pull-right">
                        <ul className="nav navbar-nav ">
                            <li className="dropdown">
                                <Dropdown id="user-management-dropdown">
                                    <Dropdown.Toggle useAnchor={true}>
                                        <span className="user-initials">{initials}</span>
                                        {user.firstName} {user.lastName}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <MenuItem href="#/dashboard/account">My Profile</MenuItem>
                                        <MenuItem onClick={logoutUser}>Sign out</MenuItem>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* vertical menu */} {/*hidden until triggered */}
            <nav id="sidePanel" className={classnames('slideout-menu animated slideInLeft', {
                hidden: !showNav
            })}>
                <ul className="menu-item-list">
                    <li className="menu-item">
                        <Link to="/dashboard/account"><i className="fa fa-user" /> Profile</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/dashboard/billing"><i className="fa fa-usd" /> Billing</Link>
                    </li>
                    <li className="menu-item">
                        <button className="btn btn-link" onClick={logoutUser}>
                            <i className="fa fa-power-off" /> 
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
            {/* vertical menu ends */}
            {children}
        </div>);
    }
}

Dashboard.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
    }),
    page: PropTypes.shape({
        showNav: PropTypes.bool.isRequired
    }).isRequired,

    logoutUser: PropTypes.func.isRequired,
    toggleNav: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const user = state.db.user[state.session.user];

    return {
        user: user || null
    };
}

export default compose(
    pageify({ path: 'dashboard' }),
    connect(mapStateToProps, {
        logoutUser,
        toggleNav
    })
)(Dashboard);
