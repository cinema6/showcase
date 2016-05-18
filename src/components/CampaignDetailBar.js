'use strict';

import React, { Component, PropTypes } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import numeral from 'numeral';

export default class CampaignDetailBar extends Component {
    render() {
        const {
            campaignId,
            logoUrl,
            title,
            views,
            clicks,
            installs,

            onDeleteCampaign,
            onShowInstallTrackingInstructions
        } = this.props;

        let format = (n) => numeral(n).format('0,0');

        return (
            <div className="row">
                <div className="container">
                  <div className="campaign-overview col-md-12 col-sm-12 card-item">
                    <div className="row">
                      <div className="campaign-app col-md-6">
                        <div className="advertiser-logo">
                          <img src={ logoUrl || 'http://placehold.it/512x512'} />
                        </div>
                        <div className="campaign-title">
                          <h2>{title}</h2>
                        </div>
                      </div>
                      <div className="campaign-mini-stats col-md-6">
                        <div className="campaign-reach data-inline col-md-4">
                          <p>Reach</p>
                          <h3>{format(views)}</h3>
                        </div>
                        <div className="campaign-clicks data-inline col-md-3">
                          <p>Clicks</p>
                          <h3>{format(clicks)}</h3>
                        </div>
                        <div className="campaign-installs data-inline col-md-3">
                          <p>Installs</p>
                          <h3>{format(installs)}</h3>
                        </div>
                        <div className="pull-right campaign-menu col-md-1">
                          <Dropdown id={'campaign-detail-dropdown-' + campaignId} pullRight >
                              <Dropdown.Toggle useAnchor={true} noCaret>
                                <i className="fa fa-ellipsis-v" aria-hidden="true"> </i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="dropdown-menu" >
                                  <MenuItem href={`/#/dashboard/campaigns/${campaignId}/edit`} >
                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    Edit Campaign
                                  </MenuItem>
                                  <MenuItem divider />
                                  <MenuItem onSelect={() => onDeleteCampaign()}>
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    Delete Campaign
                                  </MenuItem>
                                  <MenuItem divider />
                                  <MenuItem onSelect={() => onShowInstallTrackingInstructions()}>
                                    <i className="fa fa-mouse-pointer" aria-hidden="true"></i>
                                    Tracking Pixel
                                  </MenuItem>
                              </Dropdown.Menu>
                          </Dropdown> 
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
    campaignId:                         PropTypes.string,
    logoUrl:                            PropTypes.string,
    title:                              PropTypes.string,
    views:                              PropTypes.number,
    clicks:                             PropTypes.number,
    installs:                           PropTypes.number,

    onDeleteCampaign:                   PropTypes.func.isRequired,
    onShowInstallTrackingInstructions:  PropTypes.func.isRequired
};

