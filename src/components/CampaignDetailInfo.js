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

    onReplace,
}) {
    return (<div className="campaign-overview col-md-4">
        <div className="col-md-12 col-sm-12">
            <div className="campaign-app text-center">
                <div className="app-icon-logo">
                    <img alt="logo" src={logo} className="img-rounded" />
                </div>
                <div className="clearfix" />
                <div className="campaign-title">
                    <h3>{title}</h3>
                    <p>by {company}</p>
                </div>
                <div className="campaign-app-info">
                    <StarRating rating={rating} ratingCount={ratingCount} />
                </div>
                <div className="campaign-actions">
                    <span className="edit-campaign-link">
                        <Link
                            to={`/dashboard/campaigns/${campaignId}/edit`}
                            className="btn btn-primary btn-sm"
                        >
                            <i className="fa fa-pencil-square-o" />Edit
                        </Link>
                    </span>
                    <span className="trash-campaign-link">
                        <Button bsStyle="danger" bsSize="sm" onClick={onReplace}>
                            <i className="fa fa-exchange" />Replace
                        </Button>
                    </span>
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
    rating: PropTypes.number.isRequired,
    ratingCount: PropTypes.number,

    onReplace: PropTypes.func.isRequired,
};
