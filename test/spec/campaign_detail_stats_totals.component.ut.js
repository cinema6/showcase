import CampaignDetailStatsTotals from '../../src/components/CampaignDetailStatsTotals';
import { mount } from 'enzyme';
import React from 'react';
import numeral from 'numeral';

const DASH = '\u2014';

describe('CampaignDetailStatsTotals', function() {
    beforeEach(function() {
        this.props = {
            views: 34564,
            clicks: 7456,
            installs: 1298
        };

        this.component = mount(
            <CampaignDetailStatsTotals {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignDetailStatsTotals not rendered.');
    });

    it('should render the amount of views', function() {
        expect(this.component.find('.campaign-reach-mini h3').text()).toBe(numeral(this.component.prop('views')).format('0,0'));
    });

    it('should render the amount of clicks', function() {
        expect(this.component.find('.campaign-clicks-mini h3').text()).toBe(numeral(this.component.prop('clicks')).format('0,0'));
    });

    it('should render a CTR', function() {
        expect(this.component.find('.campaign-ctr-mini h3').text()).toBe(numeral(this.component.prop('clicks') / this.component.prop('views')).format('0%'));
    });

    it('should render the amount of installs', function() {
        expect(this.component.find('.campaign-installs-mini h3').text()).toBe(numeral(this.component.prop('installs')).format('0,0'));
    });

    describe('if there is no data', function() {
        beforeEach(function() {
            this.component.setProps({
                views: undefined,
                clicks: undefined,
                installs: undefined
            });
        });

        it('should render dashes', function() {
            const views = this.component.find('.campaign-reach-mini h3');
            const clicks = this.component.find('.campaign-clicks-mini h3');
            const ctr = this.component.find('.campaign-ctr-mini h3');
            const installs = this.component.find('.campaign-installs-mini h3');

            expect(views.text()).toBe(DASH);
            expect(clicks.text()).toBe(DASH);
            expect(ctr.text()).toBe(DASH);
            expect(installs.text()).toBe(DASH);
        });
    });
});
