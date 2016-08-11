import React, { PropTypes } from 'react';
import StarRating from './StarRating';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

export default function CampaignDetailInfo({
    campaignId,
    title,
    logo,
    company,
    rating,
    ratingCount,

    onArchive,
    onRestore,
}) {
    return (<div className="campaign-overview col-md-4">
        <div className="app-info-wrapper col-md-12 col-sm-12">
            <div className="campaign-app text-center">
                <div className="app-icon-logo">
                    <img alt="logo" src={logo} className="img-rounded" />
                </div>
                <div className="clearfix" />
                <div className="campaign-title">
                    <h3>{title}</h3>
                    <p>by {company}</p>
                </div>
                {!!rating && (<div className="campaign-app-info">
                    <StarRating rating={rating} ratingCount={ratingCount} />
                </div>)}
                <div className="campaign-actions">
                    <span className="edit-campaign-link">
                        <Link
                            to={`/dashboard/campaigns/${campaignId}/edit`}
                            className="btn btn-primary btn-sm"
                        >
                            <i className="fa fa-pencil-square-o" />Edit
                        </Link>
                    </span>
                    {!!onArchive && <span className="trash-campaign-link">
                        <Button bsStyle="default" bsSize="sm" onClick={onArchive}>
                            <i className="fa fa-archive" />Archive
                        </Button>
                    </span>}
                    {!!onRestore && <span className="restore-campaign-link">
                        <Button bsStyle="default" bsSize="sm" onClick={onRestore}>
                            <i className="fa fa-history" />Restore
                        </Button>
                    </span>}
                </div>
            </div>
        </div>
    </div>);
}

CampaignDetailInfo.propTypes = {
    campaignId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,

    onArchive: PropTypes.func,
    onRestore: PropTypes.func,
};
