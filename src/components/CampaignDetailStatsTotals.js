import React, { PropTypes } from 'react';
import numeral from 'numeral';

const DASH = '\u2014';

function format(number) {
    return (number && numeral(number).format('0,0')) || DASH;
}

function ctr({ clicks, views }) {
    if (!clicks || !views) { return DASH; }

    return numeral(clicks / views).format('0%');
}

export default function CampaignDetailStatsTotals({
    views,
    clicks,
    installs,
}) {
    return (<div className="campaign-stats-totals col-md-12 col-sm-12 card-item">
        <div className="campaign-reach-mini col-md-3 col-sm-3 col-xs-6  text-center">
            <h3 className="stats-header">{format(views)}</h3>
            <span className="lighter-text">Views</span>
        </div>
        <div className="campaign-clicks-mini col-md-3 col-sm-3 col-xs-6 text-center">
            <h3 className="stats-header">{format(clicks)}</h3>
            <span className="lighter-text">Clicks</span>
        </div>
        <div className="campaign-ctr-mini col-md-3 col-sm-3 col-xs-6 text-center">
            <h3 className="stats-header">{ctr({ clicks, views })}</h3>
            <span className="lighter-text">CTR</span>
        </div>
        <div className="campaign-installs-mini col-md-3 col-sm-3 col-xs-6 text-center">
            <h3 className="stats-header">{format(installs)}</h3>
            <span className="lighter-text">Installs</span>
        </div>
    </div>);
}

CampaignDetailStatsTotals.propTypes = {
    views: PropTypes.number,
    clicks: PropTypes.number,
    installs: PropTypes.number,
};
