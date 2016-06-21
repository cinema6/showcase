import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import Chart from 'chart.js';
import { pick, isEqual } from 'lodash';

const DASH = '\u2014';

function formatDate(date) {
    return (date && date.format('MMM D')) || DASH;
}

function formatNumber(number) {
    return (number && numeral(number).format('0,0')) || DASH;
}

function getData(props) {
    const {
        views,
        total,
    } = props;

    if (!total) {
        return [0, 0];
    }

    return [views, total - views];
}

export default class CampaignProgress extends Component {
    componentDidMount() {
        this.createChart();
    }

    componentWillReceiveProps(nextProps) {
        const chartData = pick(this.props, ['views', 'total']);
        const nextChartData = pick(nextProps, ['views', 'total']);

        if (isEqual(chartData, nextChartData)) { return; }

        this.chart.data.datasets[0].data = getData(nextProps);
        this.chart.update();
    }

    componentWillUnmount() {
        this.cleanup();
    }

    createChart() {
        const {
            canvas,
        } = this.refs;

        this.chart = new Chart(canvas, {
            type: 'doughnut',
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                cutoutPercentage: 0,
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
            },
            data: {
                labels: ['Completed', 'Available'],
                datasets: [
                    {
                        data: getData(this.props),
                        backgroundColor: [
                            '#26ADE4',
                            '#fff',
                        ],
                        borderColor: [
                            '#26ADE4',
                            '#eee',
                        ],
                        hoverBackgroundColor: [
                            '#26ADE4',
                            '#eee',
                        ],
                        label: '90%',
                    },
                ],
            },
        });
    }

    cleanup() {
        this.chart.destroy();
        this.chart = null;
    }

    render() {
        const {
            start,
            end,

            views,
            total,
        } = this.props;

        return (<div className="campaign-chart-donut col-md-4 col-sm-4 text-center">
            <h4>Views</h4>
            <canvas ref="canvas" />
            <p>{formatDate(start)} - {formatDate(end)}</p>
            <h4>{formatNumber(views)} / {formatNumber(total)}</h4>
        </div>);
    }
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
