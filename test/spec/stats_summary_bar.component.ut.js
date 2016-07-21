import StatsSummaryBar from '../../src/components/StatsSummaryBar';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';

describe('StatsSummaryBar', function() {
    beforeEach(function() {
        this.props = {
            startDate: moment().subtract(1, 'week'),
            endDate: moment().add(23, 'days'),
            today: moment(),
            views: 200,
            viewGoals: 450,
            appsUsed: 2,
            maxApps: 3,

            onReplace: jasmine.createSpy('onReplace()')
        };

        this.component = mount(
            <StatsSummaryBar {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'StatsSummaryBar not rendered.');
    });
    it('should render the cycle dates', function() {
        expect(this.component.find('.stats-header').first().text()).toBe(`${this.props.startDate.format('MMM D')} - ${this.props.endDate.format('MMM D')}`);
    });
    it('should render the days left', function() {
        expect(this.component.find('.stats-header').at(1).text()).toBe(`${this.props.endDate.diff(this.props.today, 'days')}`);
    });
    it('should render the views ratio', function() {
        expect(this.component.find('.lighter-text').at(3).text()).toBe(`${this.props.views} / ${this.props.viewGoals}`);
    });
    it('should render the views bar width', function() {
        expect(this.component.find('.bar-fill').first().prop('style')).toEqual({ width: `${this.props.views / this.props.viewGoals * 100}%` });
    });
    it('should render the app ratio', function() {
        expect(this.component.find('.lighter-text').last().text()).toBe(`${this.props.appsUsed} / ${this.props.maxApps}`);
    });
    it('should render the apps available bar width', function() {
        expect(this.component.find('.bar-fill').last().prop('style')).toEqual({ width: `${this.props.appsUsed / this.props.maxApps * 100}%` });
    });

});
