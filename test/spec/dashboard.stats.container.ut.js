import { renderIntoDocument, findAllInRenderedTree, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const proxyquire = require('proxyquire');

//const proxyquire = require('proxyquire');

fdescribe('Stats', function() {
    let statsActions;
    let Stats;
    let store, state;
    let props;
    let component;

    beforeEach(function() {
        statsActions = {
            loadPageData: jasmine.createSpy('loadPageData()')
                .and.callFake(require('../../src/actions/stats').loadPageData),
            __esModule: true
        };
        
        Stats = proxyquire('../../src/containers/Dashboard/Stats', {
            '../../actions/stats': statsActions
        }).default;
        state = {
            page: {
                'dashboard.stats': {
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
                <Stats {...props} />
            </Provider>
        ), component => component.constructor.name === 'Statistics')[0];
    });

    describe('rendering',function(){
        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should load the page data', function() {
            expect(statsActions.loadPageData).toHaveBeenCalledWith('foo');
            expect(store.dispatch).toHaveBeenCalledWith(
                statsActions.loadPageData.calls.mostRecent().returnValue
            );
        });
    });

});
