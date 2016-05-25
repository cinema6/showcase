'use strict';

import { Component } from 'react';
import React, { PropTypes } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { get, find } from 'lodash';
import {
    loadPageData,
    updateChartSelection,
    removeCampaign,
    showInstallTrackingInstructions,
    showAdPreview
} from '../../actions/campaign_detail';
import {
    notify
} from '../../actions/notification';
import CampaignDetailBar from '../../components/CampaignDetailBar';
import CampaignDetailTable from '../../components/CampaignDetailTable';
import CampaignDetailChart, {
   CHART_TODAY,
   CHART_7DAY,
   CHART_30DAY,

   SERIES_USERS,
   SERIES_VIEWS,
   SERIES_CLICKS,
   SERIES_INSTALLS
} from '../../components/CampaignDetailChart';
import InstallTrackingSetupModal from '../../components/InstallTrackingSetupModal';
import AdPreviewModal from '../../components/AdPreviewModal';
import { TYPE as NOTIFICATION } from '../../enums/notification';

class CampaignDetail extends Component {
    componentWillMount() {
        return this.props.loadPageData(this.props.params.campaignId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.campaignId !== this.props.params.campaignId) {
            return this.props.loadPageData(nextProps.params.campaignId);
        }
    }

    render() {
        const {
            page,
            analyticsError,
            analytics = { summary : {} },
            campaign  = {},

            updateChartSelection,
            removeCampaign,
            showInstallTrackingInstructions,
            notify,
            showAdPreview
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
                        <div className="col-md-5">
                            <Nav bsStyle="pills" className="nav-justified"
                                activeKey={page.activeSeries} onSelect={selectSeries}>
                                <NavItem eventKey={SERIES_VIEWS}> Views </NavItem>
                                <NavItem eventKey={SERIES_USERS}> Reach </NavItem>
                                <NavItem eventKey={SERIES_CLICKS}> Clicks </NavItem>
                                <NavItem eventKey={SERIES_INSTALLS}> Installs </NavItem>
                            </Nav>
                        </div>
                        <div className="col-md-5 col-md-offset-2">
                            <Nav bsStyle="pills" className="nav-justified"
                                activeKey={page.activeChart} onSelect={selectChart}>
                                <NavItem eventKey={CHART_TODAY}> Today </NavItem>
                                <NavItem eventKey={CHART_7DAY}> Past 7 Days </NavItem>
                                <NavItem eventKey={CHART_30DAY}> Past 30 Days </NavItem>
                            </Nav>
                        </div>
                    </div>
                    <div className="row">
                        <CampaignDetailChart data={analytics || {}}
                            chart={page.activeChart} series={page.activeSeries} />
                    </div>
                    <div className="row">
                        <CampaignDetailTable data={analytics || {}}
                            chart={page.activeChart} series={page.activeSeries} />
                    </div>
                </div>
            );
        }

        return (
            <div className="container main-section campaign-stats">
                <CampaignDetailBar
                    campaignId={campaign.id}
                    title={campaign.name}
                    logoUrl={logoUrl}
                    users={get(analytics,'summary.users')}
                    views={get(analytics,'summary.views')}
                    clicks={get(analytics,'summary.clicks')}
                    installs={get(analytics,'summary.installs')}
                    onDeleteCampaign={() => removeCampaign(campaign.id)}
                    onShowInstallTrackingInstructions={() => showInstallTrackingInstructions(true)}
                    onShowAdPreview={() => showAdPreview(true)}
                />
                {inner}
                {campaign.id && (<InstallTrackingSetupModal
                    show={page.showInstallTrackingInstructions}
                    campaignId={campaign.id}
                    onClose={() => showInstallTrackingInstructions(false)}
                    onCopyCampaignIdSuccess={() => notify({
                        type: NOTIFICATION.SUCCESS,
                        message: 'Copied to clipboard!'
                    })}
                    onCopyCampaignIdError={() => notify({
                        type: NOTIFICATION.WARNING,
                        message: 'Unable to copy.'
                    })}
                />)}
                <AdPreviewModal show={page.showAdPreview}
                    campaign={campaign}
                    onClose={() => showAdPreview(false)} />
            </div>
        );
    }
}

CampaignDetail.propTypes = {
    page: PropTypes.shape({
        loading                         : PropTypes.bool.isRequired,
        activeChart                     : PropTypes.number.isRequired,
        activeSeries                    : PropTypes.number.isRequired,
        showInstallTrackingInstructions : PropTypes.bool.isRequired,
        showAdPreview                   : PropTypes.bool.isRequired
    }).isRequired,
    params: PropTypes.shape({
        campaignId      : PropTypes.string.isRequired
    }).isRequired,
    campaign   : PropTypes.object,
    analytics  : PropTypes.object,
    analyticsError: PropTypes.object,

    loadPageData: PropTypes.func.isRequired,
    updateChartSelection: PropTypes.func.isRequired,
    removeCampaign: PropTypes.func.isRequired,
    showInstallTrackingInstructions: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    showAdPreview: PropTypes.func.isRequired
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
        updateChartSelection,
        removeCampaign,
        showInstallTrackingInstructions,
        notify,
        showAdPreview
    })
)(CampaignDetail);
