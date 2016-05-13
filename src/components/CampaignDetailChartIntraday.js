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
    constructor( { type, data, series } ) {
        if (!data) {
            throw new Error('ChartistParameters requires a data property.');
        }

        let field = ((() => {
            if (series === SERIES_USERS)    { return 'users'; }
            if (series === SERIES_VIEWS)    { return 'views'; }
            if (series === SERIES_CLICKS)   { return 'clicks'; }
            if (series === SERIES_INSTALLS) { return 'installs'; }
            throw new Error('Unexpected series type: ' + series);
        })());

        this._type               = type;
        this._data               = { labels: [], series : [] };
        this._options            = null;
        this._responsiveOptions  = null;
       
        this._data.series.push( data.map((datum) => datum[field]) );
    }

    get data()      { return this._data; }
    get options()   { return this._options; }
    get type()      { return this._type; }
    get responsiveOptions() { return this._responsiveOptions; }
}

export class TodayChartParameters extends ChartistParameters {
    constructor({series, data}) {
        let type = 'Line';
        super( { type, series, data : data.hourly } );
    }

}

export default class CampaignDetailChartIntraday extends Component {
    render() {
        //const {
        //    data,
        //    chart,
        //    series
        //} = this.props;
       
        let format = (n) => numeral(n).format('0,0');

        let chartData= {
            labels: [],
            series: [[ ]]
        };

        let options = {
            axisX: {
//                showGrid: false
            },
            axisY : {
                labelInterpolationFnc: function(value) {
                    return format(value);
                }
            },
            lineSmooth: false,
            showArea: true,
            showPoint : false
        };

        let responsiveOptions = [
            ['screen and (max-width: 700px)',{
                axisX: {
                    showGrid: false,
                    labelInterpolationFnc: function(value, idx) {
                        if (idx % 5 === 0) {
                            return value;
                        }
                        return '';
                    }
                }
            }],
            ['screen and (min-width: 701px) and (max-width: 1285px)',{
                axisX: {
                    showGrid: false,
                    labelInterpolationFnc: function(value, idx) {
                        if (idx % 2 === 0) {
                            return value;
                        }
                        return '';
                    }
                }
            }]
        ];

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
