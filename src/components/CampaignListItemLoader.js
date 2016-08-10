import React, { PropTypes } from 'react';
import StarRating from './StarRating';

export default function CampaignListItemLoader({
    showArchive,
    showRestore,
}) {
    return (<li className="campaign-list-item-wrapper">
        <div className="campaign-list-item item-preloader">
            <div className="app-icon-wrapper col-md-1 col-sm-2 col-xs-12 text-center">
                <img src="https://placeholdit.imgix.net/~text?w=512&h=512" role="presentation" />
            </div>
            <div className="app-info-wrapper col-md-4 col-sm-8 col-xs-12">
                <h3 className="app-title">My Awesome App</h3>
                <StarRating rating={3.5} ratingCount={8542} />
            </div>
            <div className="campaign-toggle col-md-2 col-sm-2 col-xs-12 pull-right">
                <div className="btn-group" role="group">
                    {showArchive && <button className="btn btn-link">
                        <i className="fa fa-archive" aria-hidden="true" />
                    </button>}
                    {showRestore && <button className="btn btn-link">
                        <i className="fa fa-history" aria-hidden="true" />
                    </button>}
                    <button type="button" className="btn btn-link">
                        <i className="fa fa-chevron-right" aria-hidden="true" />
                    </button>
                </div>
            </div>
            <div
                className="
                    campaign-reach-mini view-count text-center col-md-2 col-md-offset-0 col-sm-4
                    col-sm-offset-2 col-xs-4
                "
            >
                <h4 className="stats-header">200</h4>
                <span className="lighter-text">Views</span>
            </div>
            <div
                className="
                    campaign-clicks-mini click-count text-center col-md-2 col-sm-3
                    col-xs-4
                "
            >
                <h4 className="stats-header">200</h4>
                <span className="lighter-text">Clicks</span>
            </div>
            <div className="campaign-ctr-mini ctr-count text-center col-md-1 col-sm-3 col-xs-4">
                <h4 className="stats-header">9%</h4>
                <span className="lighter-text">CTR</span>
            </div>
        </div>
    </li>);
}

CampaignListItemLoader.propTypes = {
    showArchive: PropTypes.bool.isRequired,
    showRestore: PropTypes.bool.isRequired,
};

CampaignListItemLoader.defaultProps = {
    showArchive: false,
    showRestore: false,
};
