import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CampaignDetailBar from '../../src/components/CampaignDetailBar';
import {
    loadPageData,
    removeCampaign
} from '../../src/actions/campaign_detail';

const proxyquire = require('proxyquire');

describe('Campaign Detail', function() {
    let campaignDetailActions;
    let CampaignDetail;
    let store, state;
    let props;
    let component;

    beforeEach(function() {
        campaignDetailActions = {
            loadPageData: jasmine.createSpy('loadPageData()').and.callFake(loadPageData),
            removeCampaign: jasmine.createSpy('removeCampaign()').and.callFake(removeCampaign),

            __esModule: true
        };

        CampaignDetail = proxyquire('../../src/containers/Dashboard/CampaignDetail', {
            'react' : React,

            '../../actions/campaign_detail': campaignDetailActions,
            '../../components/CampaignDetailBar': {
                default: CampaignDetailBar,

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
                    loading: true
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
        });
    });
});
