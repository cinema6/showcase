import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CampaignListItem from '../../components/CampaignListItem';
import {
    find,
    compact,
} from 'lodash';
import {
    loadPageData,
    archiveCampaign,
} from '../../actions/campaign_list';

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
                        {campaigns.length > 0 ? campaigns.map(campaign => {
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

                                onArchive={() => this.props.archiveCampaign(campaign)}
                            />);
                        }) : <li>You have no apps.</li>}
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
    archiveCampaign: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
    loadPageData,
    archiveCampaign,
})(CampaignList);
