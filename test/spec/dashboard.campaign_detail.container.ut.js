import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CampaignDetailBar from '../../src/components/CampaignDetailBar';
import {
    loadPageData,
    removeCampaign,
    showInstallTrackingInstructions
} from '../../src/actions/campaign_detail';
import {
    notify
} from '../../src/actions/notification';
import InstallTrackingSetupModal from '../../src/components/InstallTrackingSetupModal';
import { TYPE as NOTIFICATION } from '../../src/enums/notification';

const proxyquire = require('proxyquire');

describe('Campaign Detail', function() {
    let campaignDetailActions, notificationActions;
    let CampaignDetail;
    let store, state;
    let props;
    let component;

    beforeEach(function() {
        notificationActions = {
            notify: jasmine.createSpy('notify()').and.callFake(notify),

            __esModule: true
        };

        campaignDetailActions = {
            loadPageData: jasmine.createSpy('loadPageData()').and.callFake(loadPageData),
            removeCampaign: jasmine.createSpy('removeCampaign()').and.callFake(removeCampaign),
            showInstallTrackingInstructions: jasmine.createSpy('showInstallTrackingInstructions()').and.callFake(showInstallTrackingInstructions),

            __esModule: true
        };

        CampaignDetail = proxyquire('../../src/containers/Dashboard/CampaignDetail', {
            'react' : React,

            '../../actions/campaign_detail': campaignDetailActions,
            '../../actions/notification': notificationActions,
            '../../components/CampaignDetailBar': {
                default: CampaignDetailBar,

                __esModule: true
            },
            '../../components/InstallTrackingSetupModal': {
                default: InstallTrackingSetupModal,

                __esModule: true
            }
        }).default;

        state = {
            analytics: {
                results : {
                    'foo' : {}
                },
                lastError : null
            },
            db : {
                campaign : {
                    'foo' : {
                        id: 'foo'
                    }
                }
            },
            page: {
                'dashboard.campaign_detail': {
                    loading: true,
                    showInstallTrackingInstructions: false
                }
            }
        };

        store = createStore(() => state);
        props = { params : { campaignId : 'foo' } };

        spyOn(store, 'dispatch');

        component = findRenderedComponentWithType(renderIntoDocument(
            <Provider store={store}>
                <CampaignDetail {...props} />
            </Provider>
        ), CampaignDetail.WrappedComponent.WrappedComponent);
    });

    describe('rendering',function(){
        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should load the page data', function() {
            expect(campaignDetailActions.loadPageData).toHaveBeenCalledWith('foo');
            expect(store.dispatch).toHaveBeenCalledWith(
                campaignDetailActions.loadPageData.calls.mostRecent().returnValue
            );
        });

        it('should properly map state',function(){
            expect(component.props.campaign).toBe(state.db.campaign.foo);
            expect(component.props.analytics).toBe(state.analytics.results.foo);
        });

        describe('the CampaignDetailBar', function() {
            let bar;

            beforeEach(function() {
                bar = findRenderedComponentWithType(component, CampaignDetailBar);
            });

            it('should exist', function() {
                expect(bar).toEqual(jasmine.any(Object));
            });

            describe('onDeleteCampaign()', function() {
                beforeEach(function() {
                    store.dispatch.calls.reset();

                    bar.props.onDeleteCampaign();
                });

                it('should call removeCampaign()', function() {
                    expect(campaignDetailActions.removeCampaign).toHaveBeenCalledWith(component.props.campaign.id);
                    expect(store.dispatch).toHaveBeenCalledWith(campaignDetailActions.removeCampaign.calls.mostRecent().returnValue);
                });
            });

            describe('onShowInstallTrackingInstructions()', function() {
                beforeEach(function() {
                    store.dispatch.calls.reset();

                    bar.props.onShowInstallTrackingInstructions();
                });

                it('should call dispatch showInstallTrackingInstructions(false)', function() {
                    expect(campaignDetailActions.showInstallTrackingInstructions).toHaveBeenCalledWith(true);
                    expect(store.dispatch).toHaveBeenCalledWith(campaignDetailActions.showInstallTrackingInstructions.calls.mostRecent().returnValue);
                });
            });
        });

        describe('the InstallTrackingSetupModal', function() {
            let modal;

            beforeEach(function() {
                modal = findRenderedComponentWithType(component, InstallTrackingSetupModal);
            });

            it('should exist', function() {
                expect(modal).toEqual(jasmine.any(Object));
            });

            it('should pass the show property', function() {
                expect(modal.props.show).toBe(component.props.page.showInstallTrackingInstructions);
            });

            it('should pass the campaignId', function() {
                expect(modal.props.campaignId).toBe(component.props.campaign.id);
            });

            describe('onClose()', function() {
                beforeEach(function() {
                    store.dispatch.calls.reset();

                    modal.props.onClose();
                });

                it('should call dispatch showInstallTrackingInstructions(false)', function() {
                    expect(campaignDetailActions.showInstallTrackingInstructions).toHaveBeenCalledWith(false);
                    expect(store.dispatch).toHaveBeenCalledWith(campaignDetailActions.showInstallTrackingInstructions.calls.mostRecent().returnValue);
                });
            });

            describe('onCopyCampaignIdSuccess()', function() {
                beforeEach(function() {
                    store.dispatch.calls.reset();

                    modal.props.onCopyCampaignIdSuccess();
                });

                it('should show a notification', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION.SUCCESS,
                        message: 'Copied to clipboard!'
                    });
                    expect(store.dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                });
            });

            describe('onCopyCampaignIdError()', function() {
                beforeEach(function() {
                    store.dispatch.calls.reset();

                    modal.props.onCopyCampaignIdError();
                });

                it('should show a notification', function() {
                    expect(notificationActions.notify).toHaveBeenCalledWith({
                        type: NOTIFICATION.WARNING,
                        message: 'Unable to copy.'
                    });
                    expect(store.dispatch).toHaveBeenCalledWith(notificationActions.notify.calls.mostRecent().returnValue);
                });
            });
        });
    });
});
