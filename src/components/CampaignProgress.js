import React, { PropTypes } from 'react';
import numeral from 'numeral';
import ChartistGraph from 'react-chartist';

const DASH = '\u2014';
const CHART_TYPE = 'Pie';

function formatDate(date) {
    return (date && date.format('MMM D')) || DASH;
}

function formatNumber(number) {
    return (number && numeral(number).format('0,0')) || DASH;
}

export default function CampaignProgress({
    start,
    end,

    views,
    total,
}) {
    const percent = !total ? 0 : Math.round((views / total) * 100);

    return (<div className="campaign-chart-donut col-md-4 col-sm-4 text-center">
        <h4>Views</h4>
        <ChartistGraph
            type={CHART_TYPE}
            data={{
                series: [percent],
            }}
            options={{
                donut: true,
                total: 100,
            }}
        />
        <p>{formatDate(start)} - {formatDate(end)}</p>
        <h4>{formatNumber(views)} / {formatNumber(total)}</h4>
    </div>);
}

CampaignProgress.propTypes = {
    start: PropTypes.shape({
        format: PropTypes.func.isRequired,
    }),
    end: PropTypes.shape({
        format: PropTypes.func.isRequired,
    }),

    views: PropTypes.number,
    total: PropTypes.number,
};

CampaignProgress.defaultProps = {
    views: 0,
    total: 0,
};
