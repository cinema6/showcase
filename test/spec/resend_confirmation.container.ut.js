'use strict';

import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import ResendConfirmation from '../../src/containers/ResendConfirmation';
import { createStore } from 'redux';
import { resendConfirmationEmail } from '../../src/actions/user';
import { Provider } from 'react-redux';
import defer from 'promise-defer';
import { cloneDeep as clone } from 'lodash';

const proxyquire = require('proxyquire');

describe('ResendConfirmation', function() {
    let userActions;
    let ResendConfirmation;

    beforeEach(function() {
        userActions = {
            resendConfirmationEmail: jasmine.createSpy('resendConfirmationEmail()').and.callFake(resendConfirmationEmail),

            __esModule: true
        };

        ResendConfirmation = proxyquire('../../src/containers/ResendConfirmation', {
            'react': React,

            '../actions/user': userActions
        }).default;
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            state = {
                page: {
                    resend_confirmation: {
                        sending: false,
                        success: false,
                        error: null
                    }
                }
            };
            store = createStore(() => clone(state));
            spyOn(store, 'dispatch').and.callThrough();

            props = {
                children: <div />
            };

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <ResendConfirmation {...props} />
                </Provider>
            ), ResendConfirmation.WrappedComponent.WrappedComponent);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should be a page', function() {
            expect(component.props.page).toEqual(state.page.resend_confirmation);
        });

        describe('dispatch props', function() {
            let dispatchDeferred;

            beforeEach(function() {
                store.dispatch.and.returnValue((dispatchDeferred = defer()).promise);
            });

            describe('resendConfirmationEmail()', function() {
                let result;

                beforeEach(function() {
                    result = component.props.resendConfirmationEmail();
                });

                it('should dispatch the resendConfirmationEmail action', function() {
                    expect(userActions.resendConfirmationEmail).toHaveBeenCalledWith();
                    expect(store.dispatch).toHaveBeenCalledWith(userActions.resendConfirmationEmail.calls.mostRecent().returnValue);
                    expect(result).toBe(dispatchDeferred.promise);
                });
            });
        });
    });
});
