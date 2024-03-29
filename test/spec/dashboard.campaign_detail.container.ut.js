import CampaignDetail from '../../src/containers/Dashboard/CampaignDetail';
import { mount } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { createUuid } from 'rc-uuid';
import {
    loadPageData,
    showInstallTrackingInstructions,
    updateChartSelection
} from '../../src/actions/campaign_detail';
import {
    notify
} from '../../src/actions/notification';
import {
    restoreCampaign
} from '../../src/actions/archive';
import { CHART_7DAY, CHART_30DAY } from '../../src/components/CampaignDetailStatsDetails';
import InstallTrackingSetupModal from '../../src/components/InstallTrackingSetupModal';
import { TYPE as NOTIFICATION } from '../../src/enums/notification';
import CampaignDetailInfo from '../../src/components/CampaignDetailInfo';
import _, { find, assign, cloneDeep as clone } from 'lodash';
import CampaignDetailStatsOverview from '../../src/components/CampaignDetailStatsOverview';
import moment from 'moment';
import AdPreview from '../../src/components/AdPreview';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import { productDataFromCampaign } from '../../src/utils/campaign';
import CampaignDetailStatsDetails from '../../src/components/CampaignDetailStatsDetails';
import {
    archiveCampaign
} from '../../src/actions/campaign_list';
import {
    LiveResource
} from 'rc-live-resource';
import {
    GET
} from '../../src/utils/db';
import {
    GET_CAMPAIGN_ANALYTICS_SUCCESS
} from '../../src/actions/analytics';

