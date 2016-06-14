import { mount } from 'enzyme';
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
            installs: 10,

            onDeleteCampaign: jasmine.createSpy('onDeleteCampaign()'),
            onShowInstallTrackingInstructions: jasmine.createSpy('onShowInstallTrackingInstructions()'),
            onShowAdPreview: jasmine.createSpy('onShowAdPreview()')
        };

        component = mount(<CampaignDetailBar {...props} />);
    });

    it('should exist', function() {
        expect(component.length).toEqual(1, 'CampaignDetailBar is not rendered');
    });

    it('should have the expected properties',function(){
        expect(component.props().title).toEqual('test');
        expect(component.props().views).toEqual(100);
        expect(component.props().clicks).toEqual(25);
        expect(component.props().installs).toEqual(10);
        expect(component.props().onDeleteCampaign).toBe(props.onDeleteCampaign);
        expect(component.props().onShowInstallTrackingInstructions).toBe(props.onShowInstallTrackingInstructions);
        expect(component.props().onShowAdPreview).toBe(props.onShowAdPreview);
    });
});

