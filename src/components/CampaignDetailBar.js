'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import numeral from 'numeral';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class CampaignDetailBar extends Component {
    render() {
        const {
            campaignId,
            logoUrl,
            title,
            users,
            clicks,
            installs,

            onDeleteCampaign,
//            onShowInstallTrackingInstructions,
            onShowAdPreview
        } = this.props;

        let format = (n) => n === 0 ? '-' : numeral(n).format('0,0');

        return (<div className="row">
            <div className="container">
                <div className="campaign-overview">
                    <div className="row">
                        <div className="campaign-app col-md-8 col-sm-12 col-xs-12">
                            <div className="advertiser-logo">
                                <img src={ logoUrl || 'http://placehold.it/512x512'} />
                            </div>
                            <div className="campaign-title">
                                <h2>{title}</h2>
                                <div className="clearfix"> </div>
                            </div>                            
                        </div>
                        <div className="campaign-actions col-md-4 col-sm-12 col-xs-12">
                            <span className="campaign-preview-link">
                                <a href="#" className="btn btn-primary btn-sm"
                                    onClick={event => {
                                        event.preventDefault();
                                        onShowAdPreview();
                                    }}>
                                    <i className="fa fa-external-link"></i> Preview Your Ad
                                </a>
                            </span>
                            <span className="edit-campaign-link">
                                <Link to={`/dashboard/campaigns/${campaignId}/edit`}
                                    className="btn btn-primary btn-sm">
                                    <i className="fa fa-pencil-square-o"></i> Edit
                                </Link>
                            </span>
                            <span className="trash-campaign-link">
                                <a href="#" className="btn btn-danger btn-sm"
                                    onClick={event => {
                                        event.preventDefault();
                                        onDeleteCampaign(); 
                                    }}>
                                    <i className="fa fa-exchange"></i> Replace
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="campaign-mini-stats">
                    <div className="row">
                        <div className="col-sm-4 col-xs-12 text-center">
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip>
                                    Your ad was viewed by these people(Unique Views)
                                </Tooltip>}>
                                <div className="campaign-reach data-inline">
                                    <p>Views</p>                                
                                    <h1>{format(users)}</h1>
                                </div>
                            </OverlayTrigger>
                        </div>
                        <div className="col-sm-4 col-xs-12 text-center">
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip>
                                    This is the count of your ad clicks.
                                </Tooltip>}>
                                <div className="campaign-clicks data-inline">
                                    <p>Clicks</p>
                                    <h1>{format(clicks)}</h1>
                                </div>
                            </OverlayTrigger>
                        </div>
                        <div className="col-sm-4 col-xs-12 text-center">
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip>
                                    This is how many times your app was installed. Note: You need a
                                    tracking pixel to see the stats for instals.
                                </Tooltip>}>
                                <div className="campaign-installs data-inline">
                                    <p>Installs</p>
                                    <h1>{format(installs)}</h1>
                                </div>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
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
    onShowInstallTrackingInstructions:  PropTypes.func.isRequired,
    onShowAdPreview:                    PropTypes.func.isRequired
};

