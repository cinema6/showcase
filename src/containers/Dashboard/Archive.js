import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CampaignListItem from '../../components/CampaignListItem';
import {
    compact,
    find,
} from 'lodash';
import {
    loadPageData,
    restoreCampaign,
} from '../../actions/archive';

function mapStateToProps(state) {
    const campaignIds = state.session.archive;

    return {
        campaigns: campaignIds && campaignIds.map(id => state.db.campaign[id]),
        campaignAnalytics: campaignIds && compact(campaignIds.map(id => (
            state.analytics.results[id]
        ))),
    };
}

class Archive extends Component {
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
                    <h3>Archived Applications</h3>
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

                                onRestore={() => this.props.restoreCampaign(campaign.id)}
                            />);
                        })}
                    </ul>}
                </div>
            </div>
        </div>);
    }
}

Archive.propTypes = {
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
    restoreCampaign: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
    loadPageData,
    restoreCampaign,
})(Archive);
