import CampaignDetail from '../../src/containers/Dashboard/CampaignDetail';
import { mount } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { createUuid } from 'rc-uuid';
import {
    loadPageData,
    showInstallTrackingInstructions,
    removeCampaign,
    updateChartSelection
} from '../../src/actions/campaign_detail';
import {
    notify
} from '../../src/actions/notification';
import { CHART_7DAY, CHART_30DAY } from '../../src/components/CampaignDetailStatsDetails';
import InstallTrackingSetupModal from '../../src/components/InstallTrackingSetupModal';
import { TYPE as NOTIFICATION } from '../../src/enums/notification';
import CampaignDetailInfo from '../../src/components/CampaignDetailInfo';
import _, { find, assign } from 'lodash';
import CampaignDetailStatsOverview from '../../src/components/CampaignDetailStatsOverview';
import moment from 'moment';
import config from '../../config';
import { estimateImpressions } from '../../src/utils/billing';
import AdPreview from '../../src/components/AdPreview';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import { productDataFromCampaign } from '../../src/utils/campaign';
import CampaignDetailStatsDetails from '../../src/components/CampaignDetailStatsDetails';

describe('CampaignDetail', function() {
    beforeEach(function() {
        this.campaign = {
            id: `cam-${createUuid()}`,
            name: 'My Awesome App',
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
            }
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
                    start: moment().format(),
                    end: moment().add(1, 'month').subtract(1, 'day').format()
                }
            }
        };
        this.props = {
            params: {
                campaignId: this.campaign.id
            }
        };
        this.store = createStore(() => this.state);

        spyOn(this.store, 'dispatch');

        this.wrapper = mount(
            <CampaignDetail {...this.props} />,
            { context: { store: this.store }, attachTo: document.createElement('div') }
        );
        this.component = this.wrapper.find(CampaignDetail.WrappedComponent.WrappedComponent);
    });

    it('should exist', function() {
        expect(this.component.length).toBe(1, 'CampaignDetail not rendered.');
    });

    it('should load the page data', function() {
        expect(this.store.dispatch).toHaveBeenCalledWith(loadPageData(this.campaign.id));
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

                this.info.prop('onReplace')();
            });

            it('should dispatch removeCampaign()', function() {
                expect(this.store.dispatch).toHaveBeenCalledWith(removeCampaign(this.campaign.id));
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
                targetViews: estimateImpressions({
                    start: moment(this.state.session.billingPeriod.start),
                    end: moment(this.state.session.billingPeriod.end),
                    viewsPerDay: config.paymentPlans[0].viewsPerDay
                })
            }));
            expect(billingPeriod.start.format()).toBe(this.state.session.billingPeriod.start);
            expect(billingPeriod.end.format()).toBe(this.state.session.billingPeriod.end);
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
        beforeEach(function() {
            this.store.dispatch.calls.reset();

            this.wrapper.setProps({ foo: 'bar' });
        });

        it('should not loadPageData()', function() {
            expect(this.store.dispatch).not.toHaveBeenCalledWith(loadPageData(this.campaign.id));
        });
    });

    describe('if the campaignId does change', function() {
        beforeEach(function() {
            this.store.dispatch.calls.reset();

            this.wrapper.setProps({ params: { campaignId: `cam-${createUuid()}` } });
        });

        it('should load the page data', function() {
            expect(this.store.dispatch).toHaveBeenCalledWith(loadPageData(this.wrapper.prop('params').campaignId));
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
