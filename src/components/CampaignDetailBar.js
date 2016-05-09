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
            <div className="container main-section campaign-stats">
              <div className="row">
                <div className="campaign-overview col-md-12 col-sm-12 card-item">
                  <div className="row">
                    <div className="campaign-app col-md-6">
                      <div className="advertiser-logo">
                        <img src="http://placehold.it/512x512" />
                      </div>
                      <div className="campaign-title">
                        <h2>{title}</h2>
                      </div>
                    </div>
                    <div className="campaign-mini-stats col-md-6">
                      <div className="campaign-reach data-inline col-md-4">
                        <p>Reach</p>
                        <h3>{views}</h3>
                      </div>
                      <div className="campaign-clicks data-inline col-md-3">
                        <p>Clicks</p>
                        <h3>{clicks}</h3>
                      </div>
                      <div className="campaign-installs data-inline col-md-3">
                        <p>Installs</p>
                        <h3>{installs}</h3>
                      </div>
                      <div className="pull-right campaign-menu col-md-1">
                        <div className="btn-group">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

