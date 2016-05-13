'use strict';

import React, { Component, PropTypes } from 'react';
import ChartistGraph from 'react-chartist';
import numeral from 'numeral';

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

export class ChartistParameters {
    constructor( { type, data, series, options, responsiveOptions, 
        labelFormatter } ) {
        if (!data) {
            throw new Error('ChartistParameters requires a data property.');
        }

        if (!labelFormatter) {
            throw new Error('ChartistParameters requires labelFormatter function.');
        }

        const format = (n) => numeral(n).format('0,0');
        let defaultOptions = {
            axisX   : { showGrid: false },
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

        let labelFormatter = (datum) => { 
            var d = new Date(datum.hour).getHours();
            if (d === 0) {
                return 'Midnight';
            }
            if (d < 12) {
                return d + 'am';
            }
            return  + 'pm';
        };
        super( { labelFormatter, series, data : data.today  } );
    }
}

export class Daily7ChartParameters extends ChartistParameters {
    constructor({series, data}) {

        let labelFormatter = (datum) => { 
            return datum.date.substr(5,5);
        };
        super( { labelFormatter, series, data : data.daily_7  } );
    }
}

export default class CampaignDetailChartIntraday extends Component {
    render() {
        //const {
        //    data,
        //    chart,
        //    series
        //} = this.props;
       
        let chartData= {
            labels: [],
            series: [[ ]]
        };

        let options;
        let responsiveOptions;

        return (
            <div>
                <ChartistGraph className={'ct-octave'} 
                    data={chartData} options={options} type={'Line'}  
                    responsiveOptions={responsiveOptions} 
                    />
            </div>
        );
    }
}


CampaignDetailChartIntraday.propTypes = {
    data: PropTypes.object.isRequired,
    chart: PropTypes.string.isRequired,
    series: PropTypes.string.isRequired
};
