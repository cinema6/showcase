import CampaignDetailInfo from '../../src/components/CampaignDetailInfo';
import { mount } from 'enzyme';
import React from 'react';
import StarRating from '../../src/components/StarRating';
import { createUuid } from 'rc-uuid';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

describe('CampaignDetailInfo', function() {
    beforeEach(function() {
        this.props = {
            logo: 'my-logo.png',
            title: 'My Awesome App',
            company: 'My Awesome App Factory',
            rating: 3,
            ratingCount: 1674,
            campaignId: `cam-${createUuid()}`,

            onArchive: jasmine.createSpy('onArchive()'),
            onRestore: jasmine.createSpy('onRestore()')
        };

        this.component = mount(
            <CampaignDetailInfo {...this.props} />
        );
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignDetailInfo not rendered.');
    });

    it('should render the logo', function() {
        expect(this.component.find('.app-icon-logo img').prop('src')).toBe(this.props.logo);
    });

    it('should render the campaign title', function() {
        expect(this.component.find('.campaign-title h3').text()).toBe(this.props.title);
    });

    it('should render the company', function() {
        expect(this.component.find('.campaign-title p').last().text()).toBe(`by ${this.props.company}`);
    });

    it('should render the StarRating of the app', function() {
        const starRating = this.component.find(StarRating);

        expect(starRating.prop('rating')).toBe(this.component.prop('rating'));
        expect(starRating.prop('ratingCount')).toBe(this.component.prop('ratingCount'));
    });

    it('should render a link to edit the campaign', function() {
        const link = this.component.find('.edit-campaign-link').find(Link);

        expect(link.length).toBe(1, '<Link> not rendered.');
        expect(link.prop('to')).toBe(`/dashboard/campaigns/${this.component.prop('campaignId')}/edit`);
    });

    it('should render a Button to replace the campaign', function() {
        const button = this.component.find('.trash-campaign-link').find(Button);

        expect(button.length).toBe(1, '<Button> not rendered.');
        expect(button.prop('onClick')).toBe(this.component.prop('onArchive'));
    });

    it('should render a Button to restore the campaign', function() {
        const button = this.component.find('.restore-campaign-link').find(Button);

        expect(button.length).toBe(1, '<Button> not rendered.');
        expect(button.prop('onClick')).toBe(this.component.prop('onRestore'));
    });

    describe('if there is no rating', function() {
        beforeEach(function() {
            this.component.setProps({ rating: null });
        });

        it('should not render a StarRating', function() {
            expect(this.component.find('.campaign-app-info').length).toBe(0, '.campaign-app-info is rendered.');
        });
    });

    describe('if there is no onArchive', function() {
        beforeEach(function() {
            this.component.setProps({ onArchive: null });
        });

        it('should not render an archive button', function() {
            const button = this.component.find('.trash-campaign-link').find(Button);

            expect(button.length).toBe(0, 'archive button is rendered.');
        });
    });

    describe('if there is no onRestore', function() {
        beforeEach(function() {
            this.component.setProps({ onRestore: null });
        });

        it('should not render an archive button', function() {
            const button = this.component.find('.restore-campaign-link').find(Button);

            expect(button.length).toBe(0, 'restore button is rendered.');
        });
    });
});
