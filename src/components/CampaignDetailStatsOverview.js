import React, { PropTypes } from 'react';
import numeral from 'numeral';
import CampaignProgress from './CampaignProgress';

const DASH = '\u2014';

function format(number) {
    return (number && numeral(number).format('0,0')) || DASH;
}

export default function CampaignDetailStatsOverview({
    analytics: {
        today = {},
        lifetime = {},
        billingPeriod = {},
    } = {},

    billingPeriod: {
        start,
        end,
        targetViews,
    } = {},
}) {
    return (<div className="campaign-stats-overview card-item col-md-12 col-sm-12">
        <div className="row">
            <CampaignProgress
                start={start}
                end={end}
                views={billingPeriod.users}
                total={targetViews}
            />
            <div className="campaign-stat-timeline col-md-8 col-sm-8">
                <div className="row">
                    <h4 className="text-center">Today</h4>
                    <div className="campaign-reach-mini col-md-4 col-sm-4 col-xs-4 text-center">
                        <h4 className="stats-header">{format(today.users)}</h4>
                        <span className="lighter-text">Views</span>
                    </div>
                    <div className="campaign-clicks-mini col-md-4 col-sm-4 col-xs-4 text-center">
                        <h4 className="stats-header">{format(today.clicks)}</h4>
                        <span className="lighter-text">Clicks</span>
                    </div>
                    <div className="campaign-installs-mini col-md-4 col-sm-4 col-xs-4 text-center">
                        <h4 className="stats-header">{format(today.installs)}</h4>
                        <span className="lighter-text">Installs</span>
                    </div>
                    <div className="clearfix" />
                </div>
                <hr />
                <div className="row">
                    <h4 className="text-center">Lifetime</h4>
                    <div className="campaign-reach-mini col-md-4 col-sm-4 col-xs-4 text-center">
                        <h4 className="stats-header">{format(lifetime.users)}</h4>
                        <span className="lighter-text">Views</span>
                    </div>
                    <div className="campaign-clicks-mini col-md-4 col-sm-4 col-xs-4 text-center">
                        <h4 className="stats-header">{format(lifetime.clicks)}</h4>
                        <span className="lighter-text">Clicks</span>
                    </div>
                    <div className="campaign-installs-mini col-md-4 col-sm-4 col-xs-4 text-center">
                        <h4 className="stats-header">{format(lifetime.installs)}</h4>
                        <span className="lighter-text">Installs</span>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

CampaignDetailStatsOverview.propTypes = {
    analytics: PropTypes.shape({
        today: PropTypes.shape({
            users: PropTypes.number.isRequired,
            clicks: PropTypes.number.isRequired,
            installs: PropTypes.number.isRequired,
        }).isRequired,
        lifetime: PropTypes.shape({
            users: PropTypes.number.isRequired,
            clicks: PropTypes.number.isRequired,
            installs: PropTypes.number.isRequired,
        }).isRequired,
        billingPeriod: PropTypes.shape({
            users: PropTypes.number.isRequired,
        }).isRequired,
    }),

    billingPeriod: PropTypes.shape({
        start: PropTypes.object.isRequired,
        end: PropTypes.object.isRequired,
        targetViews: PropTypes.number.isRequired,
    }),
};
