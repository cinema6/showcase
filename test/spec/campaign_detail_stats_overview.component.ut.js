import CampaignDetailStatsOverview from '../../src/components/CampaignDetailStatsOverview';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import CampaignProgress from '../../src/components/CampaignProgress';

describe('CampaignDetailStatsOverview', function() {
    beforeEach(function() {
        const start = moment().subtract(1, 'month').subtract(6, 'days');
        const end = moment(start).add(1, 'month').subtract(1, 'day');

        this.props = {
            analytics: {
                today: {
                    users: 2543,
                    views: 3765,
                    clicks: 1001,
                    installs: 5678,
                    launches: 10868
                },
                lifetime: {
                    users: 42543,
                    views: 93765,
                    clicks: 51001,
                    installs: 75678,
                    launches: 810868
                },
                billingPeriod: {
                    users: 42543,
                    views: 93765,
                    clicks: 51001,
                    installs: 75678,
                    launches: 810868
                }
            },
            billingPeriod: {
                start,
                end,
                targetViews: 2878
            }
        };

        this.component = mount(
            <CampaignDetailStatsOverview {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignDetailStatsOverview not rendered.');
    });

    it('should render CampaignProgress', function() {
        const progress = this.component.find(CampaignProgress);

        expect(progress.length).toBe(1, 'CampaignProgress not rendered.');
        expect(progress.prop('start')).toBe(this.component.prop('billingPeriod').start);
        expect(progress.prop('end')).toBe(this.component.prop('billingPeriod').end);
        expect(progress.prop('views')).toBe(this.component.prop('analytics').billingPeriod.users);
        expect(progress.prop('total')).toBe(this.component.prop('billingPeriod').targetViews);
    });

    it('should render today\'s stats', function() {
        const today = this.component.find('.campaign-stat-timeline .row').at(0);

        expect(today.find('.campaign-reach-mini h4').text()).toBe(numeral(this.component.prop('analytics').today.users).format('0,0'));
        expect(today.find('.campaign-clicks-mini h4').text()).toBe(numeral(this.component.prop('analytics').today.clicks).format('0,0'));
        expect(today.find('.campaign-installs-mini h4').text()).toBe(numeral(this.component.prop('analytics').today.installs).format('0,0'));
    });

    it('should render lifetime stats', function() {
        const lifetime = this.component.find('.campaign-stat-timeline .row').at(1);

        expect(lifetime.find('.campaign-reach-mini h4').text()).toBe(numeral(this.component.prop('analytics').lifetime.users).format('0,0'));
        expect(lifetime.find('.campaign-clicks-mini h4').text()).toBe(numeral(this.component.prop('analytics').lifetime.clicks).format('0,0'));
        expect(lifetime.find('.campaign-installs-mini h4').text()).toBe(numeral(this.component.prop('analytics').lifetime.installs).format('0,0'));
    });

    describe('if there is no data', function() {
        beforeEach(function() {
            this.component.setProps({
                analytics: undefined,
                billingPeriod: undefined
            });
        });

        it('should blank-out the data', function() {
            const progress = this.component.find(CampaignProgress);
            const today = this.component.find('.campaign-stat-timeline .row').at(0);
            const lifetime = this.component.find('.campaign-stat-timeline .row').at(1);

            expect(progress.prop('start')).toBeUndefined();
            expect(progress.prop('end')).toBeUndefined();
            expect(progress.prop('views')).toBe(0);
            expect(progress.prop('total')).toBe(0);

            expect(today.find('.campaign-reach-mini h4').text()).toBe('\u2014');
            expect(today.find('.campaign-clicks-mini h4').text()).toBe('\u2014');
            expect(today.find('.campaign-installs-mini h4').text()).toBe('\u2014');

            expect(lifetime.find('.campaign-reach-mini h4').text()).toBe('\u2014');
            expect(lifetime.find('.campaign-clicks-mini h4').text()).toBe('\u2014');
            expect(lifetime.find('.campaign-installs-mini h4').text()).toBe('\u2014');
        });
    });
});
