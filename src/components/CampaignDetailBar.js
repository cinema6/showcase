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
            users,
            views,
            clicks,
            installs,

            onDeleteCampaign,
            onShowInstallTrackingInstructions
        } = this.props;

        let format = (n) => n === 0 ? '-' : numeral(n).format('0,0');

        return (
            <div className="row">
                <div className="container">
                  <div className="campaign-overview col-md-12 col-sm-12 card-item">
                    <div className="row">
                      <div className="campaign-app col-xs-10">
                        <div className="advertiser-logo">
                          <img src={ logoUrl || 'http://placehold.it/512x512'} />
                        </div>
                        <div className="campaign-title">
                          <h2>{title}</h2>
                          <span className="campaign-preview-link">
                          {/*open preview in a modal*/}
                            <a href="#">Preview Your Ad</a>
                          </span>
                        </div>
                      </div>
                      <div className="pull-right campaign-menu col-xs-2 text-right">
                          <Dropdown id={'campaign-detail-dropdown-' + campaignId} pullRight >
                              <Dropdown.Toggle useAnchor={true} noCaret className="btn btn-link 
                                btn-lg">
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
                  <div className="clearfix"></div>
                  <div className="campaign-mini-stats">
                    <div className="row">
                        <div className="col-sm-3 col-xs-6 text-center">
                            <div className="campaign-views data-inline">
                              <p>Views</p>
                              <h1>{format(views)}</h1>
                            </div>
                        </div>
                        <div className="col-sm-3 col-xs-6 text-center">
                          <div className="campaign-reach data-inline">
                              <p>Reach</p>
                              <h1>{format(users)}</h1>
                            </div>
                        </div>
                        <div className="col-sm-3 col-xs-6 text-center">
                          <div className="campaign-clicks data-inline">
                              <p>Clicks</p>
                              <h1>{format(clicks)}</h1>
                          </div>
                        </div>
                        <div className="col-sm-3 col-xs-6 text-center">
                          <div className="campaign-installs data-inline">
                              <p>Installs</p>
                              <h1>{format(installs)}</h1>
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
    users:                              PropTypes.number,
    views:                              PropTypes.number,
    clicks:                             PropTypes.number,
    installs:                           PropTypes.number,

    onDeleteCampaign:                   PropTypes.func.isRequired,
    onShowInstallTrackingInstructions:  PropTypes.func.isRequired
};

