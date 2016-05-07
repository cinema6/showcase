import { renderIntoDocument, findAllInRenderedTree, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const proxyquire = require('proxyquire');

fdescribe('Campaign Detail', function() {
    let campaignDetailActions;
    let CampaignDetail;
    let store, state;
    let props;
    let component;

    beforeEach(function() {
        campaignDetailActions = {
            loadPageData: jasmine.createSpy('loadPageData()')
                .and.callFake(require('../../src/actions/campaign_detail').loadPageData),
            __esModule: true
        };
        
        CampaignDetail =
            proxyquire('../../src/containers/Dashboard/CampaignDetail', {
            '../../actions/campaign_detail': campaignDetailActions
        }).default;
        state = {
            page: {
                'dashboard.campaign_detail': {
                    loading: false,
                    analyticsError : null
                }
            }
        };
        
        store = createStore(() => state);
        props = { params : { campaignId : 'foo' } };

        spyOn(store, 'dispatch');

        component = findAllInRenderedTree(renderIntoDocument(
            <Provider store={store}>
                <CampaignDetail {...props} />
            </Provider>
        ), component => component.constructor.name === 'CampaignDetail')[0];
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
    });

});
