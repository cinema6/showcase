import CampaignDetailChart from '../../src/components/CampaignDetailChart';
import { mount } from 'enzyme';
import React from 'react';
import ChartistGraph from 'react-chartist';
import moment from 'moment';
import numeral from 'numeral';
import { random } from 'lodash';

describe('CampaignDetailChart', function() {
    beforeEach(function() {
        this.props = {
            items: [
                { date: '2016-05-06', views: 270, users: 210, clicks: 15, installs: 0, launches: 0 },
                { date: '2016-05-07', views: 283, users: 221, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-08', views: 245, users: 195, clicks: 3 , installs: 3, launches: 0 },
                { date: '2016-05-09', views: 433, users: 0, clicks: 50, installs: 0, launches: 0 },
                { date: '2016-05-10', views: 250, users: 200, clicks: 0, installs: 5, launches: 0 },
                { date: '2016-05-11', views: 125, users: 0, clicks: 3 , installs: 0, launches: 0 },
                { date: '2016-05-12', views: 193, users: 125, clicks: 15, installs: 0, launches: 0 }
            ]
        };

        this.component = mount(
            <CampaignDetailChart {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignDetailChart not rendered.');
    });

    it('should render 2 charts', function() {
        expect(this.component.find(ChartistGraph).length).toBe(2, 'Two <ChartistGraph>s are not rendered.');
    });

    describe('if there are no items', function() {
        beforeEach(function() {
            this.component.setProps({
                items: undefined
            });
        });

        it('should show a message', function() {
            expect(this.component.find('.empty-chart').length).toBe(1, 'empty chart message not shown.');
        });

        it('should not render any charts', function() {
            expect(this.component.find(ChartistGraph).length).toBe(0, 'ChartistGraphs were rendered.');
        });
    });

    describe('if there is at least one metric', function() {
        beforeEach(function() {
            this.component.setProps({
                items: [
                    { date: '2016-05-06', views: 270, users: 0, clicks: 0, installs: 0, launches: 0 },
                    { date: '2016-05-07', views: 283, users: 0, clicks: 0, installs: 0, launches: 0 },
                    { date: '2016-05-08', views: 245, users: 0, clicks: 0 , installs: 3, launches: 0 },
                    { date: '2016-05-09', views: 433, users: 0, clicks: 0, installs: 0, launches: 0 },
                    { date: '2016-05-10', views: 250, users: 1, clicks: 0, installs: 5, launches: 0 },
                    { date: '2016-05-11', views: 125, users: 0, clicks: 0, installs: 0, launches: 0 },
                    { date: '2016-05-12', views: 193, users: 0, clicks: 0, installs: 0, launches: 0 }
                ]
            });
        });

        it('should render 2 charts', function() {
            expect(this.component.find(ChartistGraph).length).toBe(2, 'Two <ChartistGraph>s are not rendered.');
        });
    });

    describe('if there is not one metric', function() {
        beforeEach(function() {
            this.component.setProps({
                items: [
                    { date: '2016-05-06', views: 270, users: 0, clicks: 0, installs: 0, launches: 0 },
                    { date: '2016-05-07', views: 283, users: 0, clicks: 0, installs: 0, launches: 0 },
                    { date: '2016-05-08', views: 245, users: 0, clicks: 0 , installs: 3, launches: 0 },
                    { date: '2016-05-09', views: 433, users: 0, clicks: 0, installs: 0, launches: 0 },
                    { date: '2016-05-10', views: 250, users: 0, clicks: 0, installs: 5, launches: 0 },
                    { date: '2016-05-11', views: 125, users: 0, clicks: 0, installs: 0, launches: 0 },
                    { date: '2016-05-12', views: 193, users: 0, clicks: 0, installs: 0, launches: 0 }
                ]
            });
        });

        it('should show a message', function() {
            expect(this.component.find('.empty-chart').length).toBe(1, 'empty chart message not shown.');
        });

        it('should not render any charts', function() {
            expect(this.component.find(ChartistGraph).length).toBe(0, 'ChartistGraphs were rendered.');
        });
    });

    describe('the chart for views', function() {
        beforeEach(function() {
            this.views = this.component.find(ChartistGraph).first();
        });

        it('should exist', function() {
            expect(this.views.length).toBe(1, 'ChartistGraph is not rendered.');
            expect(this.views.prop('type')).toBe('Line');
        });

        it('should add series', function() {
            expect(this.views.prop('data').series).toEqual([this.component.prop('items').map(({ users }) => users || null)]);
        });

        it('should add labels', function() {
            expect(this.views.prop('data').labels).toEqual(this.component.prop('items').map(({ date }) => moment(date)));
        });

        describe('chart options', function() {
            beforeEach(function() {
                this.options = this.views.prop('options');
            });

            it('should contain formatting options', function() {
                expect(this.options).toEqual({
                    axisX: {
                        showGrid: false,
                        labelInterpolationFnc: jasmine.any(Function)
                    },
                    axisY: {
                        labelInterpolationFnc: jasmine.any(Function)
                    },
                    lineSmooth: false,
                    showArea: true,
                    showPoint: false,
                    fullWidth: true
                });
            });

            describe('the axisX labelInterpolationFnc', function() {
                beforeEach(function() {
                    this.labels = this.views.prop('data').labels;
                });

                it('should return the label formatted for every label but the last', function() {
                    this.labels.slice(0, -1).forEach((label, index) => expect(this.options.axisX.labelInterpolationFnc(label, index, this.labels)).toBe(label.format('dddd')));
                });

                it('should return an empty string for the last label', function() {
                    expect(this.options.axisX.labelInterpolationFnc(this.labels.slice(-1)[0], this.labels.length - 1, this.labels)).toBe('');
                });
            });

            describe('the axisY labelInterpolationFnc', function() {
                beforeEach(function() {
                    this.label = (8756496).toString();
                });

                it('should format the number', function() {
                    expect(this.options.axisY.labelInterpolationFnc(this.label)).toBe(numeral(this.label).format('0,0'));
                });
            });
        });

        describe('chart responsive options', function() {
            beforeEach(function() {
                this.responsiveOptions = this.views.prop('responsiveOptions');
            });

            it('should contain responsive configuration', function() {
                expect(this.responsiveOptions).toEqual([
                    ['screen and (max-width: 700px)', {
                        axisX: {
                            labelInterpolationFnc: jasmine.any(Function)
                        }
                    }]
                ]);
            });

            describe('the axisX labelInterpolationFnc', function() {
                beforeEach(function() {
                    this.labelInterpolationFnc = this.responsiveOptions[0][1].axisX.labelInterpolationFnc;

                    this.labels = this.views.prop('data').labels;
                });

                it('should format the dates in short-form', function() {
                    this.labels.slice(0, -1).forEach((label, index) => expect(this.labelInterpolationFnc(label, index, this.labels)).toBe(label.format('dd')));
                });

                it('should return an empty string for the last label', function() {
                    expect(this.labelInterpolationFnc(this.labels.slice(-1)[0], this.labels.length - 1, this.labels)).toBe('');
                });
            });
        });

        describe('if there are 30 items', function() {
            beforeEach(function() {
                this.component.setProps({
                    items: Array.apply([], new Array(30)).map((_, index) => ({
                        users: random(100, 125),
                        clicks: random(10, 20),
                        date: moment().add(index, 'days').format('YYYY-MM-DD')
                    }))
                });

                this.responsiveOptions = this.views.prop('responsiveOptions');
            });

            describe('the options', function() {
                beforeEach(function() {
                    this.options = this.views.prop('options');
                });

                it('should be different', function() {
                    expect(this.options).toEqual({
                        axisX: {
                            showGrid: false,
                            labelInterpolationFnc: jasmine.any(Function)
                        },
                        axisY: {
                            labelInterpolationFnc: jasmine.any(Function)
                        },
                        lineSmooth: false,
                        showArea: true,
                        showPoint: false,
                        fullWidth: true
                    });
                });

                describe('the axisX labelInterpolationFnc', function() {
                    beforeEach(function() {
                        this.labels = this.views.prop('data').labels;
                    });

                    it('should return every other label formatted', function() {
                        this.labels.forEach((label, index) => expect(this.options.axisX.labelInterpolationFnc(label, index, this.labels)).toBe((index % 2 === 0) ? label.format('M/D') : ''));
                    });
                });

                describe('the axisY labelInterpolationFnc', function() {
                    beforeEach(function() {
                        this.label = (8756496).toString();
                    });

                    it('should format the number', function() {
                        expect(this.options.axisY.labelInterpolationFnc(this.label)).toBe(numeral(this.label).format('0,0'));
                    });
                });
            });

            describe('the responsiveOptions', function() {
                beforeEach(function() {
                    this.responsiveOptions = this.views.prop('responsiveOptions');
                });

                it('should be different', function() {
                    expect(this.responsiveOptions).toEqual([
                        ['screen and (max-width: 700px)', {
                            axisX: {
                                labelInterpolationFnc: jasmine.any(Function)
                            }
                        }]
                    ]);
                });

                describe('the axisX labelInterpolationFnc', function() {
                    beforeEach(function() {
                        this.labelInterpolationFnc = this.responsiveOptions[0][1].axisX.labelInterpolationFnc;

                        this.labels = this.views.prop('data').labels;
                    });

                    it('should only show every fifth label', function() {
                        this.labels.forEach((label, index) => expect(this.labelInterpolationFnc(label, index, this.labels)).toBe((index % 5 === 0) ? label.format('M/D') : ''));
                    });
                });
            });
        });
    });

    describe('the chart for clicks', function() {
        beforeEach(function() {
            this.clicks = this.component.find(ChartistGraph).last();
        });

        it('should exist', function() {
            expect(this.clicks.length).toBe(1, 'ChartistGraph is not rendered.');
            expect(this.clicks.prop('type')).toBe('Line');
        });

        it('should add series', function() {
            expect(this.clicks.prop('data').series).toEqual([this.component.prop('items').map(({ clicks }) => clicks || null)]);
        });

        describe('chart options', function() {
            beforeEach(function() {
                this.options = this.clicks.prop('options');
            });

            it('should contain formatting options', function() {
                expect(this.options).toEqual({
                    axisX: {
                        showGrid: false,
                        showLabel: false
                    },
                    axisY: {
                        showGrid: false,
                        showLabel: true,
                        position: 'end'
                    },
                    lineSmooth: false,
                    showArea: true,
                    showPoint: false,
                    fullWidth: true
                });
            });
        });
    });
});
