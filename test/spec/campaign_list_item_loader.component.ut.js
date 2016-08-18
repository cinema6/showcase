import CampaignListItemLoader from '../../src/components/CampaignListItemLoader';
import React from 'react';
import { mount } from 'enzyme';
import StarRating from '../../src/components/StarRating';

describe('CampaignListItemLoader', () => {
    let props;
    let component;

    beforeEach(() => {
        props = {
            showArchive: true,
            showRestore: true
        };

        component = mount(
            <CampaignListItemLoader {...props} />
        );
    });

    afterEach(() => {
        props = null;
        component = null;
    });

    it('should exist', () => {
        expect(component.length).toBe(1, 'CampaignListItemLoader not rendered.');
    });

    it('should render a StarRating', () => {
        const rating = component.find(StarRating);

        expect(rating.prop('rating')).toBe(3.5);
        expect(rating.prop('ratingCount')).toBe(8542);
    });

    it('should render three buttons', () => {
        const buttons = component.find('.btn-group button');
        const archive = buttons.at(0);
        const restore = buttons.at(1);
        const chevron = buttons.at(2);

        expect(buttons.length).toBe(3);

        expect(archive.find('i.fa-archive').length).toBe(1, 'Archive button not rendered.');
        expect(restore.find('i.fa-history').length).toBe(1, 'Restore button not rendered.');
        expect(chevron.find('i.fa-chevron-right').length).toBe(1, 'Chevron button not rendered.');
    });

    describe('if showArchive is false', () => {
        beforeEach(() => {
            component.setProps({ showArchive: false });
        });

        it('should not render the archive button', () => {
            const buttons = component.find('.btn-group button');
            const restore = buttons.at(0);
            const chevron = buttons.at(1);

            expect(buttons.length).toBe(2);

            expect(restore.find('i.fa-history').length).toBe(1, 'Restore button not rendered.');
            expect(chevron.find('i.fa-chevron-right').length).toBe(1, 'Chevron button not rendered.');
        });
    });

    describe('if showRestore is false', () => {
        beforeEach(() => {
            component.setProps({ showRestore: false });
        });

        it('should not render the restore button', () => {
            const buttons = component.find('.btn-group button');
            const archive = buttons.at(0);
            const chevron = buttons.at(1);

            expect(buttons.length).toBe(2);

            expect(archive.find('i.fa-archive').length).toBe(1, 'Archive button not rendered.');
            expect(chevron.find('i.fa-chevron-right').length).toBe(1, 'Chevron button not rendered.');
        });
    });
});
