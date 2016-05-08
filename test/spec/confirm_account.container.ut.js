import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import React from 'react';
import { createUuid } from 'rc-uuid';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { confirmAccount } from '../../src/actions/confirm_account';

const proxyquire = require('proxyquire');

describe('ConfirmAccount', function() {
    let confirmAccountActions;
    let ConfirmAccount;

    beforeEach(function() {
        confirmAccountActions = {
            confirmAccount: jasmine.createSpy('confirmAccount()').and.callFake(confirmAccount),

            __esModule: true
        };

        ConfirmAccount = proxyquire('../../src/containers/ConfirmAccount', {
            '../actions/confirm_account': confirmAccountActions
        }).default;
    });

    describe('when rendered', function() {
        let store, state;
        let props;
        let component;

        beforeEach(function() {
            state = {

            };
            store = createStore(() => state);

            props = {
                location: {
                    query: {
                        id: `u-${createUuid()}`,
                        token: createUuid()
                    }
                }
            };

            spyOn(store, 'dispatch');

            component = findRenderedComponentWithType(renderIntoDocument(
                <Provider store={store}>
                    <ConfirmAccount {...props} />
                </Provider>
            ), ConfirmAccount.WrappedComponent);
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should confirm the user\'s account', function() {
            expect(confirmAccountActions.confirmAccount).toHaveBeenCalledWith({ id: props.location.query.id, token: props.location.query.token });
            expect(store.dispatch).toHaveBeenCalledWith(confirmAccountActions.confirmAccount.calls.mostRecent().returnValue);
        });
    });
});
