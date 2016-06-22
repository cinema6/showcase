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
                    }),
                    ticks: jasmine.objectContaining({
                        callback: jasmine.any(Function)
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
                    id: 'ctr',

                    gridLines: jasmine.objectContaining({
                        drawOnChartArea: false
                    }),
                    ticks: jasmine.objectContaining({
                        callback: jasmine.any(Function),
                        suggestedMin: 0,
                        suggestedMax: 30
                    })
                })
            ])
        }),
        tooltips: jasmine.objectContaining({
            callbacks: jasmine.objectContaining({
                label: jasmine.any(Function)
            })
        })
    });
}

function getChartData(items) {
    return jasmine.objectContaining({
        datasets: [
            jasmine.objectContaining({
                label: 'CTR',
                data: items.map(({ clicks, users }) => {
                    if (!users) { return null; }

                    return Math.round((clicks / users) * 100) || null;
                }),
                fill: false,
                backgroundColor: 'rgba(250, 169, 22,1)',
                borderColor: 'rgba(250, 169, 22,1)',
                pointBorderColor: 'rgba(250, 169, 22,1)',
                pointBackgroundColor: 'rgba(250, 169, 22,1)',
                lineTension: 0,
                pointRadius: 0,
                yAxisID: 'ctr'
            }),
            jasmine.objectContaining({
                label: 'Unique Views',
                data: items.map(({ users }) => users || null),
                fill: true,
                backgroundColor: 'rgba(38, 173, 228,0.5)',
                borderColor: 'rgba(38, 173, 228,1)',
                pointBorderColor: 'rgba(38, 173, 228,1)',
                pointBackgroundColor: 'rgba(38, 173, 228,1)',
                lineTension: 0,
                yAxisID: 'users'
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
                { date: '2016-05-10', views: 0, users: 0, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-11', views: 125, users: 0, clicks: 3 , installs: 2, launches: 0 },
                { date: '2016-05-12', views: 193, users: 125, clicks: 15, installs: 0, launches: 0 }
            ]
        };

        this.component = mount(
            <CampaignDetailChart {...this.props} />
        );

        const canvas = this.component.find('canvas').node;
        canvas.width = 800;
        canvas.height = 600;
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
        expect(chart.config.data.labels.map(label => label.format())).toEqual(this.component.prop('items').map(({ date }) => moment(date).format()));
    });

    describe('the tooltips.label Function', function() {
        beforeEach(function() {
            this.tooltip = {
                xLabel: 'Monday 5/9',
                yLabel: '13',
                datasetIndex: 0,
                index: 2
            };
            this.data = this.component.instance().chart.config.data;

            this.label = this.component.instance().chart.config.options.tooltips.callbacks.label;
        });

        describe('if the dataset is 0', function() {
            beforeEach(function() {
                this.tooltip.datasetIndex = 0;
            });

            it('should add a %', function() {
                expect(this.label(this.tooltip, this.data)).toBe(`CTR: ${this.tooltip.yLabel}%`);
            });
        });

        describe('if the dataset is 1', function() {
            beforeEach(function() {
                this.tooltip.datasetIndex = 1;
            });

            it('should not add a %', function() {
                expect(this.label(this.tooltip, this.data)).toBe(`Unique Views: ${this.tooltip.yLabel}`);
            });
        });
    });

    describe('the yAxes callback', function() {
        beforeEach(function() {
            this.callback = this.component.instance().chart.options.scales.yAxes[1].ticks.callback;
        });

        it('should format the number as a percent', function() {
            expect(this.callback(8, 0, [8])).toBe('8%');
        });
    });

    describe('the xAxes callback', function() {
        beforeEach(function() {
            this.dates = this.component.prop('items').map(({ date }) => moment(date));

            this.callback = this.component.instance().chart.options.scales.xAxes[0].ticks.callback;
        });

        it('should format the date', function() {
            this.dates.forEach((date, index, dates) => expect(this.callback(date, index, dates)).toBe(date.format('dddd M/D')));
        });

        describe('if the canvas is under 700px wide', function() {
            beforeEach(function() {
                this.component.find('canvas').node.width = 699;
            });

            it('should use smaller labels', function() {
                this.dates.forEach((date, index, dates) => expect(this.callback(date, index, dates)).toBe(date.format('dd M/D')));
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
                this.dates = this.component.prop('items').map(({ date }) => moment(date));
            });

            it('should only show the date', function() {
                this.dates.forEach((date, index, dates) => expect(this.callback(date, index, dates)).toBe(date.format('M/D')));
            });

            describe('if the canvas is under 700px wide', function() {
                beforeEach(function() {
                    this.component.find('canvas').node.width = 699;
                });

                it('should only show every other item', function() {
                    this.dates.forEach((date, index, dates) => expect(this.callback(date, index, dates)).toBe(
                        index % 2 === 0 ? date.format('M/D') : ' '
                    ));
                });
            });
        });
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
            expect(this.component.instance().chart.config.data).toEqual(getChartData(this.component.prop('items')));
            expect(this.component.instance().chart.update).toHaveBeenCalledWith();
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
                expect(chart.config.data.labels.map(label => label.format())).toEqual(this.component.prop('items').map(({ date }) => moment(date).format()));
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
