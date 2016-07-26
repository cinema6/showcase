import React, { PropTypes, Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { pageify } from '../../utils/page';
import * as dashboardActions from '../../actions/dashboard';
import { Link } from 'react-router';
import { Dropdown, MenuItem } from 'react-bootstrap';
import classnames from 'classnames';
import StatsSummaryBar from '../../components/StatsSummaryBar.js';
import moment from 'moment';

class Dashboard extends Component {
    componentDidMount() {
        this.props.checkIfPaymentMethodRequired();
    }

    render() {
        const {
            children,
            user,
            page: { showNav },

            logoutUser,
            toggleNav,
        } = this.props;

        if (!user) { return null; }

        const initials = user.firstName.charAt(0).toUpperCase() +
            user.lastName.charAt(0).toUpperCase();

        return (<div>
            {/* top navigation bar */}
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header pull-left">
                        <a
                            className="navbar-brand-link btn btn-default pull-left"
                            onClick={toggleNav}
                        >
                            <i className="fa fa-bars"></i>
                        </a>
                        <Link to="/dashboard" className="navbar-brand">
                            <img alt="logo" src="images/rc-logo-square.png" />
                        </Link>
                    </div>
                    <div id="navbar" className="pull-right">
                        <ul className="nav navbar-nav navbar-right text-right">
                            <li className="dropdown">
                                <Dropdown id="user-management-dropdown">
                                    <Dropdown.Toggle useAnchor>
                                        <span className="user-initials">{initials}</span>
                                        <span className="hidden-xs">{user.firstName} {user.lastName}
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <MenuItem href="/#/dashboard/account">My Profile</MenuItem>
                                        <MenuItem onClick={logoutUser}>Sign out</MenuItem>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                    <a href="#" className="btn btn-danger hidden-xs btn-header">
                        <i className="fa fa-plus" /> Add New App
                    </a> {/* show alert asking to upgrade if
                    users have maximum allowed apps on current plan */}
                </div>
            </nav>
            <StatsSummaryBar
                startDate={moment().subtract(1, 'week')}
                endDate={moment().add(23, 'days')}
                today={moment()}
                views={200}
                viewGoals={450}
                appsUsed={2}
                maxApps={3}
            />
            {/* vertical mobile menu */} {/* hidden until triggered */}
            <nav
                id="sidePanel"
                className={classnames('slideout-menu animated slideInLeft', {
                    hidden: !showNav,
                })}
            >
                <ul className="menu-item-list">
                    <li className="menu-item">
                        <Link to="/dashboard" className="bg-danger"> {/* link to add new app*/}
                            <i className="fa fa-plus" /> Add New App
                        </Link> {/* show alert asking to upgrade if
                        users have maximum allowed apps on current plan */}
                    </li>
                    <li className="menu-item">
                        <Link to="/dashboard"><i className="fa fa-th-large" /> Dashboard</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/dashboard"><i className="fa fa-archive" /> Archive</Link>
                        {/* link to archive*/}
                    </li>
                    <li className="menu-item">
                        <Link to="/dashboard/billing"><i className="fa fa-usd" /> Billing</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/dashboard/account"><i className="fa fa-user" /> Profile</Link>
                    </li>
                    <li className="menu-item">
                        <a href="https://reelcontent.com/apps/faqs.html" target="_blank">
                            <i className="fa fa-question" /> FAQs
                        </a>
                    </li>
                    <li className="menu-item">
                        <button className="btn btn-link" onClick={logoutUser}>
                            <i className="fa fa-power-off" />
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
            {/* vertical mobile menu ends */}
            {/* vertical desktop menu */} {/* visible on >768px */}
            <nav
                id="sidePanelDesktop"
                className={classnames('vertical-menu-bar')}
            >
                <ul className="menu-item-list">
                    <li className="menu-item">
                        <Link to="/dashboard"><i className="fa fa-th-large" />
                            <span className="menu-item-label">Dashboard</span>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/dashboard"><i className="fa fa-archive" />
                            <span className="menu-item-label">Archive</span>
                            {/* link to archive*/}
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/dashboard/billing"><i className="fa fa-usd" />
                            <span className="menu-item-label">Billing</span>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/dashboard/account"><i className="fa fa-user" />
                            <span className="menu-item-label">Profile</span>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <a href="https://reelcontent.com/apps/faqs.html" target="_blank">
                            <i className="fa fa-question" />
                            <span className="menu-item-label">FAQs</span>
                        </a>
                    </li>
                    <li className="menu-item">
                        <button className="btn btn-link" onClick={logoutUser}>
                            <i className="fa fa-power-off" />
                            <span className="menu-item-label">Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
            {/* vertical desktop menu ends */}
            {children}
        </div>);
    }
}

Dashboard.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
    }),
    page: PropTypes.shape({
        showNav: PropTypes.bool.isRequired,
    }).isRequired,

    logoutUser: PropTypes.func.isRequired,
    toggleNav: PropTypes.func.isRequired,
    checkIfPaymentMethodRequired: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const user = state.db.user[state.session.user];

    return {
        user: user || null,
    };
}

export default compose(
    pageify({ path: 'dashboard' }),
    connect(mapStateToProps, dashboardActions)
)(Dashboard);
