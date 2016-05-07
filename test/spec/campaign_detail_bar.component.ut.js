'use strict';
import { renderIntoDocument } from 'react-addons-test-utils';
import CampaignDetailBar from '../../src/components/CampaignDetailBar';
import React from 'react';

describe('CampaignDetailBar', function() {
    let props;
    let component;

    beforeEach(function() {
        props = {
            campaignId: 'abc123',
            title : 'test',
            views: 100,
            clicks: 25,
            installs: 10
        };

        component = renderIntoDocument(<CampaignDetailBar {...props} />);
    });

    it('should exist', function() {
        expect(component).toEqual(jasmine.any(Object));
    });
});

