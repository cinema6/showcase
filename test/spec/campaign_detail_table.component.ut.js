'use strict';
import { renderIntoDocument } from 'react-addons-test-utils';
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

            component = renderIntoDocument(<CampaignDetailTable {...props} />);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should have the expected properties',function(){
            expect(component.props.chart).toEqual('CAMPAIGN_DETAIL_CHART_TODAY');
        });
    });
});
