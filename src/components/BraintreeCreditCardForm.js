import React, { Component, PropTypes } from 'react';
import braintree from 'braintree-web';
import { assign } from 'lodash';
import classnames from 'classnames';
import { createUuid } from 'rc-uuid';

const HOSTED_FIELDS = ['number', 'cvv', 'expirationDate', 'postalCode'];
const PAYMENT_TYPE = {
    CREDIT_CARD: 'CREDIT_CARD',
    PAYPAL: 'PAYPAL'
};

export default class BraintreeCreditCardForm extends Component {
    constructor() {
        super(...arguments);

        this.id = createUuid();

        this.state = {
            braintree: null,

            loading: true,
            error: null,
            submitting: false,
            type: PAYMENT_TYPE.CREDIT_CARD,

            cardholderName: '',

            hostedFieldState: HOSTED_FIELDS.reduce((hostedFieldState, field) => {
                hostedFieldState[field] = {
                    focused: false, empty: true, valid: false, potentiallyValid: true
                };
                return hostedFieldState;
            }, {})
        };
    }

    getHostedFieldClassNames(field, ...rest) {
        const state = this.state.hostedFieldState[field];

        return classnames({
            'cc_field--focused': state.focused,
            'cc_field--empty': state.empty,
            'cc_field--valid': state.valid,
            'cc_field--potentiallyValid': state.potentiallyValid
        }, ...rest);
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
                    hostedFields[field] = assign({
                        selector: `[data-braintree="${id}_${field}"]`
                    }, hostedFields[field]);
                    return hostedFields;
                }, {
                    number: {
                        placeholder: 'Card Number'
                    },
                    expirationDate: {
                        placeholder: 'Expiration (MM/YY)'
                    },
                    cvv: {
                        placeholder: 'CVV'
                    },
                    postalCode: {
                        placeholder: 'Zip Code'
                    },
                    styles: {
                        '.number': {
                            'color': '#555555',
                            'font-family': 'sans-serif',
                            'font-size': '18px',
                            'height': '40px',
                            'line-height': '40px'
                        },
                        '.expirationDate': {
                            'color': '#555555',
                            'font-family': 'sans-serif',
                            'font-size': '18px',
                            'height': '40px',
                            'line-height': '40px'
                        },
                        '.cvv': {
                            'color': '#555555',
                            'font-family': 'sans-serif',
                            'font-size': '18px',
                            'height': '40px',
                            'line-height': '40px'
                        },
                        '.postalCode': {
                            'color': '#555555',
                            'font-family': 'sans-serif',
                            'font-size': '18px',
                            'height': '40px',
                            'line-height': '40px'
                        }
                    },
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
                onPaymentMethodReceived: method => {
                    this.setState({ submitting: true });

                    return this.props.onSubmit(assign({}, method, {
                        cardholderName: this.state.cardholderName
                    })).then(() => this.setState({
                        submitting: false
                    })).catch(reason => this.setState({
                        submitting: false,
                        error: reason.message
                    }));
                },
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
            braintree,
            type
        } = this.state;
        const {
            submitText
        } = this.props;

        return (<div>
            {loading && (<div className="spinner-wrap">
                <div className="spinner-position">
                    <div className="animation-target">
                    </div>
                </div>
            </div>)}
            <div className="payment-options">
                <div className="btn-group" data-toggle="buttons">
                    <label className={classnames('btn btn-default', {
                        active: type === PAYMENT_TYPE.CREDIT_CARD
                    })}>
                        <input type="radio"
                            name="options"
                            autoComplete="off"
                            checked={type === PAYMENT_TYPE.CREDIT_CARD}
                            onChange={() => this.setState({
                                type: PAYMENT_TYPE.CREDIT_CARD
                            })} />
                        Credit Card
                    </label>
                    <label className={classnames('btn btn-default', {
                        active: type === PAYMENT_TYPE.PAYPAL
                    })}>
                        <input type="radio"
                            name="options"
                            autoComplete="off"
                            checked={type === PAYMENT_TYPE.PAYPAL}
                            onChange={() => this.setState({
                                type: PAYMENT_TYPE.PAYPAL
                            })} />
                        PayPal
                    </label>
                </div>
            </div>
            <div className="paymentType-details col-md-10 col-md-offset-1">
                {/* credit card payment form */}
                <br />
                <form id={id}
                    onSubmit={() => this.setState({ submitting: true })}
                    className={classnames({
                        hidden: type !== PAYMENT_TYPE.CREDIT_CARD
                    })}>
                    <div className="form-group">
                    {/*<!--<label htmlFor="cardholderName-input">Name On Card</label>*/}
                        <input type="text"
                            id="cardholderName-input" placeholder="Name On Card"
                            className="form-control"
                            onChange={({ target }) => this.setState({
                                cardholderName: target.value
                            })}
                            data-test="cardholderName" />
                    </div>
                    <div className="form-group">
                    {/*<label htmlFor="cardNumber-input">Card Number</label>*/}
                        <div id="cardNumber-input" placeholder="Card Number"
                            data-braintree={`${id}_number`}
                            className={this.getHostedFieldClassNames('number', 'form-control')}>
                        </div>
                    </div>
                    <div className="form-group">
                    {/*<label htmlFor="cardExpiration-input">Expiration</label>*/}
                        <div id="cardExpiration-input"
                            data-braintree={`${id}_expirationDate`}
                            className={this.getHostedFieldClassNames(
                                'expirationDate', 'form-control'
                            )}>
                        </div>
                    </div>
                    <div className="form-group">
                    {/*<label htmlFor="cardCVV-input">CVV</label>*/}
                        <div id="cardCVV-input"
                            data-braintree={`${id}_cvv`}
                            className={this.getHostedFieldClassNames(
                                'cvv', 'form-control'
                            )}>
                        </div>
                    </div>
                    <div className="form-group">
                    {/*<label htmlFor="cardZip-input">Zip Code</label>*/}
                        <div id="cardZip-input"
                            data-braintree={`${id}_postalCode`}
                            className={this.getHostedFieldClassNames(
                                'postalCode', 'form-control'
                            )}>
                        </div>
                    </div>
                    <button type="submit"
                        disabled={!this.isValid() || submitting || error}
                        className={classnames(
                            'col-md-12 col-xs-12 btn btn-danger btn-lg pull-right', {
                                'btn-waiting': submitting
                            }
                        )}>
                        {submitText}
                    </button>
                </form>
                {/* paypal payment form */}
                <div data-test="paypal"
                    className={classnames({
                        hidden: type !== PAYMENT_TYPE.PAYPAL
                    })}>
                    <div className="form-group">
                        <h4>
                            You will be redirected to PayPal to complete the payment process
                        </h4>
                        <br />
                        <button ref="paypal"
                            disabled={!braintree || submitting}
                            onClick={event => {
                                event.preventDefault();
                                braintree.paypal.initAuthFlow();
                            }}
                            className={classnames(
                                'col-md-12 col-xs-12 btn btn-danger btn-lg pull-right', {
                                    'btn-waiting': submitting
                                }
                            )}>
                            {submitText}
                        </button>
                    </div>
                </div>
            </div>
        </div>);
    }
}

BraintreeCreditCardForm.propTypes = {
    getToken: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string.isRequired
};
BraintreeCreditCardForm.defaultProps = {
    submitText: 'Submit'
};
