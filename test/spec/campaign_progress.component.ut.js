import CampaignProgress from '../../src/components/CampaignProgress';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

describe('CampaignProgress', function() {
    beforeEach(function() {
        const start = moment().subtract(1, 'month').subtract(6, 'days');
        const end = moment(start).add(1, 'month').subtract(1, 'day');

        this.props = {
            start,
            end,

            views: 1264,
            total: 4967
        };

        this.component = mount(
            <CampaignProgress {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignProgress not rendered.');
    });

    it('should render the billing period', function() {
        expect(this.component.find('p').text()).toEqual(`${this.component.prop('start').format('MMM D')} - ${this.component.prop('end').format('MMM D')}`);
    });

    it('should render the impressions', function() {
        expect(this.component.find('h4').last().text()).toEqual(`${numeral(this.component.prop('views')).format('0,0')} / ${numeral(this.component.prop('total')).format('0,0')}`);
    });

    it('should render a doughnut chart', function() {
        const chart = this.component.instance().chart;
        const canvas = this.component.find('canvas').node;

        expect(canvas).toEqual(jasmine.any(Element), '<canvas> not rendered.');
        expect(chart.chart.canvas).toBe(canvas);
        expect(chart.config.type).toBe('doughnut');
        expect(chart.config.options).toEqual(jasmine.objectContaining({
            responsive: true,
            legend: jasmine.objectContaining({
                display: false
            }),
            cutoutPercentage: 0,
            animation: jasmine.objectContaining({
                animateScale: true,
                animateRotate: true
            })
        }));
        expect(chart.config.data).toEqual({
            labels: jasmine.arrayContaining([
                'Completed',
                'Available'
            ]),
            datasets: jasmine.arrayContaining([
                jasmine.objectContaining({
                    data: [this.component.prop('views'), (this.component.prop('total') - this.component.prop('views'))],
                    backgroundColor: jasmine.arrayContaining([
                        '#26ADE4',
                        '#fff'
                    ]),
                    borderColor: jasmine.arrayContaining([
                        '#26ADE4',
                        '#eee'
                    ]),
                    hoverBackgroundColor: jasmine.arrayContaining([
                        '#26ADE4',
                        '#eee'
                    ]),
                    label: '90%'
                })
            ])
        });
    });

    describe('if the views or totals don\'t change', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'update').and.callThrough();

            this.component.setProps({
                start: moment(),
                end: moment().add(1, 'month')
            });
        });

        it('should not update() the chart', function() {
            expect(this.component.instance().chart.update).not.toHaveBeenCalled();
        });
    });

    describe('if the views or totals change', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'update').and.callThrough();

            this.component.setProps({
                views: this.props.views * 2,
                total: this.props.total * 3
            });
        });

        it('should update() the chart', function() {
            expect(this.component.instance().chart.data.datasets[0].data).toEqual([this.component.prop('views'), (this.component.prop('total') - this.component.prop('views'))]);
            expect(this.component.instance().chart.update).toHaveBeenCalledWith();
        });
    });

    describe('before any data is loaded', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'update').and.callThrough();

            this.component.setProps({
                start: null,
                end: null,
                views: null,
                total: null
            });
        });

        it('should dash-out the data', function() {
            const billingPeriod = this.component.find('p');
            const impressions = this.component.find('h4').last();

            expect(billingPeriod.text()).toBe('\u2014 - \u2014');
            expect(impressions.text()).toBe('\u2014 / \u2014');
        });

        it('should clear the chart', function() {
            expect(this.component.instance().chart.data.datasets[0].data).toEqual([0, 0]);
            expect(this.component.instance().chart.update).toHaveBeenCalledWith();
        });
    });

    describe('if there is no total', function() {
        beforeEach(function() {
            spyOn(this.component.instance().chart, 'update').and.callThrough();

            this.component.setProps({
                total: null
            });
        });

        it('should clear the chart', function() {
            expect(this.component.instance().chart.data.datasets[0].data).toEqual([0, 0]);
            expect(this.component.instance().chart.update).toHaveBeenCalledWith();
        });
    });

    describe('when the component is unmounted', function() {
        beforeEach(function() {
            this.chart = this.component.instance().chart;
            spyOn(this.chart, 'destroy').and.callThrough();

            this.component.unmount();
        });

        it('should destroy the chart', function() {
            expect(this.chart.destroy).toHaveBeenCalledWith();
            expect(this.component.node.chart).toBeNull();
        });
    });
});
