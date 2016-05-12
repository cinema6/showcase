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
