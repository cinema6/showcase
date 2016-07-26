import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import _, { assign, get, find } from 'lodash';
import * as campaignDetailActions from '../../actions/campaign_detail';
import * as notificationActions from '../../actions/notification';
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

const CARD_OPTIONS = {
    cardType: 'showcase-app',
    advanceInterval: 3,
};
const PLACEMENT_OPTIONS = {
    type: 'mobile-card',
    branding: 'showcase-app--interstitial',
};

class CampaignDetail extends Component {
    componentWillMount() {
        return this.props.loadPageData(this.props.params.campaignId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.campaignId !== this.props.params.campaignId) {
            this.props.loadPageData(nextProps.params.campaignId);
        }
    }

    render() {
        const {
            page,
            campaign,
            analytics,
            billingPeriod,

            showInstallTrackingInstructions,
            notify,
            removeCampaign,
            updateChartSelection,
        } = this.props;
        const billingPeriodStart = billingPeriod && moment(billingPeriod.cycleStart);
        const billingPeriodEnd = billingPeriod && moment(billingPeriod.cycleEnd);

        return (<div>
            {campaign && <DocumentTitle title={`Reelcontent Apps: ${campaign.name}`} />}
            <ol className="breadcrumb hidden-xs">
                <li><a href="#">Back to Dashboard</a></li> {/* Add link to dashboard*/}
                <li className="active">Letgo: Buy &amp; Sell stuff online now using this
                awesome app</li>{/* show the selected campaign name/app title*/}
            </ol>
            <div className="container main-section campaign-stats">

                <div className="row">
                    {campaign && <CampaignDetailInfo
                        campaignId={campaign.id}
                        title={get(campaign, 'product.name')}
                        logo={find(get(campaign, 'product.images'), { type: 'thumbnail' }).uri}
                        company={get(campaign, 'product.developer')}
                        rating={get(campaign, 'product.rating')}
                        ratingCount={get(campaign, 'product.ratingCount')}
                        onReplace={() => removeCampaign(campaign.id)}
                    />}
                    <div className="stats-overview-wrapper right-col col-md-8 col-sm-12 col-xs-12">
                        <p className="text-center track-installs">
                            Want to track your installs? <a
                                href="#"
                                onClick={event => {
                                    event.preventDefault();
                                    showInstallTrackingInstructions(true);
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
                        onChangeView={view => updateChartSelection(view)}
                    />
                </div>
            </div>
            {campaign && (<InstallTrackingSetupModal
                show={page.showInstallTrackingInstructions}
                campaignId={campaign.id}
                onClose={() => showInstallTrackingInstructions(false)}
                onCopyCampaignIdSuccess={() => notify({
                    type: NOTIFICATION.SUCCESS,
                    message: 'Copied to clipboard!',
                })}
                onCopyCampaignIdError={() => notify({
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
    removeCampaign: PropTypes.func.isRequired,
    showInstallTrackingInstructions: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    updateChartSelection: PropTypes.func.isRequired,
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
    connect(mapStateToProps, assign({}, campaignDetailActions, notificationActions))
)(CampaignDetail);
