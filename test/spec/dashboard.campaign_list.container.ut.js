import React from 'react';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { cloneDeep as clone, shuffle, random, assign, find } from 'lodash';
import  CampaignList from '../../src/containers/Dashboard/CampaignList';
import { createUuid } from 'rc-uuid';
import CampaignListItem from '../../src/components/CampaignListItem';
import { loadPageData } from '../../src/actions/campaign_list';
import { showAlert } from '../../src/actions/alert';
import * as stubs from '../helpers/stubs';
import { cancel as cancelCampaign } from '../../src/actions/campaign';
import { notify } from '../../src/actions/notification';
import * as NOTIFICATION from '../../src/enums/notification';

describe('CampaignList', () => {
    let wrapper;
    let state;
    let store;
    let component;
    let campaigns;
    let analytics;

    beforeEach(() => {
        campaigns = [
            {
                id: `cam-${createUuid()}`,
                product: {
                    name: 'The First App',
                    images: [
                        { type: 'screenshot', uri: '/screen1.jpg' },
                        { type: 'thumbnail', uri: '/thumb1.jpg' },
                        { type: 'screenshot', uri: '/screen2.jpg' }
                    ],
                    rating: 3.5,
                    ratingCount: 34857394
                }
            },
            {
                id: `cam-${createUuid()}`,
                product: {
                    name: 'The Second App',
                    images: [
                        { type: 'screenshot', uri: '/screen3.jpg' },
                        { type: 'thumbnail', uri: '/thumb2.jpg' },
                        { type: 'screenshot', uri: '/screen4.jpg' }
                    ],
                    rating: null,
                    ratingCount: null
                }
            },
            {
                id: `cam-${createUuid()}`,
                product: {
                    name: 'The Second App',
                    images: [
                        { type: 'screenshot', uri: '/screen5.jpg' },
                        { type: 'thumbnail', uri: '/thumb3.jpg' },
                        { type: 'screenshot', uri: '/screen6.jpg' }
                    ],
                    rating: null,
                    ratingCount: null
                }
            }
        ];

        analytics = campaigns.map(campaign => ({
            campaignId: campaign.id,
            summary: (() => {
                const views = random(700, 3000);
                const users = Math.round(views * random(0.7, 0.9));
                const clicks = Math.round(users * random(0.05, 0.1));
                const installs = Math.round(clicks * random(0.2, 0.3));

                return { views, users, clicks, installs };
            })()
        }));

        state = {
            session: {
                campaigns: campaigns.map(campaign => campaign.id)
            },
            db: {
                campaign: shuffle([].concat(
                    campaigns,
                    Array.apply([], new Array(5)).map((_, index) => ({
                        id: `cam-${createUuid()}`,
                        product: {
                            name: `Random App ${index + 1}`,
                            images: [
                                { type: 'screenshot', uri: `/screen--${createUuid()}.jpg` },
                                { type: 'thumbnail', uri: `/thumb--${createUuid()}.jpg` },
                                { type: 'screenshot', uri: `/screen--${createUuid()}.jpg` }
                            ],
                            rating: random(0, 5),
                            ratingCount: random(0, 48573945)
                        }
                    }))
                )).reduce((cache, campaign) => assign(cache, {
                    [campaign.id]: campaign
                }), {})
            },
            analytics: {
                results: shuffle([].concat(
                    analytics,
                    Array.apply([], new Array(5)).map(() => ({
                        campaignId: `cam-${createUuid()}`,
                        summary: (() => {
                            const views = random(700, 3000);
                            const users = Math.round(views * random(0.7, 0.9));
                            const clicks = Math.round(users * random(0.05, 0.1));
                            const installs = Math.round(clicks * random(0.2, 0.3));

                            return { views, users, clicks, installs };
                        })()
                    }))
                )).reduce((cache, data) => assign(cache, {
                    [data.campaignId]: data
                }), {})
            }
        };
        store = createStore(() => clone(state));

        spyOn(store, 'dispatch');
        wrapper = mount(
            <CampaignList />,
            { context: { store } }
        );
        component = wrapper.find(CampaignList.WrappedComponent);
        store.dispatch.and.callThrough();
    });

    afterEach(() => {
        wrapper = null;
        state = null;
        store = null;
        component = null;
        campaigns = null;
        analytics = null;
    });

    it('should exist', () => {
        expect(component.length).toBe(1, 'CampaignList not rendered.');
    });

    it('should dispatch() loadPageData()', () => {
        expect(store.dispatch).toHaveBeenCalledWith(loadPageData());
    });

    it('should render a CampaignListItem for each campaign', () => {
        const items = component.find(CampaignListItem);

        expect(items.length).toBe(campaigns.length);
        campaigns.forEach((campaign, index) => {
            const item = items.at(index);
            const data = find(analytics, { campaignId: campaign.id });

            expect(item.prop('campaignId')).toBe(campaign.id);
            expect(item.prop('thumbnail')).toBe(find(campaign.product.images, { type: 'thumbnail' }).uri);
            expect(item.prop('name')).toBe(campaign.product.name);
            expect(item.prop('rating')).toBe(campaign.product.rating);
            expect(item.prop('ratingCount')).toBe(campaign.product.ratingCount);
            expect(item.prop('views')).toBe(data.summary.users);
            expect(item.prop('clicks')).toBe(data.summary.clicks);
        });
    });

    describe('if the campaignAnalytics are not yet loaded', () => {
        beforeEach(() => {
            state.analytics.results = {};

            store.dispatch({ type: '@@UPDATE' });
        });

        it('should pass undefined to the CampaignListItem', () => {
            component.find(CampaignListItem).forEach(item => {
                expect(item.prop('views')).toBeUndefined();
                expect(item.prop('clicks')).toBeUndefined();
            });
        });
    });

    describe('if the campaigns have not been loaded', () => {
        beforeEach(() => {
            state.session.campaigns = null;
            state.db.campaign = {};

            store.dispatch({ type: '@@UPDATE' });
        });

        it('should not render any campaigns items', () => {
            expect(component.find('.campaign-app-list').length).toBe(0, '.campaign-app-list is rendered.');
        });
    });

    describe('when the user archives a campaign', () => {
        let item;
        let campaign;

        beforeEach(() => {
            store.dispatch.calls.reset();

            item = component.find(CampaignListItem).at(2);
            campaign = campaigns[2];

            item.prop('onArchive')();
        });

        afterEach(() => {
            item = null;
            campaign = null;
        });

        it('should show an alert', () => {
            expect(store.dispatch).toHaveBeenCalledWith((() => {
                const action = showAlert({
                    title: jasmine.any(String),
                    description: jasmine.any(String),
                    buttons: [
                        {
                            text: jasmine.any(String),
                            onSelect: jasmine.any(Function)
                        },
                        {
                            text: jasmine.any(String),
                            type: 'danger',
                            onSelect: jasmine.any(Function)
                        }
                    ]
                });

                action.payload.id = jasmine.any(String);
                action.payload.buttons.forEach(button => button.id = jasmine.any(String));

                return action;
            })());
        });

        describe('the alert that is shown', () => {
            let alert;
            let dismiss;

            beforeEach(() => {
                alert = store.dispatch.calls.mostRecent().args[0].payload;
                dismiss = jasmine.createSpy('dismiss()');
            });

            afterEach(() => {
                alert =  null;
                dismiss = null;
            });

            describe('first button', () => {
                beforeEach(() => {
                    alert.buttons[0].onSelect(dismiss);
                });

                it('should dismiss the alert', () => {
                    expect(dismiss).toHaveBeenCalledWith();
                });
            });

            describe('second button', () => {
                let dispatchStub;
                let success;
                let failure;

                beforeEach(done => {
                    store.dispatch.calls.reset();
                    dispatchStub = stubs.dispatch();
                    store.dispatch.and.callFake(dispatchStub);

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    alert.buttons[1].onSelect(dismiss).then(success, failure);
                    setTimeout(done);
                });

                afterEach(() => {
                    dispatchStub = null;
                    success = null;
                    failure = null;
                });

                it('should cancel the campaign', () => {
                    expect(store.dispatch).toHaveBeenCalledWith(cancelCampaign(campaign.id));
                });

                describe('if the cancelation fails', () => {
                    let reason;

                    beforeEach(done => {
                        reason = new Error('500 SERVER ERROR');
                        reason.response = 'There was an unexpected error!';

                        dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).reject(reason);
                        setTimeout(done);

                        store.dispatch.calls.reset();
                    });

                    it('should notify the user of the failure', () => {
                        expect(store.dispatch).toHaveBeenCalledWith(notify({
                            type: NOTIFICATION.TYPE.DANGER,
                            message: jasmine.any(String),
                            time: 10000
                        }));
                    });

                    it('should fulfill the Promise', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });

                describe('if cancelation succeeds', () => {
                    beforeEach(done => {
                        dispatchStub.getDeferred(store.dispatch.calls.mostRecent().args[0]).resolve(null);
                        setTimeout(done);

                        store.dispatch.calls.reset();
                    });

                    it('should notify the user of the success', () => {
                        expect(store.dispatch).toHaveBeenCalledWith(notify({
                            type: NOTIFICATION.TYPE.SUCCESS,
                            message: jasmine.any(String)
                        }));
                    });

                    it('should dismiss the alert', () => {
                        expect(dismiss).toHaveBeenCalledWith();
                    });

                    it('should fulfill with undefined', () => {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });
            });
        });
    });
});
