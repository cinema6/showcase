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
        let inner, logoUrl;
        const {
            page    : { loading },
            params  : { campaignId },
            analytics,
            analyticsError,
            campaign
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
                    return img.type === 'thumbnail';
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
    params: PropTypes.shape({
        campaignId      : PropTypes.string.isRequired
    }).isRequired,
    campaign   : PropTypes.object,
    analytics  : PropTypes.object,
    analyticsError: PropTypes.object,
    loadPageData: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
    return {
        campaign        :  state.db.campaign[props.params.campaignId],
        analytics       :  state.analytics.results[props.params.campaignId],
        analyticsError  : state.analytics.lastError
    };
}

export default compose(
    pageify({ path: 'dashboard.campaign_detail' }),
    connect(mapStateToProps, {
        loadPageData
    })
)(CampaignDetail);
