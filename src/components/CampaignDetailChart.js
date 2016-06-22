import React, { PropTypes, Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';
import { isEqual } from 'lodash';

function getUsers(items) {
    return items.map(({ users }) => users || null);
}

function toPercent(number) {
    return Math.round(number * 100);
}

function getCTR(items) {
    return items.map(({ users, clicks }) => toPercent(Math.min(clicks, users) / users) || null);
}

function getLabels(items) {
    return items.map(({ date }) => moment(date));
}

function isEmpty(items) {
    return !items || !items.some(({ users, clicks }) => users || clicks);
}

export default class CampaignDetailChart extends Component {
    constructor(...args) {
        super(...args);

        this.chart = null;
    }

    componentDidMount() {
        this.createChart(this.props.items);
    }

    componentWillReceiveProps(nextProps) {
        if (isEqual(nextProps.items, this.props.items)) { return undefined; }

        const {
            items,
        } = nextProps;

        if (isEmpty(items)) {
            return this.cleanup();
        }

        if (!this.chart) {
            return undefined;
        }

        const { data } = this.chart;
        const [ctr, users] = data.datasets;

        data.labels = getLabels(items);
        users.data = getUsers(items);
        ctr.data = getCTR(items);

        return this.chart.update();
    }

    componentDidUpdate() {
        this.createChart(this.props.items);
    }

    componentWillUnmount() {
        this.cleanup();
    }

    cleanup() {
        if (!this.chart) { return; }

        this.chart.destroy();
        this.chart = null;
    }

    createChart(items) {
        const {
            canvas,
        } = this.refs;

        if (!canvas || this.chart) { return; }

        this.chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: getLabels(items),
                datasets: [
                    {
                        label: 'CTR',
                        data: getCTR(items),
                        fill: false,
                        backgroundColor: 'rgba(250, 169, 22,1)',
                        borderColor: 'rgba(250, 169, 22,1)',
                        pointBorderColor: 'rgba(250, 169, 22,1)',
                        pointBackgroundColor: 'rgba(250, 169, 22,1)',
                        lineTension: 0,
                        pointRadius: 0,
                        yAxisID: 'ctr',
                    },
                    {
                        label: 'Unique Views',
                        data: getUsers(items),
                        fill: true,
                        backgroundColor: 'rgba(38, 173, 228,0.5)',
                        borderColor: 'rgba(38, 173, 228,1)',
                        pointBorderColor: 'rgba(38, 173, 228,1)',
                        pointBackgroundColor: 'rgba(38, 173, 228,1)',
                        lineTension: 0,
                        yAxisID: 'users',
                    },
                ],
            },
            options: {
                responsive: true,
                legend: {
                    position: 'bottom',
                },
                hoverMode: 'label',
                borderWidth: 2,

                stacked: true,
                scales: {
                    xAxes: [
                        {
                            display: true,
                            gridLines: {
                                offsetGridLines: false,
                            },
                            ticks: {
                                callback: (date, index, dates) => {
                                    const isSmall = canvas.width < 700;
                                    const is30Day = dates.length > 7;

                                    if (is30Day) {
                                        return !isSmall || (index % 2 === 0) ?
                                            date.format('M/D') : ' ';
                                    }

                                    return isSmall ? date.format('dd M/D') :
                                        date.format('dddd M/D');
                                },
                            },
                        },
                    ],
                    yAxes: [
                        {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            id: 'users',
                        },
                        {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            id: 'ctr',

                            gridLines: {
                                drawOnChartArea: false,
                            },
                            ticks: {
                                callback: value => `${value}%`,
                                suggestedMin: 0,
                                suggestedMax: 30,
                            },
                        },
                    ],
                },

                tooltips: {
                    callbacks: {
                        label: ({ yLabel, datasetIndex }, { datasets }) => {
                            const { label } = datasets[datasetIndex];
                            const postfix = datasetIndex === 0 ? '%' : '';

                            return `${label}: ${yLabel}${postfix}`;
                        },
                    },
                },
            },
        });
    }

    render() {
        const {
            items,
        } = this.props;
        const empty = isEmpty(items);

        return (<div className="campaign-stats-chart col-md-12 col-sm-12">
            {empty && (<div className="empty-chart">
                <div className="no-data-message">
                    We don’t have enough data on your ad to show you these stats yet. Your ad is
                    working hard. Check back soon to see how it’s doing.
                </div>
            </div>)}
            {!empty && <canvas ref="canvas" />}
        </div>);
    }
}
CampaignDetailChart.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        users: PropTypes.number.isRequired,
        clicks: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
    }).isRequired),
};
