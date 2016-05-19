'use strict';
import { renderIntoDocument } from 'react-addons-test-utils';
import React from 'react';
import CampaignDetailChart, { 
        ChartistParameters,
        TodayChartParameters,
        Daily7ChartParameters,
        Daily30ChartParameters,

        createChartParameters
    }
    from '../../src/components/CampaignDetailChart';

describe('CampaignDetailChart', function() {
    describe('CampaignDetailChartComponent', function() {
        let props;
        let component;

        beforeEach(function() {
            props = {
                chart: 'CAMPAIGN_DETAIL_CHART_TODAY',
                series: 'CAMPAIGN_DETAIL_SERIES_VIEWS',
                data: { 'today' : [] }
            };

            component = renderIntoDocument(<CampaignDetailChart {...props} />);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should have the expected properties',function(){
            expect(component.props.chart).toEqual('CAMPAIGN_DETAIL_CHART_TODAY');
            expect(component.props.series).toEqual('CAMPAIGN_DETAIL_SERIES_VIEWS');
        });
    });

    describe('ChartistParameters',function(){
        let chartParams, series, data, labelFormatter;
        
        beforeEach(function(){
            series =  'CAMPAIGN_DETAIL_SERIES_VIEWS';
            labelFormatter = jasmine.createSpy('formatter').and.returnValue('foo');
            data = {
                'today' : [
                    { 'hour'  : '2016-05-12T00:00:00.000Z', 'installs': 0,
                      'views' : 250, 'users' : 200, 'clicks' : 13 },
                    { 'hour'  : '2016-05-12T01:00:00.000Z', 'installs': 0,
                      'views' : 125, 'users' : 175, 'clicks': 3 },
                    { 'hour'  : '2016-05-12T02:00:00.000Z', 'installs': 0,
                      'views' : 433, 'users' : 395, 'clicks': 50 }
                ],
                'daily_7' : [
                    {   'date': '2016-05-06', 'installs': 0,
                        'views':250, 'users':200, 'clicks': 13 },
                    {   'date': '2016-05-07', 'installs': 0,
                        'views':250, 'users':200, 'clicks': 13 },
                    {   'date': '2016-05-08', 'installs': 0,
                        'views': 125, 'users': 175, 'clicks': 3 },
                    {   'date': '2016-05-09', 'installs': 0,
                        'views': 433, 'users': 395, 'clicks': 50 },
                    {   'date': '2016-05-10', 'installs': 0,
                        'views':250, 'users':200, 'clicks': 13 },
                    {   'date': '2016-05-11', 'installs': 0,
                        'views': 125, 'users': 175, 'clicks': 3 },
                    {   'date': '2016-05-12', 'installs': 0,
                        'views': 433, 'users': 395, 'clicks': 50 }
                ],
                'daily_30' : [
                    {   'date': '2016-04-28', 'installs': 0,
                        'views':250, 'users':200, 'clicks': 13 },
                    {   'date': '2016-04-29', 'installs': 0,
                        'views': 125, 'users': 175, 'clicks': 3 },
                    {   'date': '2016-04-30', 'installs': 0,
                        'views': 433, 'users': 395, 'clicks': 50 },
                    {   'date': '2016-05-01', 'installs': 0,
                        'views':250, 'users':200, 'clicks': 13 },
                    {   'date': '2016-05-02', 'installs': 0,
                        'views': 125, 'users': 175, 'clicks': 3 },
                    {   'date': '2016-05-03', 'installs': 0,
                        'views': 433, 'users': 395, 'clicks': 50 },
                    {   'date': '2016-05-04', 'installs': 0,
                        'views':250, 'users':200, 'clicks': 13 },
                    {   'date': '2016-05-05', 'installs': 0,
                        'views': 125, 'users': 175, 'clicks': 3 },
                    {   'date': '2016-05-06', 'installs': 0,
                        'views': 433, 'users': 395, 'clicks': 50 },
                    {   'date': '2016-05-07', 'installs': 0,
                        'views':250, 'users':200, 'clicks': 13 },
                    {   'date': '2016-05-08', 'installs': 0,
                        'views': 125, 'users': 175, 'clicks': 3 },
                    {   'date': '2016-05-09', 'installs': 0,
                        'views': 433, 'users': 395, 'clicks': 50 },
                    {   'date': '2016-05-10', 'installs': 0,
                        'views':250, 'users':200, 'clicks': 13 },
                    {   'date': '2016-05-11', 'installs': 0,
                        'views': 125, 'users': 175, 'clicks': 3 },
                    {   'date': '2016-05-12', 'installs': 0,
                        'views': 433, 'users': 395, 'clicks': 50 }
                ]
            };
        });

        describe('Base Class',function(){

            it('should initialize with CAMPAIGN_DETAIL_SERIES_VIEWS',function(){
                chartParams = new ChartistParameters({ labelFormatter, series,
                    data : data.today });
                expect(labelFormatter.calls.count()).toEqual(3);
                expect(chartParams.data).toEqual(jasmine.objectContaining({
                    series : [ [ 250, 125, 433 ] ]
                }));
                expect(chartParams.isEmpty).toEqual(false);
            });

            it('should initialize with CAMPAIGN_DETAIL_SERIES_USERS',function(){
                series =  'CAMPAIGN_DETAIL_SERIES_USERS';
                chartParams = new ChartistParameters({ labelFormatter, series,
                    data : data.today });
                expect(labelFormatter.calls.count()).toEqual(3);
                expect(chartParams.data).toEqual(jasmine.objectContaining({
                    series : [ [ 200, 175, 395 ] ]
                }));
                expect(chartParams.isEmpty).toEqual(false);
            });

            it('should initialize with CAMPAIGN_DETAIL_SERIES_CLICKS',function(){
                series =  'CAMPAIGN_DETAIL_SERIES_CLICKS';
                chartParams = new ChartistParameters({ labelFormatter, series,
                    data : data.today });
                expect(labelFormatter.calls.count()).toEqual(3);
                expect(chartParams.data).toEqual(jasmine.objectContaining({
                    series : [ [ 13, 3, 50 ] ]
                }));
                expect(chartParams.isEmpty).toEqual(false);
            });

            it('should initialize with CAMPAIGN_DETAIL_SERIES_INSTALLS',function(){
                series =  'CAMPAIGN_DETAIL_SERIES_INSTALLS';
                chartParams = new ChartistParameters({ labelFormatter, series,
                    data : data.today });
                expect(labelFormatter.calls.count()).toEqual(3);
                expect(chartParams.data).toEqual(jasmine.objectContaining({
                    series : [ [ null, null, null ] ]
                }));
                expect(chartParams.isEmpty).toEqual(true);
            });

            it('should throw an exception with a bad series',function(){
                series = 'bad';
                expect( () => {
                    chartParams = new ChartistParameters({ labelFormatter, series,
                        data : data.today });
                }).toThrowError('Unexpected series type: bad');

            });

            it('should throw an exception with missing data',function(){
                expect( () => {
                    chartParams = new ChartistParameters({ labelFormatter, series,
                        data : data.noop });
                }).toThrowError('ChartistParameters requires a data property.');
            });
            
            it('should throw an exception with a missing labelFormatter',function(){
                expect( () => {
                    chartParams = new ChartistParameters({ series,
                        data : data.today });
                }).toThrowError('ChartistParameters requires labelFormatter function.');

            });

        });
        
        describe('TodayChartParameters',function(){

            it('creates the right parameters based on data and series',function(){
                chartParams = new TodayChartParameters({ series, data });
                expect(chartParams.data).toEqual({
                    labels: [ '12am', '1am', '2am' ],
                    series : [ [ 250, 125, 433 ] ]
                });
            });
        });
        
        describe('Daily7ChartParameters',function(){

            it('creates the right parameters based on data and series ',function(){
                chartParams = new Daily7ChartParameters({ series, data });
                expect(chartParams.data).toEqual({
                    labels: [ 'Friday 5/6', 'Saturday 5/7', 'Sunday 5/8',
                        'Monday 5/9', 'Tuesday 5/10', 'Wednesday 5/11', 'Thursday 5/12' ],
                    series : [ [ 250, 250, 125, 433, 250, 125, 433 ] ]
                });
            });
        });

        describe('createChartParameters',function(){
            let chart;

            it('creates a TodayChartParameters from CAMPAIGN_DETAIL_CHART_TODAY',function(){
                chart = 'CAMPAIGN_DETAIL_CHART_TODAY';
                expect(createChartParameters({ chart, series, data }))
                        .toEqual(jasmine.any(TodayChartParameters));
            });
            
            it('creates a Daily7ChartParameters from CAMPAIGN_DETAIL_CHART_7DAY',function(){
                chart = 'CAMPAIGN_DETAIL_CHART_7DAY';
                expect(createChartParameters({ chart, series, data }))
                        .toEqual(jasmine.any(Daily7ChartParameters));
            });
            
            it('creates a Daily30ChartParameters from CAMPAIGN_DETAIL_CHART_30DAY',function(){
                chart = 'CAMPAIGN_DETAIL_CHART_30DAY';
                expect(createChartParameters({ chart, series, data }))
                        .toEqual(jasmine.any(Daily30ChartParameters));
            });

            it('throws an exeception for unrecogizned chart types',function(){
                chart = 'foo';
                expect( () => {
                    createChartParameters({ chart, series, data });
                }).toThrowError('Unrecognized Chart Type: foo');
            });
        });
    });

});
