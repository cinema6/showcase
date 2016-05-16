'use strict';

import React, { Component, PropTypes } from 'react';
import ChartistGraph from 'react-chartist';
import numeral from 'numeral';
import moment from 'moment';

function prefix(type) {
    return `CAMPAIGN_DETAIL_${type}`;
}

export const CHART_TODAY = prefix('CHART_TODAY');
export const CHART_7DAY  = prefix('CHART_7DAY');
export const CHART_30DAY = prefix('CHART_30DAY');

export const SERIES_USERS   = prefix('SERIES_USERS');
export const SERIES_VIEWS   = prefix('SERIES_VIEWS');
export const SERIES_CLICKS  = prefix('SERIES_CLICKS');
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
    constructor( { type, data, series, options, responsiveOptions, 
        labelFormatter } ) {
        if (!data) {
            throw new Error('ChartistParameters requires a data property.');
        }

        if (!labelFormatter) {
            throw new Error('ChartistParameters requires labelFormatter function.');
        }

        let defaultOptions = {
            axisX   : { showGrid: false  },
            axisY   : { labelInterpolationFnc: (value) => format(value) },
            lineSmooth  : false,
            showArea    : true,
            showPoint   : false
        };
        
        let defaultRespOpts = [
            ['screen and (max-width: 700px)',{
                axisX: {
                    showGrid: false,
                    labelInterpolationFnc: 
                        (value, idx) => (idx % 5 === 0) ? value : ''
                }
            }],
            ['screen and (min-width: 701px) and (max-width: 1285px)',{
                axisX: {
                    showGrid: false,
                    labelInterpolationFnc: 
                        (value, idx) => (idx % 2 === 0) ? value : ''
                }
            }]
        ];

        let field = ((() => {
            if (series === SERIES_USERS)    { return 'users'; }
            if (series === SERIES_VIEWS)    { return 'views'; }
            if (series === SERIES_CLICKS)   { return 'clicks'; }
            if (series === SERIES_INSTALLS) { return 'installs'; }
            throw new Error('Unexpected series type: ' + series);
        })());

        this._type               = type || 'Line';
        this._data               = { labels: [], series : [] };
        this._options            = options || defaultOptions;
        this._responsiveOptions  = responsiveOptions || defaultRespOpts;
      
        this._data.series.push( data.map((datum) => datum[field]) );
        this._data.labels = data.map((datum) => labelFormatter(datum) );
    }

    get data()      { return this._data; }
    get options()   { return this._options; }
    get type()      { return this._type; }
    get responsiveOptions() { return this._responsiveOptions; }
}

export class TodayChartParameters extends ChartistParameters {
    constructor({series, data}) {

        let labelFormatter = (datum) => moment(datum.hour).utc().format('ha');
        super( { labelFormatter, series, data : data.today  } );
    }
}

export class Daily7ChartParameters extends ChartistParameters {
    constructor({series, data}) {
        let labelFormatter = (datum) => moment(datum.date).format('dddd M/D');
        
        let options = {
            axisX   : { showGrid: false, labelOffset: { x: -30}  },
            axisY   : { labelInterpolationFnc: (value) => format(value) },
            lineSmooth  : false,
            showArea    : true,
            showPoint   : false,
            fullWidth: true
        };

        let responsiveOptions = [
            ['screen and (max-width: 700px)',{
                axisX: {
                    labelOffset: { x: 0} ,
                    labelInterpolationFnc: (value) =>  value.split(' ')[0].substr(0,2)
                }
            }],
            ['screen and (min-width: 701px) and (max-width: 1285px)',{
                axisX: {
                    labelOffset: { x: -18} ,
                    labelInterpolationFnc: (value) =>  value.split(' ')[0]
                }
            }]
        ];
        super( { labelFormatter, series, options, responsiveOptions, data : data.daily_7 } );
    }
}

export class Daily30ChartParameters extends ChartistParameters {
    constructor({series, data}) {
        let labelFormatter = (datum) => moment(datum.date).format('M/D');
        super( { labelFormatter, series, data : data.daily_30  } );
    }
}

export function createChartParameters({ chart, series, data }) {

    var ctor;

    if (chart === CHART_TODAY) {
        ctor = TodayChartParameters;
    }
    else
    if (chart === CHART_7DAY) { 
        ctor = Daily7ChartParameters;
    }
    else
    if (chart === CHART_30DAY) { 
        ctor = Daily30ChartParameters;
    }
    else {
        throw new Error('Unrecognized Chart Type: ' + chart);
    }

    return new ctor({series, data });

}

export default class CampaignDetailChart extends Component {
    render() {
        let params = createChartParameters(this.props);

        return (
            <div>
                <ChartistGraphExt
                    className={'ct-octave'} 
                    data={params.data} 
                    options={params.options} 
                    type={params.type}  
                    responsiveOptions={params.responsiveOptions} 
                />
            </div>
        );
    }
}


CampaignDetailChart.propTypes = {
    data: PropTypes.object.isRequired,
    chart: PropTypes.string.isRequired,
    series: PropTypes.string.isRequired
};
