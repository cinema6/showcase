import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import _, { get, find } from 'lodash';
import { notify } from '../../actions/notification';
import {
    loadPageData,
    showInstallTrackingInstructions,
    updateChartSelection,
} from '../../actions/campaign_detail';
import InstallTrackingSetupModal from '../../components/InstallTrackingSetupModal';
import { TYPE as NOTIFICATION } from '../../enums/notification';
import DocumentTitle from 'react-document-title';
import CampaignDetailInfo from '../../components/CampaignDetailInfo';
import CampaignDetailStatsOverview from '../../components/CampaignDetailStatsOverview';
import moment from 'moment';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import { productDataFromCampaign } from '../../utils/campaign';
import AdPreview from '../../components/AdPreview';
import CampaignDetailStatsDetails, {
    CHART_7DAY,
    CHART_30DAY,
} from '../../components/CampaignDetailStatsDetails';
import { Link } from 'react-router';
import {
    archiveCampaign,
} from '../../actions/campaign_list';
import {
    restoreCampaign,
} from '../../actions/archive';
import {
    LiveResource,
} from 'rc-live-resource';
import {
    GET,
} from '../../utils/db';
import {
    GET_CAMPAIGN_ANALYTICS_SUCCESS,
} from '../../actions/analytics';
import { createAction } from 'redux-actions';

const CARD_OPTIONS = {
    cardType: 'showcase-app',
    advanceInterval: 3,
};
const PLACEMENT_OPTIONS = {
    type: 'mobile-card',
    branding: 'showcase-app--interstitial',
};

class CampaignDetail extends Component {
    constructor(props) {
        super(props);

        this.handleCampaignChange = this.handleCampaignChange.bind(this);
        this.handleAnalyticsChange = this.handleAnalyticsChange.bind(this);
    }

    componentWillMount() {
        return this.props.loadPageData(this.props.params.campaignId);
    }

