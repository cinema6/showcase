'use strict';

import React, { Component, PropTypes } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

export default class CampaignDetailBar extends Component {
    render() {
        const {
            campaignId,
            logoUrl,
            title,
            views,
            clicks,
            installs
        } = this.props;

        return (
            <div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                            <td>{title}</td>
                            <td>{views}</td>
                            <td>{clicks}</td>
                            <td>{installs}</td>
                            <td>
                                <Dropdown id="campaign-detail-dropdown">
                                    <Dropdown.Toggle useAnchor={true}>
                                        Toggle Me
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu">
                                        <MenuItem> Edit Campaign </MenuItem>
                                        <MenuItem> Delete Campaign </MenuItem>
                                        <MenuItem> Tracking Pixel </MenuItem>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

CampaignDetailBar.propTypes = {
    campaignId: PropTypes.string,
    logoUrl:    PropTypes.string,
    title:      PropTypes.string,
    views:      PropTypes.number,
    clicks:     PropTypes.number,
    installs:   PropTypes.number
};

