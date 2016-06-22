import CampaignDetailTable from '../../src/components/CampaignDetailTable';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

const DASH = '\u2014';

function formatNumber(number) {
    return (number && numeral(number).format('0,0')) || DASH;
}

describe('CampaignDetailTable', function() {
    beforeEach(function() {
        this.props = {
            items: [
                { date: '2016-05-06', views: 270, users: 210, clicks: 15, installs: 0, launches: 0 },
                { date: '2016-05-07', views: 283, users: 221, clicks: 0, installs: 0, launches: 0 },
                { date: '2016-05-08', views: 245, users: 1985, clicks: 3 , installs: 3, launches: 0 },
                { date: '2016-05-09', views: 433, users: 0, clicks: 5000, installs: 0, launches: 0 },
                { date: '2016-05-10', views: 250, users: 200, clicks: 0, installs: 5, launches: 0 },
                { date: '2016-05-11', views: 125, users: 0, clicks: 3 , installs: 0, launches: 0 },
                { date: '2016-05-12', views: 193, users: 125, clicks: 15, installs: 0, launches: 0 }
            ]
        };

        this.component = mount(
            <CampaignDetailTable {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignDetailTable not rendered.');
    });

    it('should render a row for each item', function() {
        const rows = this.component.find('tbody tr');

        expect(rows.length).toBe(this.component.prop('items').length, 'Incorrect number of rows rendered.');

        this.component.prop('items').forEach(({ users, clicks, date }, index) => {
            const row = rows.at(index);
            const dateNode = row.find('h4').at(0);
            const viewsNode = row.find('h4').at(1);
            const clicksNode = row.find('h4').at(2);
            const ctrNode = row.find('h4').at(3);

            expect(dateNode.text()).toBe(moment(date).format('MMM D'));
            expect(viewsNode.text()).toBe(formatNumber(users));
            expect(clicksNode.text()).toBe(formatNumber(clicks));
            if (!users) {
                expect(ctrNode.text()).toBe(DASH);
            } else {
                const percent = Math.round((clicks / users) * 100);

                expect(ctrNode.text()).toBe(!percent ? DASH : `${percent}%`);
            }
        });
    });

    describe('if there are no items', function() {
        beforeEach(function() {
            this.component.setProps({ items: undefined });
        });

        it('should not render any rows', function() {
            expect(this.component.find('tbody tr').length).toBe(0, 'Some rows were rendered.');
        });
    });
});
