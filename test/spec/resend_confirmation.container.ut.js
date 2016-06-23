'use strict';

import { mount } from 'enzyme';
import React from 'react';
import ResendConfirmation from '../../src/containers/ResendConfirmation';
import { createStore } from 'redux';
import { resendConfirmationEmail } from '../../src/actions/user';
import { Provider } from 'react-redux';
import { cloneDeep as clone } from 'lodash';
import { logoutUser } from '../../src/actions/dashboard';

describe('ResendConfirmation', function() {
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

            component = mount(
                <Provider store={store}>
                    <ResendConfirmation {...props} />
                </Provider>
            ).find(ResendConfirmation.WrappedComponent.WrappedComponent);

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should be a page', function() {
            expect(component.props().page).toEqual(state.page.resend_confirmation);
        });

        describe('when the resend confirmation email button is clicked', function() {
            beforeEach(function() {
                this.button = component.find('.btn-primary');

                this.button.simulate('click');
            });

            it('should dispatch the resendConfirmationEmail action', function() {
                expect(store.dispatch).toHaveBeenCalledWith(resendConfirmationEmail());
            });
        });

        describe('when the logout button is clicked', function() {
            beforeEach(function() {
                this.button = component.find('.btn-link');

                this.button.simulate('click');
            });

            it('should logout the user', function() {
                expect(store.dispatch).toHaveBeenCalledWith(logoutUser());
            });
        });
    });
});
