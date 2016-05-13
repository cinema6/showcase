'use strict';
import { renderIntoDocument } from 'react-addons-test-utils';
import React from 'react';
import CampaignDetailChart, { ChartistParameters, TodayChartParameters }
    from '../../src/components/CampaignDetailChartIntraday';

fdescribe('CampaignDetailChart', function() {
    describe('CampaignDetailChartComponent', function() {
        let props;
        let component;

        beforeEach(function() {
            props = {
                chart: 'CAMPAIGN_DETAIL_CHART_TODAY',
                series: 'CAMPAIGN_DETAIL_SERIES_VIEWS',
                data: {}
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
        let chartParams, series, data;
        
        beforeEach(function(){
            series =  'CAMPAIGN_DETAIL_SERIES_VIEWS';
            data = {
                "hourly" : [
                    { "hour"  : "2016-05-12T04:00:00.000Z",
                      "views" : 250, "users" : 200, "clicks" : 13 },
                    { "hour"  : "2016-05-12T05:00:00.000Z",
                      "views" : 125, "users" : 175, "clicks": 3 },
                    { "hour"  : "2016-05-12T06:00:00.000Z",
                      "views" : 433, "users" : 395, "clicks": 50 }
                ]
            };
        });

        describe('Base Class',function(){

            it('should initialize with CAMPAIGN_DETAIL_SERIES_VIEWS',function(){
                chartParams = new ChartistParameters({ series, data : data.hourly });
                expect(chartParams.data).toEqual({
                    labels : [],
                    series : [ [ 250, 125, 433 ] ]
                });
            });

            it('should initialize with CAMPAIGN_DETAIL_SERIES_USERS',function(){
                series =  'CAMPAIGN_DETAIL_SERIES_USERS';
                chartParams = new ChartistParameters({ series, data : data.hourly });
                expect(chartParams.data).toEqual({
                    labels : [],
                    series : [ [ 200, 175, 395 ] ]
                });
            });

            it('should initialize with CAMPAIGN_DETAIL_SERIES_CLICKS',function(){
                series =  'CAMPAIGN_DETAIL_SERIES_CLICKS';
                chartParams = new ChartistParameters({ series, data : data.hourly });
                expect(chartParams.data).toEqual({
                    labels : [],
                    series : [ [ 13, 3, 50 ] ]
                });
            });

            it('should initialize with CAMPAIGN_DETAIL_SERIES_INSTALLS',function(){
                series =  'CAMPAIGN_DETAIL_SERIES_INSTALLS';
                chartParams = new ChartistParameters({ series, data : data.hourly });
                expect(chartParams.data).toEqual({
                    labels : [],
                    series : [ [ undefined, undefined, undefined ] ]
                });
            });

            it('should throw an exception with a bad series',function(){
                series = 'bad';
                expect( () => {
                    chartParams = new ChartistParameters({ series, data : data.hourly });
                }).toThrowError('Unexpected series type: bad');

            });

            it('should throw an exception with missing data',function(){
                series = 'bad';
                expect( () => {
                    chartParams = new ChartistParameters({ series, data : data.noop });
                }).toThrowError('ChartistParameters requires a data property.');
            });


        });
        
        describe('TodayChartParameters',function(){

            it('should blah',function(){
                //chartParams = new TodayChartParameters({ series, data });
            });
        });
    });

});
