import React, { PropTypes } from 'react';
import classnames from 'classnames';
import CampaignDetailStatsTotals from './CampaignDetailStatsTotals';
import CampaignDetailChart from './CampaignDetailChart';
import CampaignDetailTable from './CampaignDetailTable';
import _ from 'lodash';

export const CHART_7DAY = 'CHART_7DAY';
export const CHART_30DAY = 'CHART_30DAY';

function sum(array, prop) {
    return _(array).map(prop).sum();
}

export default function CampaignDetailStatsDetails({
    range,
    items,

    onChangeView,
}) {
    return (<div className="right-col  campaign-stats col-md-8">
        <ul className="switch-chart-range nav nav-pills pull-right">
            {[
                { type: CHART_7DAY, days: 7 },
                { type: CHART_30DAY, days: 30 },
            ].map(({ type, days }) => (<li
                key={type}
                role="presentation"
                className={classnames({
                    active: range === type,
                })}
            >
                <button onClick={() => onChangeView(type)}>Past {days} Days</button>
            </li>))}
        </ul>
        <div className="clearfix" />
        <CampaignDetailStatsTotals
            views={sum(items, 'users')}
            clicks={sum(items, 'clicks')}
            installs={sum(items, 'installs')}
        />
        <CampaignDetailChart items={items} />
        <div className="campaign-stats-table card-item  col-md-12 col-sm-12 table-responsive">
            <CampaignDetailTable items={items} />
        </div>
    </div>);
}

CampaignDetailStatsDetails.propTypes = {
    range: PropTypes.oneOf([CHART_7DAY, CHART_30DAY]),
    items: PropTypes.arrayOf(PropTypes.shape({
        users: PropTypes.number.isRequired,
        clicks: PropTypes.number.isRequired,
    }).isRequired),

    onChangeView: PropTypes.func.isRequired,
};
