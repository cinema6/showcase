import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

export function Account({
    children,
}) {
    return (<div className="container main-section campaign-stats" style={{ marginTop: 100 }}>
        <DocumentTitle title="Reelcontent Apps: Profile" />
        <div className="row">
            <div className="page-header">
                <h1>Account Settings</h1>
            </div>
            <div className="col-md-3">
                <br />
                <ul className="nav nav-pills nav-stacked">
                    <li role="presentation">
                        <Link to="/dashboard/account/profile" activeClassName="active">
                            My Profile
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link to="/dashboard/account/email" activeClassName="active">
                            Edit Email/Username
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link to="/dashboard/account/password" activeClassName="active">
                            Change Password
                        </Link>
                    </li>
                </ul>
            </div>
            {children}
        </div>
        <br />
    </div>/* /.container */);
}

Account.propTypes = {
    children: PropTypes.node.isRequired,
};

export default connect()(Account);
