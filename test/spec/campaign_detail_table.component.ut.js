import { mount } from 'enzyme';
import React from 'react';
import CampaignDetailTable from '../../src/components/CampaignDetailTable';

describe('CampaignDetailTable', function() {
    describe('CampaignDetailTableComponent', function() {
        let props;
        let component;

        beforeEach(function() {
            props = {
                chart: 'CAMPAIGN_DETAIL_CHART_TODAY',
                data: { 'today' : [] }
            };

            component = mount(<CampaignDetailTable {...props} />);
        });

        it('should exist', function() {
            expect(component.length).toEqual(1, 'CampaignDetailTable is not rendered');
        });

        it('should have the expected properties',function(){
            expect(component.props().chart).toEqual('CAMPAIGN_DETAIL_CHART_TODAY');
        });
    });
});
