'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import numeral from 'numeral';

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
                <div className="campaign-overview col-md-12 col-sm-12">
                    <div className="row">
                        <div className="campaign-app col-xs-10">
                            <div className="advertiser-logo">
                                <img src={ logoUrl || 'http://placehold.it/512x512'} />
                            </div>
                            <div className="campaign-title">
                                <h2>{title}</h2>
                                <div className="clearfix"> </div>
                                <span className="campaign-preview-link">
                                    <a href="#" className="btn btn-default btn-xs"
                                        onClick={event => {
                                            event.preventDefault();
                                            onShowAdPreview();
                                        }}>
                                        <i className="fa fa-external-link"></i> Preview Your Ad
                                    </a>
                                </span>
                                <span className="edit-campaign-link">
                                    <Link to={`/dashboard/campaigns/${campaignId}/edit`}
                                        className="btn btn-default btn-xs">
                                        <i className="fa fa-pencil-square-o"></i> Edit
                                    </Link>
                                </span>
                                <span className="trash-campaign-link">
                                    <a href="#" className="btn btn-default btn-xs"
                                        onClick={event => {
                                            event.preventDefault();
                                            onDeleteCampaign(); 
                                        }}>
                                        <i className="fa fa-trash-o"></i> Replace
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="campaign-mini-stats">
                    <div className="row">
                        <div className="col-sm-3 col-xs-6 text-center">
                            <div className="campaign-reach data-inline">
                                <p>Views</p>
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

