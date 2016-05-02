import React, { Component, PropTypes } from 'react';
import braintree from 'braintree-web';
import { assign } from 'lodash';
import classnames from 'classnames';
import { createUuid } from 'rc-uuid';

const HOSTED_FIELDS = ['number', 'cvv', 'expirationDate', 'postalCode'];

export default class BraintreeCreditCardForm extends Component {
    constructor() {
        super(...arguments);

        this.id = createUuid();

        this.state = {
            braintree: null,

            loading: true,
            error: null,
            submitting: false,

            cardholderName: '',

            hostedFieldState: HOSTED_FIELDS.reduce((hostedFieldState, field) => {
                hostedFieldState[field] = {
                    focused: false, empty: true, valid: false, potentiallyValid: true
                };
                return hostedFieldState;
            }, {})
        };
    }

    getHostedFieldClassNames(field) {
        const state = this.state.hostedFieldState[field];

        return classnames({
            'cc_field--focused': state.focused,
            'cc_field--empty': state.empty,
            'cc_field--valid': state.valid,
            'cc_field--potentiallyValid': state.potentiallyValid
        });
    }

    isValid() {
        const {
            hostedFieldState,
            cardholderName
        } = this.state;

        return Object.keys(hostedFieldState).every(field => hostedFieldState[field].valid) &&
            !!cardholderName;
    }

    componentDidMount() {
        const {
            id
        } = this;

        return this.props.getToken()
            .then(({ clientToken }) => braintree.setup(clientToken, 'custom', {
                id: id,
                onReady: api => this.setState({ loading: false, braintree: api }),
                hostedFields: HOSTED_FIELDS.reduce((hostedFields, field) => {
                    hostedFields[field] = {
                        selector: `[data-braintree="${id}_${field}"]`
                    };
                    return hostedFields;
                }, {
                    onFieldEvent: ({
                        isEmtpy,
                        isFocused,
                        isPotentiallyValid,
                        isValid,
                        target: { fieldKey }
                    }) => this.setState({
                        error: null,

                        hostedFieldState: assign({}, this.state.hostedFieldState, {
                            [fieldKey]: {
                                empty: isEmtpy,
                                focused: isFocused,
                                potentiallyValid: isPotentiallyValid,
                                valid: isValid
                            }
                        })
                    })
                }),
                onError: ({ message }) => this.setState({
                    loading: false,
                    submitting: false,
                    error: message
                }),
                onPaymentMethodReceived: method => this.props.onSubmit(assign({}, method, {
                    cardholderName: this.state.cardholderName
                })).then(() => this.setState({ submitting: false })).catch(reason => this.setState({
                    submitting: false,
                    error: reason.message
                })),
                paypal: {
                    container: this.refs.paypal,
                    headless: true,
                    onSuccess: (nonce, email) => {
                        this.setState({ submitting: true });

                        return this.props.onSubmit({ nonce, email })
                            .then(() => this.setState({ submitting: false }))
                            .catch(reason => this.setState({
                                submitting: false,
                                error: reason.message
                            }));
                    }
                }
            }));
    }

    render() {
        const {
            id
        } = this;
        const {
            submitting,
            error,
            loading,
            braintree
        } = this.state;

        return (
            <form id={id} onSubmit={() => this.setState({ submitting: true })}>
                {loading && (<div>Loading!</div>)}

                <button ref="paypal" disabled={!braintree}
                    onClick={event => {
                        event.preventDefault();
                        braintree.paypal.initAuthFlow();
                    }}>
                    Pay with PayPal
                </button>

                <fieldset>
                    <label>Cardholder Name</label>
                    <input type="text"
                        onChange={({ target }) => this.setState({ cardholderName: target.value })}
                        data-test="cardholderName" />
                </fieldset>
                <fieldset>
                    <label>Card Number</label>
                    <div data-braintree={`${id}_number`}
                        className={this.getHostedFieldClassNames('number')}>
                    </div>
                </fieldset>
                <fieldset>
                    <label>CVV</label>
                    <div data-braintree={`${id}_cvv`}
                        className={this.getHostedFieldClassNames('cvv')}>
                    </div>
                </fieldset>
                <fieldset>
                    <label>Expiration</label>
                    <div data-braintree={`${id}_expirationDate`}
                        className={this.getHostedFieldClassNames('expirationDate')}>
                    </div>
                </fieldset>
                <fieldset>
                    <label>Zip Code</label>
                    <div data-braintree={`${id}_postalCode`}
                        className={this.getHostedFieldClassNames('postalCode')}>
                    </div>
                </fieldset>

                {error && (<div>{error}</div>)}

                <button disabled={!this.isValid() || submitting || error}
                    type="submit">
                    Submit
                </button>
            </form>
        );
    }
}

BraintreeCreditCardForm.propTypes = {
    getToken: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
