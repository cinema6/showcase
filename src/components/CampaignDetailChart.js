import React, { PropTypes } from 'react';
import ChartistGraph from 'react-chartist';
import numeral from 'numeral';
import moment from 'moment';

function prefix(type) {
    return `CAMPAIGN_DETAIL_${type}`;
}

export const CHART_TODAY = prefix('CHART_TODAY');
export const CHART_7DAY = prefix('CHART_7DAY');
export const CHART_30DAY = prefix('CHART_30DAY');

export const SERIES_USERS = prefix('SERIES_USERS');
export const SERIES_VIEWS = prefix('SERIES_VIEWS');
export const SERIES_CLICKS = prefix('SERIES_CLICKS');
export const SERIES_INSTALLS = prefix('SERIES_INSTALLS');


const format = (n) => numeral(n).format('0,0');

// Temporary hack to work-around a bug in the Chartist and react-chartist
// https://github.com/fraserxu/react-chartist/issues/38
class ChartistGraphExt extends ChartistGraph {
    updateChart(config) {
        if (this.chartist) {
            this.chartist.responsiveOptions = config.responsiveOptions || [];
        }
        return super.updateChart(config);
    }

}

export class ChartistParameters {
    constructor({ type, data, series, options, responsiveOptions,
        labelFormatter }) {
        if (!data) {
            throw new Error('ChartistParameters requires a data property.');
        }

        if (!labelFormatter) {
            throw new Error('ChartistParameters requires labelFormatter function.');
        }

        const defaultOptions = {
            axisX: { showGrid: false },
            axisY: { labelInterpolationFnc: (value) => format(value) },
            lineSmooth: false,
            showArea: true,
            showPoint: false,
        };

        const defaultRespOpts = [
            ['screen and (max-width: 700px)', {
                axisX: {
                    showGrid: false,
                    labelInterpolationFnc:
                        (value, idx) => ((idx % 5 === 0) ? value : ''),
                },
            }],
            ['screen and (min-width: 701px) and (max-width: 1285px)', {
                axisX: {
                    showGrid: false,
                    labelInterpolationFnc:
                        (value, idx) => ((idx % 2 === 0) ? value : ''),
                },
            }],
        ];

        const field = ((() => {
            if (series === SERIES_USERS) { return 'users'; }
            if (series === SERIES_VIEWS) { return 'views'; }
            if (series === SERIES_CLICKS) { return 'clicks'; }
            if (series === SERIES_INSTALLS) { return 'installs'; }
            throw new Error(`Unexpected series type: ${series}`);
        })());

        this.type = type || 'Line';
        this.data = { labels: [], series: [] };
        this.options = options || defaultOptions;
        this.responsiveOptions = responsiveOptions || defaultRespOpts;

        this.data.series.push(data.map((d) => (d[field] === 0 ? null : d[field])));
        this.data.labels = data.map((datum) => labelFormatter(datum));
        this.isEmpty = ((data.map((d) => d[field]).reduce((p, c) => p + c, 0)) === 0);
        this.chartClass = `chart-${field === 'users' ? 'reach' : field}`;
    }
}

export class TodayChartParameters extends ChartistParameters {
    constructor({ series, data }) {
        const labelFormatter = (datum) => moment(datum.hour).utc().format('ha');
        super({ labelFormatter, series, data: data.today });
    }
}

export class Daily7ChartParameters extends ChartistParameters {
    constructor({ series, data }) {
        const labelFormatter = (datum) => moment(datum.date).format('dddd M/D');

        const options = {
            axisX: {
                showGrid: false,
                labelInterpolationFnc: (value, index) => ((index === 6) ? '' : value),
               /* , labelOffset: { x: -30} */
            },
            axisY: { labelInterpolationFnc: (value) => format(value) },
            lineSmooth: false,
            showArea: true,
            showPoint: false,
            fullWidth: true,
        };

        const responsiveOptions = [
            ['screen and (max-width: 700px)', {
                axisX: {
                    labelOffset: { x: 0 },
                    labelInterpolationFnc: (value, index) => (
                        (index === 6) ? '' : value.split(' ')[0].substr(0, 2)
                    ),
                },
            }],
            ['screen and (min-width: 701px) and (max-width: 1285px)', {
                axisX: {
                    labelOffset: { x: -18 },
                    labelInterpolationFnc: (value, index) => (
                        (index === 6) ? '' : value.split(' ')[0]
                    ),
                },
            }],
        ];
        super({ labelFormatter, series, options, responsiveOptions, data: data.daily_7 });
    }
}

export class Daily30ChartParameters extends ChartistParameters {
    constructor({ series, data }) {
        const labelFormatter = (datum) => moment(datum.date).format('M/D');
        super({ labelFormatter, series, data: data.daily_30 });
    }
}

export function createChartParameters({ chart, series, data }) {
    let Ctor;

    if (chart === CHART_TODAY) {
        Ctor = TodayChartParameters;
    } else if (chart === CHART_7DAY) {
        Ctor = Daily7ChartParameters;
    } else if (chart === CHART_30DAY) {
        Ctor = Daily30ChartParameters;
    } else {
        throw new Error(`Unrecognized Chart Type: ${chart}`);
    }

    return new Ctor({ series, data });
}

export default function CampaignDetailChart(props) {
    const {
        onShowInstallTrackingInstructions,
    } = props;
    const params = createChartParameters(props);
    let empty;

    if (params.isEmpty) {
        empty = (<div className="empty-chart">
            <div className="no-data-message">
                We don’t have enough data on your ad to show you these stats yet. Your ad is
                working hard. Check back soon to see how it’s doing.
            </div>
            <div className="tracking-pixel-message"><p>You haven’t installed our install tracking
                pixel so we can’t report on installs.
                <a
                    href="#"
                    onClick={event => {
                        event.preventDefault();
                        onShowInstallTrackingInstructions();
                    }}
                > Click here</a> to setup your
            tracking pixel.</p></div></div>);
    }

    return (
        <div className="container">
            <div className={params.chartClass}>
                {empty}
                <ChartistGraphExt
                    className={'ct-octave'}
                    data={params.data}
                    options={params.options}
                    type={params.type}
                    responsiveOptions={params.responsiveOptions}
                />
            </div>
        </div>
    );
}


CampaignDetailChart.propTypes = {
    data: PropTypes.object.isRequired,
    chart: PropTypes.string.isRequired,
    series: PropTypes.string.isRequired,
    onShowInstallTrackingInstructions: PropTypes.func.isRequired,
};