describe('CampaignDetail', function() {
    beforeEach(function() {
        this.campaign = {
            id: `cam-${createUuid()}`,
            name: 'My Awesome App',
            status: 'active',
            product: {
                name: 'My Awesome App',
                developer: 'Some Clever Person',
                rating: 4.5,
                ratingCount: 345788,
                price: 'Free',
                images: [
                    {
                        uri: 'http://a2.mzstatic.com/us/r30/Purple20/v4/2c/d2/1a/2cd21af5-c515-9c39-ac97-d8a82302b7c5/screen1136x1136.jpeg',
                        type: 'screenshot',
                        device: 'phone'
                    },
                    {
                        uri: 'http://a1.mzstatic.com/us/r30/Purple49/v4/9b/b4/36/9bb43699-629e-b07b-1d75-169254191537/screen1136x1136.jpeg',
                        type: 'screenshot',
                        device: 'phone'
                    },
                    {
                        uri: 'http://is5.mzstatic.com/image/thumb/Purple69/v4/f4/a0/89/f4a08972-ef4e-b9f0-90b5-8734fd860316/source/512x512bb.jpg',
                        type: 'thumbnail'
                    }
                ]
            },
            targetUsers: 1050
        };
        this.state = {
            page: {
                'dashboard.campaign_detail': {
                    loading: false,
                    showInstallTrackingInstructions: false,
                    activeSeries: CHART_7DAY
                }
            },
            db: {
                campaign: {
                    [this.campaign.id]: this.campaign
                }
            },
            analytics: {
                results: {
                    [this.campaign.id]: {
                        'summary':{
                            'users':4595,
                            'views':6461,
                            'clicks':1300,
                            'installs':60,
                            'launches':0
                        },
                        'cycle': {
                            'users': 1748,
                            'views': 2749,
                            'clicks': 176,
                            'installs': 60,
                            'launches':0
                        },
                        'daily_7':[
                            { 'date':'2016-05-06', 'views':270, 'users':210,
                                'clicks':15, 'installs': 0, 'launches':0 },
                            { 'date':'2016-05-07', 'views':283, 'users':221,
                                'clicks':16, 'installs': 0, 'launches':0 },
                            { 'date':'2016-05-08', 'views':245, 'users':195,
                                'clicks':3 , 'installs': 0, 'launches':0 },
                            { 'date':'2016-05-09', 'views':433, 'users':395,
                                'clicks':50, 'installs': 0, 'launches':0 },
                            { 'date':'2016-05-10', 'views':250, 'users':200,
                                'clicks':13, 'installs': 0, 'launches':0 },
                            { 'date':'2016-05-11', 'views':125, 'users':175,
                                'clicks':3 , 'installs': 0, 'launches':0 },
                            { 'date':'2016-05-12', 'views':193, 'users':125,
                                'clicks':15, 'installs': 0, 'launches':0 }
                        ],
                        'daily_30':[
                            { 'date':'2016-04-13', 'views':270, 'users':210,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-14', 'views':283, 'users':221,
                                'clicks':16, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-15', 'views':245, 'users':195,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-16', 'views':270, 'users':210,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-17', 'views':270, 'users':210,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-18', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-19', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-20', 'views':193, 'users':175,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-21', 'views':270, 'users':210,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-22', 'views':283, 'users':221,
                                'clicks':16, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-23', 'views':245, 'users':195,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-24', 'views':270, 'users':210,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-25', 'views':283, 'users':221,
                                'clicks':16, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-26', 'views':270, 'users':210,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-27', 'views':270, 'users':210,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-28', 'views':283, 'users':221,
                                'clicks':16, 'installs':0, 'launches':0 },
                            { 'date':'2016-04-29', 'views':270, 'users':210,
                                'clicks':15, 'installs':1, 'launches':0 },
                            { 'date':'2016-04-30', 'views':283, 'users':221,
                                'clicks':16, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-01', 'views':245, 'users':195,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-02', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-03', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-04', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-05', 'views':193, 'users':175,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-06', 'views':270, 'users':210,
                                'clicks':15, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-07', 'views':283, 'users':221,
                                'clicks':16, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-08', 'views':245, 'users':195,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-09', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-10', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-11', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'date':'2016-05-12', 'views':193, 'users':175,
                                'clicks':15, 'installs':0, 'launches':0 }
                        ],
                        'today':[
                            { 'hour':'2016-05-12T00:00:00.000Z', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T01:00:00.000Z', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T02:00:00.000Z', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T03:00:00.000Z', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T04:00:00.000Z', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T05:00:00.000Z', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T06:00:00.000Z', 'views':250, 'users':200,
                                'clicks':13, 'installs':4, 'launches':0 },
                            { 'hour':'2016-05-12T07:00:00.000Z', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T08:00:00.000Z', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T09:00:00.000Z', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T10:00:00.000Z', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T11:00:00.000Z', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T12:00:00.000Z', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T13:00:00.000Z', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T14:00:00.000Z', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T15:00:00.000Z', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T16:00:00.000Z', 'views':125, 'users':175,
                                'clicks':3, 'installs':2, 'launches':0 },
                            { 'hour':'2016-05-12T17:00:00.000Z', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T18:00:00.000Z', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T19:00:00.000Z', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T20:00:00.000Z', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T21:00:00.000Z', 'views':250, 'users':200,
                                'clicks':13, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T22:00:00.000Z', 'views':125, 'users':175,
                                'clicks':3, 'installs':0, 'launches':0 },
                            { 'hour':'2016-05-12T23:00:00.000Z', 'views':433, 'users':395,
                                'clicks':50, 'installs':0, 'launches':0 }
                        ]
                    }
                }
            },
            session: {
                billingPeriod: {
                    cycleStart: moment().format(),
                    cycleEnd: moment().add(1, 'month').subtract(1, 'day').format()
                }
            }
        };
        this.props = {
            params: {
                campaignId: this.campaign.id
            }
        };
        this.store = createStore(() => clone(this.state));

        spyOn(this.store, 'dispatch');
        spyOn(LiveResource.prototype, 'open');

        this.wrapper = mount(
            <CampaignDetail {...this.props} />,
            { context: { store: this.store }, attachTo: document.createElement('div') }
        );
        this.component = this.wrapper.find(CampaignDetail.WrappedComponent.WrappedComponent);
    });

    afterEach(function() {
        this.wrapper.unmount();
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignDetail not rendered.');
    });

    it('should load the page data', function() {
        expect(this.store.dispatch).toHaveBeenCalledWith(loadPageData(this.campaign.id));
    });

    it('should render the name of the campaign and a link to the dashboard', function() {
        const back = this.component.find('.breadcrumb Link').first();

        expect(back.prop('to')).toBe('/dashboard/campaigns');
        expect(back.text()).toBe('Back to Dashboard');

        expect(this.component.find('.breadcrumb li').last().text()).toBe(this.campaign.product.name);
    });

    it('should create a live resource for the campaign', function() {
        const campaign = this.component.node.campaign;

        expect(campaign).toEqual(jasmine.any(LiveResource));
        expect(campaign.config.endpoint).toBe(`/api/campaigns/${this.props.params.campaignId}`);
        expect(campaign.config.pollInterval).toBe(5000);
    });

    it('should create a live resource for the analytics', function() {
        const analytics = this.component.node.analytics;

        expect(analytics).toEqual(jasmine.any(LiveResource));
        expect(analytics.config.endpoint).toBe(`/api/analytics/campaigns/showcase/apps/${this.props.params.campaignId}`);
        expect(analytics.config.pollInterval).toBe(5000);
    });

    describe('when the campaign is changed', function() {
        let campaign;
        let newData;

        beforeEach(function() {
            campaign = this.component.node.campaign;
            this.store.dispatch.calls.reset();

            newData = assign({}, this.campaign, {
                targetUsers: 2000
            });

            campaign.emit('change', newData);
        });

        afterEach(function() {
            campaign = null;
        });

        it('should dispatch an action to update the database cache', function() {
            expect(this.store.dispatch).toHaveBeenCalledWith({
                type: GET.SUCCESS,
                payload: newData,
                meta: {
                    type: 'campaign',
                    key: 'id',
                    id: newData.id
                }
            });
        });

        describe('if the component is unmounted', function() {
            beforeEach(function() {
                this.wrapper.unmount();
                this.store.dispatch.calls.reset();

                campaign.emit('change', newData);
            });

            it('should not dispatch anything', function() {
                expect(this.store.dispatch).not.toHaveBeenCalled();
            });

            it('should null-out the campaign', function() {
                expect(this.component.node.campaign).toBeNull();
            });
        });
    });

    describe('when the analytics are changed', function() {
        let analytics;
        let newData;

        beforeEach(function() {
            analytics = this.component.node.analytics;
            this.store.dispatch.calls.reset();

            newData = assign({}, this.state.analytics.results[this.campaign.id], {
                'cycle': {
                    'users': 2000,
                    'views': 3449,
                    'clicks': 200,
                    'installs': 60,
                    'launches':0
                }
            });

            analytics.emit('change', newData);
        });

        afterEach(function() {
            analytics = null;
        });

        it('should dispatch an action to update the database cache', function() {
            expect(this.store.dispatch).toHaveBeenCalledWith({
                type: GET_CAMPAIGN_ANALYTICS_SUCCESS,
                payload: newData
            });
        });

        describe('if the component is unmounted', function() {
            beforeEach(function() {
                this.wrapper.unmount();
                this.store.dispatch.calls.reset();

                analytics.emit('change', newData);
            });

            it('should not dispatch anything', function() {
                expect(this.store.dispatch).not.toHaveBeenCalled();
            });

            it('should null-out the analytics', function() {
                expect(this.component.node.analytics).toBeNull();
            });
        });
    });

    describe('before the campaign is fetched', function() {
        beforeEach(function() {
            this.store.dispatch.and.callThrough();
            this.state = assign({}, this.state, {
                db: assign({}, this.state.db, {
                    campaign: {}
                })
            });
            this.store.dispatch({ type: '@@UPDATE' });
        });

        it('should not render any breadcrubms', function() {
            expect(this.component.find('.breadcrumb').length).toBe(0, 'breadcrumbs are rendered.');
        });
    });

    describe('if the campaign is canceled', function() {
        beforeEach(function() {
            this.store.dispatch.and.callThrough();

            this.campaign.status = 'canceled';
            this.store.dispatch({ type: '@@UPDATE' });
        });

        it('should render a link back to the archive', function() {
            const back = this.component.find('.breadcrumb Link').first();

            expect(back.prop('to')).toBe('/dashboard/archive');
            expect(back.text()).toBe('Back to Archive');
        });
    });

    describe('when the link to setup install tracking is clicked', function() {
        beforeEach(function() {
            this.link = this.component.find('.track-installs a');
            this.event = {
                preventDefault: jasmine.createSpy('event.preventDefault()')
            };

            this.store.dispatch.calls.reset();

            this.link.simulate('click', this.event);
        });

        it('should preventDefault()', function() {
            expect(this.event.preventDefault).toHaveBeenCalledWith();
        });

        it('should dispatch showInstallTrackingInstructions(true)', function() {
            expect(this.store.dispatch).toHaveBeenCalledWith(showInstallTrackingInstructions(true));
        });
    });

    describe('CampaignDetailInfo', function() {
        beforeEach(function() {
            this.info = this.component.find(CampaignDetailInfo);
        });

        it('should exist', function() {
            const info = this.info;

            expect(info.length).toBe(1, 'CampaignDetailInfo not rendered.');
            expect(info.prop('campaignId')).toBe(this.campaign.id);
            expect(info.prop('title')).toBe(this.campaign.product.name);
            expect(info.prop('logo')).toBe(find(this.campaign.product.images, { type: 'thumbnail' }).uri);
            expect(info.prop('company')).toBe(this.campaign.product.developer);
            expect(info.prop('rating')).toBe(this.campaign.product.rating);
            expect(info.prop('ratingCount')).toBe(this.campaign.product.ratingCount);
        });

        describe('onReplace()', function() {
            beforeEach(function() {
                this.store.dispatch.calls.reset();

                this.info.prop('onArchive')();
            });

            it('should dispatch archiveCampaign()', function() {
                expect(this.store.dispatch).toHaveBeenCalledWith(archiveCampaign(this.campaign));
            });
        });

        describe('onRestore()', () => {
            it('should not exist', function() {
                expect(this.info.prop('onRestore')).toBeFalsy();
            });
        });

        describe('if the campaign is canceled', function() {
            beforeEach(function() {
                this.store.dispatch.and.callThrough();

                this.campaign.status = 'canceled';
                this.store.dispatch({ type: '@@UPDATE' });
            });

            describe('onArchive()', function() {
                it('should not exist', function() {
                    expect(this.info.prop('onArchive')).toBeFalsy();
                });
            });

            describe('onRestore()', function() {
                beforeEach(function() {
                    this.store.dispatch.calls.reset();

                    this.info.prop('onRestore')();
                });

                it('should dispatch() restoreCampaign()', function() {
                    expect(this.store.dispatch).toHaveBeenCalledWith(restoreCampaign(this.campaign.id, `/dashboard/campaigns/${this.campaign.id}`));
                });
            });
        });
    });

    describe('CampaignDetailStatsOverview', function() {
        beforeEach(function() {
            this.overview = this.component.find(CampaignDetailStatsOverview);
        });

        it('should exist', function() {
            const overview = this.overview;

            expect(overview.length).toBe(1, 'CampaignDetailStatsOverview not rendered.');
        });

        describe('analytics', function() {
            beforeEach(function() {
                this.analytics = this.overview.prop('analytics');
            });

            it('should exist for today', function() {
                expect(this.analytics.today).toEqual({
                    users: _(this.state.analytics.results[this.campaign.id].today).map('users').sum(),
                    clicks: _(this.state.analytics.results[this.campaign.id].today).map('clicks').sum(),
                    installs: _(this.state.analytics.results[this.campaign.id].today).map('installs').sum()
                });
            });

            it('should exist for the lifetime', function() {
                expect(this.analytics.lifetime).toEqual({
                    users: this.state.analytics.results[this.campaign.id].summary.users,
                    clicks: this.state.analytics.results[this.campaign.id].summary.clicks,
                    installs: this.state.analytics.results[this.campaign.id].summary.installs
                });
            });

            it('should exist for the billingPeriod', function() {
                expect(this.analytics.billingPeriod).toEqual({
                    users: this.state.analytics.results[this.campaign.id].cycle.users
                });
            });
        });

        it('should include billingPeriod info', function() {
            const billingPeriod = this.overview.prop('billingPeriod');

            expect(billingPeriod).toEqual(jasmine.objectContaining({
                targetViews: this.campaign.targetUsers
            }));
            expect(billingPeriod.start.format()).toBe(this.state.session.billingPeriod.cycleStart);
            expect(billingPeriod.end.format()).toBe(this.state.session.billingPeriod.cycleEnd);
        });

        describe('if the billingPeriod is unknown', function() {
            beforeEach(function() {
                this.state = assign({}, this.state, {
                    session: assign({}, this.state.session, {
                        billingPeriod: null
                    })
                });
                this.store.dispatch.and.callThrough();
                this.store.dispatch({ type: '@@UPDATE' });
            });

            it('should set billingPeriod to undefined', function() {
                expect(this.overview.prop('billingPeriod')).toBeUndefined();
            });
        });

        describe('if the campaign has no targetUsers', function() {
            beforeEach(function() {
                this.state = assign({}, this.state, {
                    db: assign({}, this.state.db, {
                        campaign: assign({}, this.state.db.campaign, {
                            [this.campaign.id]: assign({}, this.campaign, {
                                targetUsers: undefined
                            })
                        })
                    })
                });
                this.store.dispatch.and.callThrough();
                this.store.dispatch({ type: '@@UPDATE' });
            });

            it('should set the billingPeriod.targetViews to 0', function() {
                expect(this.overview.prop('billingPeriod').targetViews).toBe(0);
            });
        });
    });

    describe('AdPreview', function() {
        beforeEach(function() {
            this.preview = this.component.find(AdPreview);
        });

        it('should exist', function() {
            expect(this.preview.length).toBe(1, 'AdPreview not rendered.');
        });

        describe('props', function() {
            describe('productData', function() {
                it('should be the campaign\'s productData', function() {
                    expect(this.preview.props().productData).toEqual(productDataFromCampaign(this.campaign));
                });
            });

            describe('cardOptions', function() {
                it('should be an Object', function() {
                    expect(this.preview.props().cardOptions).toEqual({
                        cardType: 'showcase-app',
                        advanceInterval: 3
                    });
                });
            });

            describe('placementOptions', function() {
                it('should be some placement options', function() {
                    expect(this.preview.props().placementOptions).toEqual({
                        type: 'mobile-card',
                        branding: 'showcase-app--interstitial'
                    });
                });
            });

            describe('factory', function() {
                it('should be the interstitial factory', function() {
                    expect(this.preview.props().factory).toBe(createInterstitialFactory);
                });
            });
        });
    });

    describe('CampaignDetailStatsDetails', function() {
        beforeEach(function() {
            this.details = this.component.find(CampaignDetailStatsDetails);
        });

        it('should exist', function() {
            expect(this.details.length).toBe(1, 'CampaignDetailStatsDetails not rendered.');

            expect(this.details.prop('range')).toBe(this.component.prop('page').activeSeries);
        });

        describe('onChangeView()', function() {
            beforeEach(function() {
                this.store.dispatch.calls.reset();

                this.details.prop('onChangeView')(CHART_30DAY);
            });

            it('should dispatch() updateChartSelection()', function() {
                expect(this.store.dispatch).toHaveBeenCalledWith(updateChartSelection(CHART_30DAY));
            });
        });

        describe('if the activeSeries is', function() {
            beforeEach(function() {
                this.store.dispatch.and.callThrough();
            });

            describe('CHART_7DAY', function() {
                beforeEach(function() {
                    this.state = assign({}, this.state, {
                        page: assign({}, this.state.page, {
                            'dashboard.campaign_detail': assign({}, this.state.page['dashboard.campaign_detail'], {
                                activeSeries: CHART_7DAY
                            })
                        })
                    });
                    this.store.dispatch({ type: '@@UPDATE' });
                });

                it('should set the range', function() {
                    expect(this.details.prop('range')).toBe(CHART_7DAY);
                });

                it('should set the items', function() {
                    expect(this.details.prop('items')).toEqual(this.state.analytics.results[this.campaign.id].daily_7);
                });
            });

            describe('CHART_30DAY', function() {
                beforeEach(function() {
                    this.state = assign({}, this.state, {
                        page: assign({}, this.state.page, {
                            'dashboard.campaign_detail': assign({}, this.state.page['dashboard.campaign_detail'], {
                                activeSeries: CHART_30DAY
                            })
                        })
                    });
                    this.store.dispatch({ type: '@@UPDATE' });
                });

                it('should set the range', function() {
                    expect(this.details.prop('range')).toBe(CHART_30DAY);
                });

                it('should set the items', function() {
                    expect(this.details.prop('items')).toEqual(this.state.analytics.results[this.campaign.id].daily_30);
                });
            });
        });
    });

    describe('if the campaignId does not change', function() {
        let campaign;
        let analytics;

        beforeEach(function() {
            this.store.dispatch.calls.reset();
            campaign = this.component.node.campaign;
            analytics = this.component.node.analytics;

            this.wrapper.setProps({ foo: 'bar' });
        });

        afterEach(function() {
            campaign = null;
            analytics = null;
        });

        it('should not loadPageData()', function() {
            expect(this.store.dispatch).not.toHaveBeenCalledWith(loadPageData(this.campaign.id));
        });

        it('should not change the campaign resource', function() {
            expect(this.component.node.campaign).toBe(campaign);
        });

        it('should not change the analytics resource', function() {
            expect(this.component.node.analytics).toBe(analytics);
        });
    });

    describe('if the campaignId does change', function() {
        let oldCampaign;
        let newCampaign;
        let oldAnalytics;
        let newAnalytics;

        beforeEach(function() {
            oldCampaign = this.component.node.campaign;
            oldAnalytics = this.component.node.analytics;
            this.store.dispatch.calls.reset();

            this.wrapper.setProps({ params: { campaignId: `cam-${createUuid()}` } });
            newCampaign = this.component.node.campaign;
            newAnalytics = this.component.node.analytics;
        });

        afterEach(function() {
            oldCampaign = null;
            newCampaign = null;
            oldAnalytics = null;
            newAnalytics = null;
        });

        it('should load the page data', function() {
            expect(this.store.dispatch).toHaveBeenCalledWith(loadPageData(this.wrapper.prop('params').campaignId));
        });

        it('should create a new campaign resource', function() {
            const campaign = this.component.node.campaign;

            expect(campaign).toEqual(jasmine.any(LiveResource));
            expect(campaign.config.endpoint).toBe(`/api/campaigns/${this.wrapper.prop('params').campaignId}`);
            expect(campaign.config.pollInterval).toBe(5000);
        });

        it('should create a new analytics resource', function() {
            expect(newAnalytics).toEqual(jasmine.any(LiveResource));
            expect(newAnalytics.config.endpoint).toBe(`/api/analytics/campaigns/showcase/apps/${this.wrapper.prop('params').campaignId}`);
            expect(newAnalytics.config.pollInterval).toBe(5000);
        });

        describe('when the new campaign is changed', function() {
            let newData;

            beforeEach(function() {
                this.store.dispatch.calls.reset();

                newData = assign({}, this.campaign, {
                    targetUsers: 2000
                });

                newCampaign.emit('change', newData);
            });

            it('should dispatch an action to update the database cache', function() {
                expect(this.store.dispatch).toHaveBeenCalledWith({
                    type: GET.SUCCESS,
                    payload: newData,
                    meta: {
                        type: 'campaign',
                        key: 'id',
                        id: newData.id
                    }
                });
            });
        });

        describe('when the old campaign is changed', function() {
            let newData;

            beforeEach(function() {
                this.store.dispatch.calls.reset();

                newData = assign({}, this.campaign, {
                    targetUsers: 2000
                });

                oldCampaign.emit('change', newData);
            });

            it('should do nothing', function() {
                expect(this.store.dispatch).not.toHaveBeenCalled();
            });
        });

        describe('when the new analytics are changed', function() {
            let newData;

            beforeEach(function() {
                this.store.dispatch.calls.reset();

                newData = assign({}, this.state.analytics.results[this.campaign.id], {
                    'cycle': {
                        'users': 2000,
                        'views': 3449,
                        'clicks': 200,
                        'installs': 60,
                        'launches':0
                    }
                });

                newAnalytics.emit('change', newData);
            });

            it('should dispatch an action to update the database cache', function() {
                expect(this.store.dispatch).toHaveBeenCalledWith({
                    type: GET_CAMPAIGN_ANALYTICS_SUCCESS,
                    payload: newData
                });
            });
        });

        describe('when the old analytics are changed', function() {
            let newData;

            beforeEach(function() {
                this.store.dispatch.calls.reset();

                newData = assign({}, this.state.analytics.results[this.campaign.id], {
                    'cycle': {
                        'users': 2000,
                        'views': 3449,
                        'clicks': 200,
                        'installs': 60,
                        'launches':0
                    }
                });

                oldAnalytics.emit('change', newData);
            });

            it('should do nothing', function() {
                expect(this.store.dispatch).not.toHaveBeenCalled();
            });
        });
    });

    describe('the InstallTrackingSetupModal', function() {
        beforeEach(function() {
            this.modal = this.component.find(InstallTrackingSetupModal);
        });

        it('should exist', function() {
            expect(this.modal.length).toEqual(1, 'InstallTrackingSetupModal');
        });

        it('should pass the show property', function() {
            expect(this.modal.props().show).toBe(this.component.props().page.showInstallTrackingInstructions);
        });

        it('should pass the campaignId', function() {
            expect(this.modal.props().campaignId).toBe(this.component.props().campaign.id);
        });

        describe('onClose()', function() {
            beforeEach(function() {
                this.store.dispatch.calls.reset();

                this.modal.props().onClose();
            });

            it('should call dispatch showInstallTrackingInstructions(false)', function() {
                expect(this.store.dispatch).toHaveBeenCalledWith(showInstallTrackingInstructions(false));
            });
        });

        describe('onCopyCampaignIdSuccess()', function() {
            beforeEach(function() {
                this.store.dispatch.calls.reset();

                this.modal.props().onCopyCampaignIdSuccess();
            });

            it('should show a notification', function() {
                expect(this.store.dispatch).toHaveBeenCalledWith(notify({
                    type: NOTIFICATION.SUCCESS,
                    message: 'Copied to clipboard!'
                }));
            });
        });

        describe('onCopyCampaignIdError()', function() {
            beforeEach(function() {
                this.store.dispatch.calls.reset();

                this.modal.props().onCopyCampaignIdError();
            });

            it('should show a notification', function() {
                expect(this.store.dispatch).toHaveBeenCalledWith(notify({
                    type: NOTIFICATION.WARNING,
                    message: 'Unable to copy.'
                }));
            });
        });
    });
});
