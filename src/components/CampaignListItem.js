import React, { PropTypes } from 'react';
import StarRating from './StarRating';
import numeral from 'numeral';
import { Link } from 'react-router';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const DASH = '\u2014';

function format(number) {
    return (number && numeral(number).format('0,0')) || DASH;
}

function formatPercent(number) {
    return (number && `${Math.round(number * 100)}%`) || DASH;
}

const catchEvent = handler => event => {
    event.stopPropagation();
    event.preventDefault();

    return handler(event);
};

export default function CampaignListItem({
    campaignId,
    thumbnail,
    name,
    rating,
    ratingCount,
    views,
    clicks,

    onArchive,
    onRestore,
}) {
    return (<li className="campaign-list-item-wrapper">
        <Link to={`/dashboard/campaigns/${campaignId}`}>
            <div className="campaign-list-item">
                <div className="app-icon-wrapper col-md-1 col-sm-2 col-xs-12 text-center">
                    <img src={thumbnail} alt={name} />
                </div>
                <div className="app-info-wrapper col-md-4 col-sm-8 col-xs-12">
                    <h3 className="app-title">{name}</h3>
                    {rating && <StarRating rating={rating} ratingCount={ratingCount} />}
                </div>
                <div className="campaign-toggle col-md-2 col-sm-2 col-xs-12 pull-right">
                    <div className="btn-group" role="group">
                        {!!onArchive && <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="archive">
                                Archive
                            </Tooltip>}
                        >
                            <button
                                className="btn btn-link"
                                onClick={catchEvent(() => onArchive())}
                            >
                                <i className="fa fa-archive" aria-hidden="true" />
                            </button>
                        </OverlayTrigger>}
                        {!!onRestore && <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="archive">
                                Restore
                            </Tooltip>}
                        >
                            <button
                                className="btn btn-link"
                                onClick={catchEvent(() => onRestore())}
                            >
                                <i className="fa fa-history" aria-hidden="true" />
                            </button>
                        </OverlayTrigger>}
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="stats">
                                View Stats
                            </Tooltip>}
                        >
                            <button type="button" className="btn btn-link">
                                <i className="fa fa-chevron-right" aria-hidden="true" />
                            </button>
                        </OverlayTrigger>
                    </div>
                </div>
                <div
                    className="
                        campaign-reach-mini view-count text-center col-md-2 col-md-offset-0 col-sm-4
                        col-sm-offset-2 col-xs-4
                    "
                >
                    <h4 className="stats-header">{format(views)}</h4>
                    <span className="lighter-text">Views</span>
                </div>
                <div
                    className="
                        campaign-clicks-mini click-count text-center col-md-2 col-sm-3
                        col-xs-4
                    "
                >
                    <h4 className="stats-header">{format(clicks)}</h4>
                    <span className="lighter-text">Clicks</span>
                </div>
                <div className="campaign-ctr-mini ctr-count text-center col-md-1 col-sm-3 col-xs-4">
                    <h4 className="stats-header">{formatPercent(clicks / views)}</h4>
                    <span className="lighter-text">CTR</span>
                </div>
            </div>
        </Link>
    </li>);
}

CampaignListItem.propTypes = {
    campaignId: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
    views: PropTypes.number,
    clicks: PropTypes.number,

    onArchive: PropTypes.func,
    onRestore: PropTypes.func,
};
