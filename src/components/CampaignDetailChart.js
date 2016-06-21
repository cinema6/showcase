import React, { PropTypes, Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';
import { isEqual } from 'lodash';

function getSetData(items, prop) {
    return items.map(item => item[prop] || null);
}

function getLabels(items) {
    const is30Day = items.length > 7;

    return is30Day ?
        items.map(({ date }) => moment(date).format('M/D')) :
        items.map(({ date }) => moment(date).format('dddd M/D'));
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
        const [userSet, clickSet] = data.datasets;

        data.labels = getLabels(items);
        userSet.data = getSetData(items, 'users');
        clickSet.data = getSetData(items, 'clicks');

        return this.chart.update();
    }

    componentDidUpdate() {
        this.createChart(this.props.items);
    }

    componentWillUnmount() {
        this.cleanup();
    }

    cleanup() {
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
                        label: 'Unique Views',
                        data: getSetData(items, 'users'),
                        fill: false,
                        backgroundColor: 'rgba(38, 173, 228,1)',
                        borderColor: 'rgba(38, 173, 228,1)',
                        pointBorderColor: 'rgba(38, 173, 228,1)',
                        pointBackgroundColor: 'rgba(38, 173, 228,1)',
                        lineTension: 0,
                        yAxisID: 'users',
                    },
                    {
                        label: 'Clicks',
                        data: getSetData(items, 'clicks'),
                        fill: false,
                        backgroundColor: 'rgba(122, 179, 23,1)',
                        borderColor: 'rgba(122, 179, 23,1)',
                        pointBorderColor: 'rgba(122, 179, 23,1)',
                        pointBackgroundColor: 'rgba(122, 179, 23,1)',
                        lineTension: 0,
                        yAxisID: 'clicks',
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
                            id: 'clicks',

                            gridLines: {
                                drawOnChartArea: false,
                            },
                        },
                    ],
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
