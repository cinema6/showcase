'use strict';

import { Component } from 'react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { get, find } from 'lodash';
import { loadPageData } from '../../actions/campaign_detail';
import CampaignDetailBar from '../../components/CampaignDetailBar';

class CampaignDetail extends Component {
    componentWillMount() {
        return this.props.loadPageData(this.props.params.campaignId);
    }

    render() {
        let inner, thumbNail, logoUrl;
        const {
            page : { loading },
            params      : { campaignId },
            analytics : { results : { [campaignId] : analytics = {} } },
            analytics : { lastError : analyticsError },
            campaigns   : { [campaignId ] :  campaign = {} }
        } = this.props;
        
        if (loading) {
            inner = <span> Loading... </span>;
        }
        else 
        if (analyticsError) {
            inner = <span> { analyticsError.message } </span>;
        }
        else {
            if (campaign && campaign.product) {
                logoUrl = (find(campaign.product.images, (img) => {
                    return img.type === 'thumbnail'
                }) || {}).uri;
            }
            inner = (
                    <CampaignDetailBar 
                        campaignId={campaignId} 
                        title={campaign.name}
                        logoUrl={logoUrl}
                        views={get(analytics,'summary.views')} 
                        clicks={get(analytics,'summary.clicks')} 
                        installs={get(analytics,'summary.installs')} 
                    />
            );
        }
        
        return (
            <div className="container main-section campaign-stats">
                {inner}
            </div>
        );
    }
}

CampaignDetail.propTypes = {
    page: PropTypes.shape({
        loading         : PropTypes.bool.isRequired
    }).isRequired,
    campaigns  : PropTypes.object.isRequired,
    analytics  : PropTypes.object.isRequired,

    loadPageData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        analytics :  state.analytics,
        campaigns :  state.db.campaign
    };
}

export default compose(
    pageify({ path: 'dashboard.campaign_detail' }),
    connect(mapStateToProps, {
        loadPageData
    })
)(CampaignDetail);
