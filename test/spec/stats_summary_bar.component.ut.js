import StatsSummaryBar from '../../src/components/StatsSummaryBar';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';

describe('StatsSummaryBar', function() {
    beforeEach(function() {

        jasmine.clock().install();
        var baseTime = new Date(2016, 7, 21);
        jasmine.clock().mockDate(baseTime);

        this.props = {
            startDate: moment().subtract(1, 'week'),
            endDate: moment().add(23, 'days'),
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
        expect(this.component.find('.stats-header').at(1).text()).toBe(`${this.props.endDate.diff(moment(), 'days')}`);
    });
    it('should render the views ratio', function() {
        expect(this.component.find('.lighter-text').at(3).text()).toBe(`${this.props.views} /${this.props.viewGoals}`);
    });
    it('should render the views bar width', function() {
        expect(this.component.find('.bar-fill').first().prop('style')).toEqual({ width: `${this.props.views / this.props.viewGoals * 100}%` });
    });
    it('should render the app ratio', function() {
        expect(this.component.find('.lighter-text').last().text()).toBe(`${this.props.appsUsed} /${this.props.maxApps}`);
    });
    it('should render the apps available bar width', function() {
        expect(this.component.find('.bar-fill').last().prop('style')).toEqual({ width: `${this.props.appsUsed / this.props.maxApps * 100}%` });
    });

    describe('before data loads', function() {
        beforeEach(function() {
            this.component.setProps( {
                startDate: null,
                endDate: null,
                views: null,
                viewGoals: null,
                appsUsed: null,
                maxApps: null
            });
        });

        it('should render the cycle dates as dashes', function() {
            expect(this.component.find('.stats-header').first().text()).toBe('\u2014 - \u2014');
        });
        it('should render the days left as dashes', function() {
            expect(this.component.find('.stats-header').at(1).text()).toBe('\u2014');
        });
        it('should render the views ratio as dashes', function() {
            expect(this.component.find('.lighter-text').at(3).text()).toBe('\u2014 /\u2014');
        });
        it('should render the views bar width as 0%', function() {
            expect(this.component.find('.bar-fill').first().prop('style')).toEqual({ width: '0%' });
        });
        it('should render the app ratio as dashes', function() {
            expect(this.component.find('.lighter-text').last().text()).toBe('\u2014 /\u2014');
        });
        it('should render the apps available bar width as 0%', function() {
            expect(this.component.find('.bar-fill').last().prop('style')).toEqual({ width: '0%' });
        });
        describe('if views or appsUsed are 0', function() {
            beforeEach(function() {
                this.component.setProps( {
                    views: 0,
                    appsUsed: 0
                });
            });

            it('should render the views', function() {
                expect(this.component.find('.lighter-text').at(3).text()).toBe('0 /\u2014');
            });
            it('should render appsUsed', function() {
                expect(this.component.find('.lighter-text').last().text()).toBe('0 /\u2014');
            });
        });
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

});
