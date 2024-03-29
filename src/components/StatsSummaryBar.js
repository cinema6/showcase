import React, { PropTypes } from 'react';

import moment from 'moment';

function formatDate(date) {
    return (date) ?
        moment(date).format('MMM D') : '\u2014';
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
                    {(endDate && endDate.diff(moment(), 'days')) || '\u2014'}
                </h4>
            </div>
            <div className="campaign-mini-stats col-md-3 col-sm-3 col-xs-6">
                <span className="lighter-text text-left">Views</span>
                <span className="lighter-text pull-right">
                    {typeof views === 'number' ? views : '\u2014'} /
                    {typeof viewGoals === 'number' ? viewGoals : '\u2014'}
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
                    {typeof appsUsed === 'number' ? appsUsed : '\u2014'} /
                    {typeof maxApps === 'number' ? maxApps : '\u2014'}
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
    views: PropTypes.number,
    viewGoals: PropTypes.number,
    appsUsed: PropTypes.number,
    maxApps: PropTypes.number,
};
