'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ChartistGraph from 'react-chartist';

export default class CampaignDetailChartIntraday extends Component {
    render() {
        const {
            data
        } = this.props;

        let chartData= {
            labels: [
              '4/12',
              '4/13',
              '4/14',
              '4/15',
              '4/16',
              '4/17',
              '4/18',
              '4/19',
              '4/20',
              '4/21',
              '4/22',
              '4/23',
              '4/24',
              '4/25',
              '4/26',
              '4/27',
              '4/28',
              '4/29',
              '4/30',
              '5/1',
              '5/2',
              '5/3',
              '5/4',
              '5/5',
              '5/6',
              '5/7',
              '5/8',
              '5/9',
              '5/10',
              '5/11'
            ],
            series: [[
                3457,
                3196,
                3490,
                3246,
                2000, //3500,
                2000, //3570,
                3208,
                3612,
                3478,
                3409,
                3471,
                2000, //3441,
                3472,
                3274,
                3214,
                2553,
                2749,
                3226,
                3529,
                2883
//                2943,
//                2980,
//                3275,
//                3081,
//                3173,
//                3203,
//                3182,
//                3214,
//                3159,
//                1609
            ]]
        };

        let options = {
            axisX: {
//                showGrid: false
            },
            lineSmooth: false,
            showArea: true,
            classNames: {
                bar : 'cust-bar',
                label : 'cust-label'
            }
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
                },
                showPoint : false,
                classNames: {
                    bar : 'cust-bar-extra-small',
                    label : 'cust-label-small'
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
                },
                showPoint : false,
                classNames: {
                    bar : 'cust-bar-small',
                    label : 'cust-label-small'
                }
            }],
            ['screen and (min-width: 1286px)',{
                axisX: {
                    showGrid: true
                },
                classNames: {
                    bar : 'cust-bar',
                    label : 'cust-label'
                }

            }]
        ];

        let listeners = {
            'draw' : function(data){
//                console.log('draw some data:',data);
                //if (data.type === 'bar'){
                //    data.element.attr({
                //        style : 'stroke-width: 30px; stroke: #6FE071'
                //    });
                //}
            }
        };
    
        return (
            <div>
                <ChartistGraph className={'ct-octave'} 
                    data={chartData} options={options} type={'Line'} listener={listeners} 
                    responsiveOptions={responsiveOptions} 
                    />
            </div>
        );
    }
}


CampaignDetailChartIntraday.propTypes = {
    data: PropTypes.object.isRequired
};