    componentDidMount() {
        this.initLiveResources();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.campaignId !== this.props.params.campaignId) {
            this.props.loadPageData(nextProps.params.campaignId);
            this.initLiveResources(nextProps);
        }
    }

    componentWillUnmount() {
        this.campaign.removeListener('change', this.handleCampaignChange);
        this.campaign = null;

        this.analytics.removeListener('change', this.handleAnalyticsChange);
        this.analytics = null;
    }

    initLiveResources(props = this.props) {
        if (this.campaign) {
            this.campaign.removeListener('change', this.handleCampaignChange);
        }

        if (this.analytics) {
            this.analytics.removeListener('change', this.handleAnalyticsChange);
        }

        this.campaign = new LiveResource({
            endpoint: `/api/campaigns/${props.params.campaignId}`,
            pollInterval: 5000,
        });
        this.campaign.on('change', this.handleCampaignChange);

        this.analytics = new LiveResource({
            endpoint: `/api/analytics/campaigns/showcase/apps/${props.params.campaignId}`,
            pollInterval: 5000,
        });
        this.analytics.on('change', this.handleAnalyticsChange);
    }

    handleCampaignChange(campaign) {
        this.props.refreshCampaign(campaign);
    }

    handleAnalyticsChange(analytics) {
        this.props.refreshAnalytics(analytics);
    }

    render() {
        const {
            page,
            campaign,
            analytics,
            billingPeriod,
        } = this.props;
        const billingPeriodStart = billingPeriod && moment(billingPeriod.cycleStart);
        const billingPeriodEnd = billingPeriod && moment(billingPeriod.cycleEnd);
        const isActive = campaign && (campaign.status !== 'canceled');

        return (<div className="campaign-stats">
            {campaign && <DocumentTitle title={`Reelcontent Apps: ${campaign.name}`} />}
            {campaign && <ol className="breadcrumb hidden-xs">
                <li>{(() => {
                    if (!isActive) {
                        return <Link to="/dashboard/archive">Back to Archive</Link>;
                    }

                    return <Link to="/dashboard/campaigns">Back to Dashboard</Link>;
                })()}</li>
                <li className="active">{campaign.product.name}</li>
            </ol>}

            <div className="container main-section">
                <div className="row">
                    {campaign && <CampaignDetailInfo
                        campaignId={campaign.id}
                        title={get(campaign, 'product.name')}
                        logo={find(get(campaign, 'product.images'), { type: 'thumbnail' }).uri}
                        company={get(campaign, 'product.developer')}
                        rating={get(campaign, 'product.rating')}
                        ratingCount={get(campaign, 'product.ratingCount')}
                        onArchive={((isActive === true) || null) && (() => (
                            this.props.archiveCampaign(campaign)
                        ))}
                        onRestore={((isActive === false) || null) && (() => (
                            this.props.restoreCampaign(
                                campaign.id,
                                `/dashboard/campaigns/${campaign.id}`
                            )
                        ))}
                    />}
                    <div className="stats-overview-wrapper right-col col-md-8 col-sm-12 col-xs-12">
                        <p className="text-center track-installs">
                            Want to track your installs? <a
                                href="#"
                                onClick={event => {
                                    event.preventDefault();
                                    this.props.showInstallTrackingInstructions(true);
                                }}
                            >Setup</a>
                        </p>
                        <CampaignDetailStatsOverview
                            analytics={analytics && {
                                today: {
                                    users: _(analytics.today).map('users').sum(),
                                    clicks: _(analytics.today).map('clicks').sum(),
                                    installs: _(analytics.today).map('installs').sum(),
                                },
                                lifetime: {
                                    users: analytics.summary.users,
                                    clicks: analytics.summary.clicks,
                                    installs: analytics.summary.installs,
                                },
                                billingPeriod: {
                                    users: analytics.cycle.users,
                                },
                            }}
                            billingPeriod={(billingPeriod || undefined) && {
                                start: billingPeriodStart,
                                end: billingPeriodEnd,
                                targetViews: get(campaign, 'targetUsers', 0),
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="campaign-app-preview col-md-4">
                        <div className="campaign-preview-wrap text-center">
                            <AdPreview
                                productData={productDataFromCampaign(campaign)}
                                cardOptions={CARD_OPTIONS}
                                placementOptions={PLACEMENT_OPTIONS}
                                factory={createInterstitialFactory}
                            />
                        </div>
                    </div>
                    <CampaignDetailStatsDetails
                        range={page.activeSeries}
                        items={(series => {
                            switch (series) {
                            case CHART_7DAY:
                                return get(analytics, 'daily_7');
                            case CHART_30DAY:
                                return get(analytics, 'daily_30');
                            default:
                                return undefined;
                            }
                        })(page.activeSeries)}
                        onChangeView={view => this.props.updateChartSelection(view)}
                    />
                </div>
            </div>
            {campaign && (<InstallTrackingSetupModal
                show={page.showInstallTrackingInstructions}
                campaignId={campaign.id}
                onClose={() => this.props.showInstallTrackingInstructions(false)}
                onCopyCampaignIdSuccess={() => this.props.notify({
                    type: NOTIFICATION.SUCCESS,
                    message: 'Copied to clipboard!',
                })}
                onCopyCampaignIdError={() => this.props.notify({
                    type: NOTIFICATION.WARNING,
                    message: 'Unable to copy.',
                })}
            />)}
        </div>);
    }
}

CampaignDetail.propTypes = {
    page: PropTypes.shape({
        showInstallTrackingInstructions: PropTypes.bool.isRequired,
        activeSeries: PropTypes.oneOf([CHART_7DAY, CHART_30DAY]).isRequired,
    }).isRequired,
    params: PropTypes.shape({
        campaignId: PropTypes.string.isRequired,
    }).isRequired,
    campaign: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        product: PropTypes.shape({
            name: PropTypes.string.isRequired,
            images: PropTypes.arrayOf(PropTypes.shape({
                type: PropTypes.string.isRequired,
                uri: PropTypes.string.isRequired,
            }).isRequired).isRequired,
            developer: PropTypes.string.isRequired,
            price: PropTypes.string.isRequired,
            rating: PropTypes.number,
            ratingCount: PropTypes.number,
        }).isRequired,
    }),
    analytics: PropTypes.shape({
        today: PropTypes.arrayOf(PropTypes.shape({
            users: PropTypes.number.isRequired,
            clicks: PropTypes.number.isRequired,
            installs: PropTypes.number.isRequired,
        }).isRequired).isRequired,
        summary: PropTypes.shape({
            users: PropTypes.number.isRequired,
            clicks: PropTypes.number.isRequired,
            installs: PropTypes.number.isRequired,
        }).isRequired,
        cycle: PropTypes.shape({
            users: PropTypes.number.isRequired,
        }).isRequired,
    }),
    billingPeriod: PropTypes.shape({
        cycleStart: PropTypes.string.isRequired,
        cycleEnd: PropTypes.string.isRequired,
    }),

    loadPageData: PropTypes.func.isRequired,
    archiveCampaign: PropTypes.func.isRequired,
    restoreCampaign: PropTypes.func.isRequired,
    showInstallTrackingInstructions: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    updateChartSelection: PropTypes.func.isRequired,
    refreshCampaign: PropTypes.func.isRequired,
    refreshAnalytics: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return {
        campaign: state.db.campaign[props.params.campaignId],
        analytics: state.analytics.results[props.params.campaignId],
        billingPeriod: state.session.billingPeriod,
    };
}

export default compose(
    pageify({ path: 'dashboard.campaign_detail' }),
    connect(mapStateToProps, {
        loadPageData,
        archiveCampaign,
        showInstallTrackingInstructions,
        notify,
        updateChartSelection,
        restoreCampaign,
        refreshCampaign: createAction(GET.SUCCESS, null, campaign => ({
            type: 'campaign',
            id: campaign.id,
            key: 'id',
        })),
        refreshAnalytics: createAction(GET_CAMPAIGN_ANALYTICS_SUCCESS),
    })
)(CampaignDetail);
