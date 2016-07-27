import React, { PropTypes } from 'react';

import moment from 'moment';

function formatDate(date) {
    return (date === null) ?
        'n/a' : moment(date).format('MMM D');
}

function ratio(num, denom) {
    return (typeof num !== 'number' && typeof denom !== 'number') ?
        '0%' : `${num / denom * 100}%`;
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
                    {endDate && moment(endDate).diff(moment(), 'days')}
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
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    views: PropTypes.number,
    viewGoals: PropTypes.number,
    appsUsed: PropTypes.number,
    maxApps: PropTypes.number,
};
