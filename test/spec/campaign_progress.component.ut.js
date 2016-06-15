import CampaignProgress from '../../src/components/CampaignProgress';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import ChartistGraph from 'react-chartist';

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

    it('should render a pie chart', function() {
        const chart = this.component.find(ChartistGraph);

        expect(chart.length).toBe(1, 'ChartistGraph not rendered.');
        expect(chart.prop('type')).toBe('Pie');
        expect(chart.prop('data')).toEqual({
            series: [Math.round(this.component.prop('views') / this.component.prop('total') * 100)]
        });
        expect(chart.prop('options')).toEqual({
            donut: true
        });
    });

    describe('before any data is loaded', function() {
        beforeEach(function() {
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
            const chart = this.component.find(ChartistGraph);

            expect(billingPeriod.text()).toBe('\u2014 - \u2014');
            expect(impressions.text()).toBe('\u2014 / \u2014');
            expect(chart.prop('data').series).toEqual([0]);
        });
    });
});
