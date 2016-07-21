import React, { PropTypes } from 'react';

import moment from 'moment';

function formatDate(date) {
    return date.format('MMM D');
}

function ratio(num, denom) {
    const percent = num / denom * 100;
    return `${percent}%`;
}

export default function StatsSummaryBar({
    startDate,
    endDate,
    views,
    viewGoals,
    appsUsed,
    maxApps,
}) {
    return (
        <div className="account-summary" id="container">
            <div className="campaign-mini-stats col-md-3 col-sm-3 col-xs-6">
                <span className="lighter-text">Current cycle</span>
                <h4 className="stats-header">
                    {formatDate(startDate)} - {formatDate(endDate)}
                </h4>
            </div>
            <div className="campaign-mini-stats col-md-3 col-sm-3 col-xs-6">
                <span className="lighter-text">Days left</span>
                <h4 className="stats-header">
                    {endDate.diff(moment(), 'days')}
                </h4>
            </div>
            <div className="campaign-mini-stats col-md-3 col-sm-3 col-xs-6">
                <span className="lighter-text text-left">Views</span>
                <span className="lighter-text pull-right">
                    {views} / {viewGoals}
                </span>
                <div className="stats-header stas-bar view-count">
                    <div className="bar-wrap">
                        <div
                            className="bar-fill"
                            style={{ width: ratio(views, viewGoals) }}
                        />
                    </div>
                </div>
            </div>
            <div className="campaign-mini-stats col-md-3 col-sm-3 col-xs-6">
                <span className="lighter-text text-left">Apps</span>
                <span className="lighter-text pull-right">
                    {appsUsed} / {maxApps}
                </span>
                <div className="stats-header stas-bar app-count">
                    <div className="bar-wrap">
                        <div
                            className="bar-fill"
                            style={{ width: ratio(appsUsed, maxApps) }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

StatsSummaryBar.propTypes = {
    startDate: PropTypes.instanceOf(moment),
    endDate: PropTypes.instanceOf(moment),
    today: PropTypes.instanceOf(moment).isRequired,
    views: PropTypes.number.isRequired,
    viewGoals: PropTypes.number.isRequired,
    appsUsed: PropTypes.number.isRequired,
    maxApps: PropTypes.number.isRequired,
};
