import React from 'react';
import { mount } from 'enzyme';
import CampaignListItem from '../../src/components/CampaignListItem';
import StarRating from '../../src/components/StarRating';
import numeral from 'numeral';
import { Link, routerShape } from 'react-router';
import { createUuid } from 'rc-uuid';
import { noop } from 'lodash';

const DASH = '\u2014';

describe('CampaignListItem', () => {
    let props;
    let component;

    beforeEach(() => {
        props = {
            campaignId: `cam-${createUuid()}`,
            thumbnail: '/images/thumb.jpg',
            name: 'The Best App Around',
            rating: 4.5,
            ratingCount: 48357349,
            views: 678234,
            clicks: 19788,

            onArchive: jasmine.createSpy('onArchive()'),
            onRestore: jasmine.createSpy('onRestore()')
        };

        component = mount(
            <CampaignListItem {...props} />,
            {
                context: {
                    router: {
                        push: noop,
                        replace: noop,
                        go: noop,
                        goBack: noop,
                        goForward: noop,
                        setRouteLeaveHook: noop,
                        isActive: noop,
                        createHref: noop
                    }
                },
                childContextTypes: {
                    router: routerShape
                }
            }
        );
    });

    afterEach(() => {
        props = null;
        component = null;
    });

    it('should exist', () => {
        expect(component.length).toBe(1, 'CampaignListItem not rendered.');
    });

    it('should render a <Link>', () => {
        const link = component.find(Link);

        expect(link.prop('to')).toBe(`/dashboard/campaigns/${props.campaignId}`);
    });

    it('should render the thumbnail', () => {
        const thumbnail = component.find('.app-icon-wrapper img');

        expect(thumbnail.prop('src')).toBe(props.thumbnail);
        expect(thumbnail.prop('alt')).toBe(props.name);
    });

    it('should render the app title', () => {
        const title = component.find('.app-title');

        expect(title.text()).toBe(props.name);
    });

    it('should render a StarRating', () => {
        const rating = component.find(StarRating);

        expect(rating.prop('rating')).toBe(props.rating);
        expect(rating.prop('ratingCount')).toBe(props.ratingCount);
    });

    it('should render the views', () => {
        const views = component.find('.view-count .stats-header');

        expect(views.text()).toBe(numeral(props.views).format('0,0'));
    });

    it('should render the clicks', () => {
        const clicks = component.find('.click-count .stats-header');

        expect(clicks.text()).toBe(numeral(props.clicks).format('0,0'));
    });

    it('should render the CTR', () => {
        const ctr = component.find('.ctr-count .stats-header');

        expect(ctr.text()).toBe(`${Math.round((props.clicks / props.views) * 100)}%`);
    });

    describe('if onArchive is not specified', () => {
        beforeEach(() => {
            component.setProps({ onArchive: null });
        });

        it('should not render the archive button', () => {
            const buttons = component.find('.campaign-toggle button');

            expect(buttons.length).toBe(2);
            expect(buttons.at(0).find('i').hasClass('fa-history')).toBe(true);
            expect(buttons.at(1).find('i').hasClass('fa-chevron-right')).toBe(true);
        });
    });

    describe('if onRestore is not specified', () => {
        beforeEach(() => {
            component.setProps({ onRestore: null });
        });

        it('should not render the restore button', () => {
            const buttons = component.find('.campaign-toggle button');

            expect(buttons.length).toBe(2);
            expect(buttons.at(0).find('i').hasClass('fa-archive')).toBe(true);
            expect(buttons.at(1).find('i').hasClass('fa-chevron-right')).toBe(true);
        });
    });

    describe('the archive button', () => {
        let archive;

        beforeEach(() => {
            archive = component.find('.campaign-toggle button').at(0);
        });

        afterEach(() => {
            archive = null;
        });

        describe('when clicked', () => {
            let event;

            beforeEach(() => {
                event = {
                    stopPropagation: jasmine.createSpy('event.stopPropagation()'),
                    preventDefault: jasmine.createSpy('event.preventDefault()')
                };

                archive.simulate('click', event);
            });

            afterEach(() => {
                event = null;
            });

            it('should stopPropagation() and preventDefault()', () => {
                expect(event.stopPropagation).toHaveBeenCalledWith();
                expect(event.preventDefault).toHaveBeenCalledWith();
            });

            it('should call onArchive()', () => {
                expect(props.onArchive).toHaveBeenCalledWith();
            });
        });
    });

    describe('the restore button', () => {
        let restore;

        beforeEach(() => {
            restore = component.find('.campaign-toggle button').at(1);
        });

        afterEach(() => {
            restore = null;
        });

        describe('when clicked', () => {
            let event;

            beforeEach(() => {
                event = {
                    stopPropagation: jasmine.createSpy('event.stopPropagation()'),
                    preventDefault: jasmine.createSpy('event.preventDefault()')
                };

                restore.simulate('click', event);
            });

            afterEach(() => {
                event = null;
            });

            it('should stopPropagation() and preventDefault()', () => {
                expect(event.stopPropagation).toHaveBeenCalledWith();
                expect(event.preventDefault).toHaveBeenCalledWith();
            });

            it('should call onRestore()', () => {
                expect(props.onRestore).toHaveBeenCalledWith();
            });
        });
    });

    describe('before the analytics are loaded', () => {
        beforeEach(() => {
            component.setProps({
                views: undefined,
                clicks: undefined
            });
        });

        it('should render dashes', () => {
            const views = component.find('.view-count .stats-header');
            const clicks = component.find('.click-count .stats-header');
            const ctr = component.find('.ctr-count .stats-header');

            expect(views.text()).toBe(DASH);
            expect(clicks.text()).toBe(DASH);
            expect(ctr.text()).toBe(DASH);
        });
    });

    describe('if there is no rating', () => {
        beforeEach(() => {
            component.setProps({
                rating: undefined
            });
        });

        it('should not render a StarRating', () => {
            expect(component.find(StarRating).length).toBe(0, 'StarRating is rendered.');
        });
    });
});
