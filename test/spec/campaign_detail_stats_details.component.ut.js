import CampaignDetailStatsDetails, {
    CHART_7DAY,
    CHART_30DAY
} from '../../src/components/CampaignDetailStatsDetails';
import { mount } from 'enzyme';
import React from 'react';
import CampaignDetailStatsTotals from '../../src/components/CampaignDetailStatsTotals';
import _ from 'lodash';
import CampaignDetailChart from '../../src/components/CampaignDetailChart';
import CampaignDetailTable from '../../src/components/CampaignDetailTable';

describe('CampaignDetailStatsDetails', function() {
    beforeEach(function() {
        this.props = {
            range: CHART_7DAY,

            items: [
                { date: '2016-05-06', views: 270, users: 210, clicks: 15, installs: 0, launches: 0 },
                { date: '2016-05-07', views: 283, users: 221, clicks: 16, installs: 0, launches: 0 },
                { date: '2016-05-08', views: 245, users: 195, clicks: 3 , installs: 3, launches: 0 },
                { date: '2016-05-09', views: 433, users: 395, clicks: 50, installs: 0, launches: 0 },
                { date: '2016-05-10', views: 250, users: 200, clicks: 13, installs: 5, launches: 0 },
                { date: '2016-05-11', views: 125, users: 175, clicks: 3 , installs: 0, launches: 0 },
                { date: '2016-05-12', views: 193, users: 125, clicks: 15, installs: 0, launches: 0 }
            ],

            onChangeView: jasmine.createSpy('onChangeView()')
        };

        this.component = mount(
            <CampaignDetailStatsDetails {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignDetailStatsDetails not rendered.');
    });

    it('should have a button for a 7-day and 30-day view', function() {
        const seven = this.component.find('.switch-chart-range button').at(0);
        const thirty = this.component.find('.switch-chart-range button').at(1);

        expect(seven.length).toBe(1, '7-day view button does not exist');
        expect(thirty.length).toBe(1, '30-day view button does not exist');

        expect(seven.text()).toBe('Past 7 Days');
        expect(thirty.text()).toBe('Past 30 Days');

        seven.simulate('click');
        expect(this.component.prop('onChangeView')).toHaveBeenCalledWith(CHART_7DAY);

        this.component.prop('onChangeView').calls.reset();

        thirty.simulate('click');
        expect(this.component.prop('onChangeView')).toHaveBeenCalledWith(CHART_30DAY);
    });

    it('should give each button\'s the active class when appropriate', function() {
        const seven = this.component.find('.switch-chart-range button').at(0);
        const thirty = this.component.find('.switch-chart-range button').at(1);

        this.component.setProps({ range: CHART_7DAY });
        expect(seven.hasClass('active')).toBe(true, '7-day view is not active');
        expect(thirty.hasClass('active')).toBe(false, '30-day view is active');

        this.component.setProps({ range: CHART_30DAY });
        expect(seven.hasClass('active')).toBe(false, '7-day view is active');
        expect(thirty.hasClass('active')).toBe(true, '30-day view is not active');
    });

    it('should render a <CampaignDetailStatsTotals>', function() {
        const totals = this.component.find(CampaignDetailStatsTotals);

        expect(totals.prop('views')).toBe(
            _(this.component.prop('items')).map('users').sum()
        );
        expect(totals.prop('clicks')).toBe(
            _(this.component.prop('items')).map('clicks').sum()
        );
        expect(totals.prop('installs')).toBe(
            _(this.component.prop('items')).map('installs').sum()
        );
    });

    it('should render a <CampaignDetailChart>', function() {
        const chart = this.component.find(CampaignDetailChart);

        expect(chart.length).toBe(1, 'CampaignDetailChart not rendered.');
        expect(chart.prop('items')).toBe(this.component.prop('items'));
    });

    it('should render a CampaignDetailTable', function() {
        const table = this.component.find(CampaignDetailTable);

        expect(table.length).toBe(1, 'CampaignDetailTable not rendered.');
        expect(table.prop('items')).toBe(this.component.prop('items'));
    });
});
