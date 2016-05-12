'use strict';

import { Component } from 'react';
import React, { PropTypes } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { get, find } from 'lodash';
import { loadPageData, updateChartSelection } from '../../actions/campaign_detail';
import CampaignDetailBar from '../../components/CampaignDetailBar';
import CampaignDetailChartIntraday, {
           CHART_TODAY,
           CHART_7DAY,
           CHART_30DAY,
           
           SERIES_USERS,
           SERIES_VIEWS,
           SERIES_CLICKS,
           SERIES_INSTALLS
       } from '../../components/CampaignDetailChartIntraday';

class CampaignDetail extends Component {
    componentWillMount() {
        return this.props.loadPageData(this.props.params.campaignId);
    }

    render() {
        const {
            page,
            analyticsError,
            analytics = { summary : {} },
            campaign  = {},
            updateChartSelection
        } = this.props;
        
        let inner, logoUrl;
        let selectChart = (key) => updateChartSelection(key,page.activeSeries);
        let selectSeries = (key) => updateChartSelection(page.activeChart,key);

        if (campaign && campaign.product) {
            logoUrl = (find(campaign.product.images, (img) => {
                return img.type === 'thumbnail';
            }) || {}).uri;
        }
            
        if (page.loading) {
            inner = <span> Loading... </span>;
        }
        else 
        if (analyticsError) {
            inner = (
                <div className="row">
                    <span> { analyticsError.message } </span>
                </div>
            );
        }
        else {
            inner = (
                <div>
                    <div className="row">
                        <div className="pull-left">
                            <Nav bsStyle="pills" 
                                activeKey={page.activeSeries} onSelect={selectSeries}>
                                <NavItem eventKey={SERIES_USERS}> Users </NavItem>
                                <NavItem eventKey={SERIES_VIEWS}> Views </NavItem>
                                <NavItem eventKey={SERIES_CLICKS}> Clicks </NavItem>
                                <NavItem eventKey={SERIES_INSTALLS}> Installs </NavItem>
                            </Nav>
                        </div>
                        <div className="pull-right">
                            <Nav bsStyle="pills" 
                                activeKey={page.activeChart} onSelect={selectChart}>
                                <NavItem eventKey={CHART_TODAY}> Today </NavItem>
                                <NavItem eventKey={CHART_7DAY}> Past 7 Days </NavItem>
                                <NavItem eventKey={CHART_30DAY}> Past 30 Days </NavItem>
                            </Nav>
                        </div>
                    </div>
                    <div className="row">
                        <CampaignDetailChartIntraday data={analytics || {}} 
                            chart={page.activeChart} series={page.activeSeries} />
                    </div>
                </div>
            );
        }
        
        return (
            <div className="container main-section campaign-stats">
                <CampaignDetailBar 
                    campaignId={page.campaignId} 
                    title={campaign.name}
                    logoUrl={logoUrl}
                    views={get(analytics,'summary.views')} 
                    clicks={get(analytics,'summary.clicks')} 
                    installs={get(analytics,'summary.installs')} 
                />
                {inner}
            </div>
        );
    }
}

CampaignDetail.propTypes = {
    page: PropTypes.shape({
        loading         : PropTypes.bool.isRequired,
        activeChart     : PropTypes.number.isRequred,
        activeSeries    : PropTypes.number.isRequred
    }).isRequired,
    params: PropTypes.shape({
        campaignId      : PropTypes.string.isRequired
    }).isRequired,
    campaign   : PropTypes.object,
    analytics  : PropTypes.object,
    analyticsError: PropTypes.object,
    loadPageData: PropTypes.func.isRequired,
    updateChartSelection: PropTypes.func.isRequired
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
        loadPageData,
        updateChartSelection
    })
)(CampaignDetail);
