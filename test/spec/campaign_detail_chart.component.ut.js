import CampaignDetailChart from '../../src/components/CampaignDetailChart';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';
import { assign, random } from 'lodash';

function getChartOptions() {
    return jasmine.objectContaining({
        responsive: true,
        legend: jasmine.objectContaining({
            position: 'bottom'
        }),
        hoverMode: 'label',
        borderWidth: 2,

        stacked: true,
        scales: jasmine.objectContaining({
            xAxes: jasmine.arrayContaining([
                jasmine.objectContaining({
                    display: true,
                    gridLines: jasmine.objectContaining({
                        offsetGridLines: false
                    })
                })
            ]),
            yAxes: jasmine.arrayContaining([
                jasmine.objectContaining({
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'users'
                }),
                jasmine.objectContaining({
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'clicks',

                    gridLines: jasmine.objectContaining({
                        drawOnChartArea: false
                    })
                })
            ])
        })
    });
}
function getChartData(items) {
    return jasmine.objectContaining({
        labels: items.map(({ date }) => moment(date).format('dddd M/D')),
        datasets: [
            jasmine.objectContaining({
                label: 'Unique Views',
                data: items.map(({ users }) => users || null),
                fill: false,
                backgroundColor: 'rgba(38, 173, 228,1)',
                borderColor: 'rgba(38, 173, 228,1)',
                pointBorderColor: 'rgba(38, 173, 228,1)',
                pointBackgroundColor: 'rgba(38, 173, 228,1)',
                lineTension: 0,
                yAxisID: 'users'
            }),
            jasmine.objectContaining({
                label: 'Clicks',
                data: items.map(({ clicks }) => clicks || null),
                fill: false,
                backgroundColor: 'rgba(122, 179, 23,1)',
                borderColor: 'rgba(122, 179, 23,1)',
                pointBorderColor: 'rgba(122, 179, 23,1)',
                pointBackgroundColor: 'rgba(122, 179, 23,1)',
                lineTension: 0,
                yAxisID: 'clicks'
            })
        ]
    });
}

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

    it('should render a <canvas>', function() {
        expect(this.component.find('canvas').length).toBe(1, '<canvas> is not rendered.');
    });

    it('should create a chart', function() {
        const canvas = this.component.find('canvas').node;
        const chart = this.component.instance().chart;

        expect(chart.chart.canvas).toBe(canvas);
        expect(chart.config.type).toBe('line');
        expect(chart.config.options).toEqual(getChartOptions());
        expect(chart.config.data).toEqual(getChartData(this.component.prop('items')));
    });

    describe('if the items does not change', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'update').and.callThrough();

            this.component.setProps({ items: this.props.items.slice() });
        });

        it('should not update the chart', function() {
            expect(this.component.instance().chart.update).not.toHaveBeenCalled();
        });
    });

    describe('if the items do change', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'update').and.callThrough();

            this.component.setProps({
                items: this.props.items.map(item => assign({}, item, {
                    users: item.users * 2,
                    clicks: item.clicks * 3
                }))
            });
        });

        it('should update the chart', function() {
            expect(this.component.instance().chart.data.datasets[0].data).toEqual(this.component.prop('items').map(({ users }) => users || null));
            expect(this.component.instance().chart.data.datasets[1].data).toEqual(this.component.prop('items').map(({ clicks }) => clicks || null));

            expect(this.component.instance().chart.update).toHaveBeenCalledWith();
        });

        describe('to 30 days', function() {
            beforeEach(function() {
                this.component.instance().chart.update.calls.reset();

                this.component.setProps({
                    items: Array.apply([], new Array(30)).map((_, index) => ({
                        users: random(100, 125),
                        clicks: random(10, 20),
                        date: moment().add(index, 'days').format('YYYY-MM-DD')
                    }))
                });
            });

            it('should update the labels', function() {
                expect(this.component.instance().chart.data.labels).toEqual(this.component.prop('items').map(({ date }) => moment(date).format('M/D')));
                expect(this.component.instance().chart.update).toHaveBeenCalledWith();
            });
        });
    });

    describe('when the component is unmounted', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'destroy').and.callThrough();
            this.chart = this.component.instance().chart;

            this.component.unmount();
        });

        it('should destroy the chart', function() {
            expect(this.chart.destroy).toHaveBeenCalledWith();
            expect(this.component.node.chart).toBeNull();
        });
    });

    describe('if there are 30 items', function() {
        beforeEach(function() {
            this.props.items = Array.apply([], new Array(30)).map((_, index) => ({
                users: random(100, 125),
                clicks: random(10, 20),
                date: moment().add(index, 'days').format('YYYY-MM-DD')
            }));

            this.component = mount(
                <CampaignDetailChart {...this.props} />
            );
        });

        it('should use shorter labels', function() {
            expect(this.component.instance().chart.data.labels).toEqual(this.props.items.map(({ date }) => moment(date).format('M/D')));
        });
    });

    describe('if there is at least one metric', function() {
        beforeEach(function() {
            this.props.items = [
                { date: '2016-05-06', views: 270, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-07', views: 283, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-08', views: 245, users: 0, clicks: 0 , installs: 3, launches: 0 },
                { date: '2016-05-09', views: 433, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-10', views: 250, users: 1, clicks: 0, installs: 5, launches: 0 },
                { date: '2016-05-11', views: 125, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-12', views: 193, users: 0, clicks: 0, installs: 0, launches: 0 }
            ];

            this.component = mount(
                <CampaignDetailChart {...this.props} />
            );
        });

        it('should render a chart', function() {
            expect(this.component.find('canvas').length).toBe(1, '<canvas> is not rendered.');
            expect(this.component.instance().chart).toEqual(jasmine.any(Object));
        });
    });

    describe('if there is not one metric', function() {
        beforeEach(function() {
            this.props.items = [
                { date: '2016-05-06', views: 270, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-07', views: 283, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-08', views: 245, users: 0, clicks: 0 , installs: 3, launches: 0 },
                { date: '2016-05-09', views: 433, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-10', views: 250, users: 0, clicks: 0, installs: 5, launches: 0 },
                { date: '2016-05-11', views: 125, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-12', views: 193, users: 0, clicks: 0, installs: 0, launches: 0 }
            ];

            this.component = mount(
                <CampaignDetailChart {...this.props} />
            );
        });

        it('should render a chart', function() {
            expect(this.component.find('canvas').length).toBe(0, '<canvas> is rendered.');
            expect(this.component.instance().chart).toBeNull();
        });

        it('should show a message', function() {
            expect(this.component.find('.empty-chart').length).toBe(1, 'empty chart message not shown.');
        });
    });

    describe('if there are no items', function() {
        beforeEach(function() {
            this.props.items = undefined;

            this.component = mount(
                <CampaignDetailChart {...this.props} />
            );
        });

        it('should show a message', function() {
            expect(this.component.find('.empty-chart').length).toBe(1, 'empty chart message not shown.');
        });

        it('should not render a chart', function() {
            expect(this.component.find('canvas').length).toBe(0, '<canvas> is rendered.');
            expect(this.component.instance().chart).toBeNull();
        });

        describe('if the component is unmount()ed', function() {
            beforeEach(function() {
                this.component.unmount();
            });

            it('should do nothing', function() {
                expect(this.component.node.chart).toBeNull();
            });
        });

        describe('and then there are items', function() {
            beforeEach(function() {
                this.component.setProps({
                    items: [
                        { date: '2016-05-06', views: 270, users: 210, clicks: 15, installs: 0, launches: 0 },
                        { date: '2016-05-07', views: 283, users: 221, clicks: 0, installs: 0, launches: 0 },
                        { date: '2016-05-08', views: 245, users: 195, clicks: 3 , installs: 3, launches: 0 },
                        { date: '2016-05-09', views: 433, users: 0, clicks: 50, installs: 0, launches: 0 },
                        { date: '2016-05-10', views: 250, users: 200, clicks: 0, installs: 5, launches: 0 },
                        { date: '2016-05-11', views: 125, users: 0, clicks: 3 , installs: 0, launches: 0 },
                        { date: '2016-05-12', views: 193, users: 125, clicks: 15, installs: 0, launches: 0 }
                    ]
                });
            });

            it('should create a chart', function() {
                const canvas = this.component.find('canvas').node;
                const chart = this.component.instance().chart;

                expect(chart.chart.canvas).toBe(canvas);
                expect(chart.config.type).toBe('line');
                expect(chart.config.options).toEqual(getChartOptions());
                expect(chart.config.data).toEqual(getChartData(this.component.prop('items')));
            });
        });
    });

    describe('if the items change so there are no metrics', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'destroy').and.callThrough();
            this.chart = this.component.instance().chart;

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

        it('should destroy the chart', function() {
            expect(this.chart.destroy).toHaveBeenCalledWith();
            expect(this.component.instance().chart).toBeNull();
        });

        it('should show a message', function() {
            expect(this.component.find('.empty-chart').length).toBe(1, 'empty chart message not shown.');
        });

        it('should not render a chart', function() {
            expect(this.component.find('canvas').length).toBe(0, '<canvas> is rendered.');
        });
    });

    describe('if the items change so there are no items', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'destroy').and.callThrough();
            this.chart = this.component.instance().chart;

            this.component.setProps({
                items: undefined
            });
        });

        it('should destroy the chart', function() {
            expect(this.chart.destroy).toHaveBeenCalledWith();
            expect(this.component.instance().chart).toBeNull();
        });

        it('should show a message', function() {
            expect(this.component.find('.empty-chart').length).toBe(1, 'empty chart message not shown.');
        });

        it('should not render a chart', function() {
            expect(this.component.find('canvas').length).toBe(0, '<canvas> is rendered.');
        });
    });
});
