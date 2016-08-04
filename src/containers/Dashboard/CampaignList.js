import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CampaignListItem from '../../components/CampaignListItem';
import {
    find,
    compact,
} from 'lodash';
import {
    loadPageData,
} from '../../actions/campaign_list';
import {
    showAlert,
} from '../../actions/alert';
import {
    cancel as cancelCampaign,
} from '../../actions/campaign';
import {
    notify,
} from '../../actions/notification';
import * as NOTIFICATION from '../../enums/notification';

function mapStateToProps(state) {
    const campaignIds = state.session.campaigns;

    return {
        campaigns: campaignIds && campaignIds.map(id => state.db.campaign[id]),
        campaignAnalytics: campaignIds && compact(campaignIds.map(id => (
            state.analytics.results[id]
        ))),
    };
}

class CampaignList extends Component {
    componentDidMount() {
        this.props.loadPageData();
    }

    archive(campaign) {
        this.props.showAlert({
            title: `Archive "${campaign.product.name}"?`,
            description: 'Are you sure you want to archive this app?',
            buttons: [
                {
                    text: 'Keep',
                    onSelect: dismiss => dismiss(),
                },
                {
                    text: 'Archive',
                    type: 'danger',
                    onSelect: dismiss => (
                        this.props.cancelCampaign(campaign.id).then(() => {
                            dismiss();

                            this.props.notify({
                                type: NOTIFICATION.TYPE.SUCCESS,
                                message: `Moved "${campaign.product.name}" to the archive.`,
                            });
                        })
                        .catch(reason => {
                            this.props.notify({
                                type: NOTIFICATION.TYPE.DANGER,
                                message: `Failed to archive: ${reason.response || reason.message}`,
                                time: 10000,
                            });
                        })
                    ),
                },
            ],
        });
    }

    render() {
        const {
            campaigns,
            campaignAnalytics,
        } = this.props;

        return (<div className="row">
            <div className="campaign-dashboard col-md-12">
                <div className="col-md-12 col-sm-12">
                    <h3>Your applications</h3>
                    {campaigns && <ul className="campaign-app-list card-item">
                        {campaigns.map(campaign => {
                            const analytics = find(campaignAnalytics, { campaignId: campaign.id });

                            return (<CampaignListItem
                                key={campaign.id}
                                campaignId={campaign.id}
                                thumbnail={find(campaign.product.images, { type: 'thumbnail' }).uri}
                                name={campaign.product.name}
                                rating={campaign.product.rating}
                                ratingCount={campaign.product.ratingCount}
                                views={analytics && analytics.summary.users}
                                clicks={analytics && analytics.summary.clicks}

                                onArchive={() => this.archive(campaign)}
                            />);
                        })}
                    </ul>}
                </div>
                <div className="promote-app-cta text-center col-md-12 col-sm-12">
                    <h3>Ready to promote another app?</h3>
                    <button className="btn btn-danger btn-lg">Promote my app</button>
                </div>
            </div>
        </div>);
    }
}

CampaignList.propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        product: PropTypes.shape({
            name: PropTypes.string.isRequired,
            images: PropTypes.arrayOf(PropTypes.shape({
                type: PropTypes.string.isRequired,
                uri: PropTypes.string.isRequired,
            }).isRequired).isRequired,
            rating: PropTypes.number,
            ratingCount: PropTypes.number,
        }).isRequired,
    }).isRequired),
    campaignAnalytics: PropTypes.arrayOf(PropTypes.shape({
        summary: PropTypes.shape({
            users: PropTypes.number.isRequired,
            clicks: PropTypes.number.isRequired,
        }).isRequired,
    }).isRequired),

    loadPageData: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    cancelCampaign: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
    loadPageData,
    showAlert,
    cancelCampaign,
    notify,
})(CampaignList);
