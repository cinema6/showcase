import React, { PropTypes } from 'react';
import ChartistGraph from 'react-chartist';
import moment from 'moment';
import numeral from 'numeral';

function formatter({ template, hideLast = false, showEvery = 1 }) {
    return function format(label, index, labels) {
        if (
            (hideLast && index === (labels.length - 1)) ||
            (index % showEvery !== 0)
        ) { return ''; }

        return label.format(template);
    };
}

function ViewsChart({
    items,
}) {
    const is30Day = items.length > 7;

    return (<ChartistGraph
        type="Line"
        data={{
            series: [items.map(({ users }) => users || null)],
            labels: items.map(({ date }) => moment(date)),
        }}
        options={{
            axisX: {
                showGrid: false,
                labelInterpolationFnc: is30Day ?
                    formatter({ template: 'M/D' }) :
                    formatter({ template: 'dddd', hideLast: true }),
            },
            axisY: {
                labelInterpolationFnc: label => numeral(label).format('0,0'),
            },
            lineSmooth: false,
            showArea: true,
            showPoint: false,
            fullWidth: true,
        }}
        responsiveOptions={[
            ['screen and (max-width: 700px)', {
                axisX: {
                    labelInterpolationFnc: is30Day ?
                        formatter({ template: 'dd', showEvery: 5 }) :
                        formatter({ template: 'dd', hideLast: true }),
                },
            }],
        ]}
    />);
}
ViewsChart.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        users: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
    }).isRequired).isRequired,
};

function ClicksChart({
    items,
}) {
    return (<ChartistGraph
        type="Line"
        data={{
            series: [items.map(({ clicks }) => clicks || null)],
        }}
        options={{
            axisX: {
                showGrid: false,
                showLabel: false,
            },
            axisY: {
                showGrid: false,
                showLabel: true,
                position: 'end',
            },
            lineSmooth: false,
            showArea: true,
            showPoint: false,
            fullWidth: true,
        }}
    />);
}
ClicksChart.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        clicks: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
    }).isRequired).isRequired,
};

export default function CampaignDetailChart({
    items,
}) {
    const isEmpty = (!items || !items.some(({ users, clicks }) => users || clicks));

    return (<div className="campaign-stats-chart col-md-12 col-sm-12">
        {isEmpty && (<div className="empty-chart">
            <div className="no-data-message">
                We don’t have enough data on your ad to show you these stats yet. Your ad is
                working hard. Check back soon to see how it’s doing.
            </div>
        </div>)}
        {!isEmpty && <ViewsChart items={items} />}
        {!isEmpty && <ClicksChart items={items} />}
    </div>);
}

CampaignDetailChart.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        users: PropTypes.number.isRequired,
        clicks: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
    }).isRequired),
};
