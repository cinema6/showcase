'use strict';

import React, { Component, PropTypes } from 'react';

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
            <table>
                <tbody>
                    <tr>
                    <td>{title}</td>
                    <td>{views}</td>
                    <td>{clicks}</td>
                    <td>{installs}</td>
                    </tr>
                </tbody>
            </table>
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

