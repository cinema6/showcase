import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as searchActions from '../../actions/search';
import * as productWizardActions from '../../actions/product_wizard';
import * as paymentActions from '../../actions/payment';
import WizardSearch from '../../components/WizardSearch';
import WizardEditProduct from '../../components/WizardEditProduct';
import WizardEditTargeting from '../../components/WizardEditTargeting';
import WizardPlanInfoModal from '../../components/WizardPlanInfoModal';
import WizardConfirmationModal from '../../components/WizardConfirmationModal';
import AdPreview from '../../components/AdPreview';
import classnames from 'classnames';
import _, { pick, includes, assign, find } from 'lodash';
import { getValues as getFormValues } from 'redux-form';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import DocumentTitle from 'react-document-title';

const PREVIEW = {
    CARD_OPTIONS: {
        cardType: 'showcase-app',
        advanceInterval: 3,
    },
    PLACEMENT_OPTIONS: {
        type: 'mobile-card',
        branding: 'showcase-app--interstitial',
    },
    LOAD_DELAY: 3000,
};

class ProductWizard extends Component {
    constructor(...args) {
        super(...args);

        this.loadProduct = this.loadProduct.bind(this);
    }

    componentWillMount() {
        return this.props.loadData();
    }

    componentWillUnmount() {
        return this.props.wizardDestroyed();
    }

    getProductData() {
        const {
            productData,
            formValues,
        } = this.props;

        return productData && assign({}, productData, pick(formValues, [
            'name', 'description',
        ]));
    }

    getTargeting() {
        const {
            formValues,
        } = this.props;

        return pick(formValues, ['age', 'gender']);
    }

    loadProduct(product) {
        const {
            productSelected,
            goToStep,

            productData,
        } = this.props;

        if (product.uri === (productData && productData.uri)) {
            return goToStep(1);
        }

        return productSelected({ product });
    }

    render() {
        const {
            findApps,
            getClientToken,
            goToStep,
            createCampaign,
            previewLoaded: previewWasLoaded,
            collectPayment,

            onFinish,

            steps,
            productData,
            targeting,
            promotions,
            paymentPlans,
            paymentPlanId,

            page: { step, previewLoaded, checkingIfPaymentRequired },
        } = this.props;

        const promotionConfigs = _(promotions).map(`data[${paymentPlanId}]`);
        const freeViews = promotionConfigs.map('targetUsers').sum();
        const trialLength = promotionConfigs.map('trialLength').sum();

        return (<div className="container main-section">
            <DocumentTitle
                title={`Reelcontent Apps: ${
                    productData ? `Edit "${productData.name}"` : 'Add'
                }`}
            />
            <div className="row">
                <ul className="nav nav-pills nav-justified campaign-progressbar">
                    {[
                        'Search',
                        'Create',
                        'Target',
                        'Promote',
                    ].map((label, index) => <li
                        key={label}
                        className={classnames('progressbar-step', {
                            active: Math.min(step, steps.length - 1) === index,
                            disabled: step < index,
                            completed: step > index,
                        })}
                    >
                        <div className="text-center progressbar-step-stepnum">{label}</div>
                        <div className="progress-wrapper">
                            <div className="progress-bar" />
                        </div>
                        <button
                            className={classnames(
                                'progressbar-step-dot',
                                `${label.toLowerCase()}-icon`
                            )}
                            disabled={step < index}
                            onClick={() => goToStep(index)}
                        />
                    </li>).filter((node, index) => includes(steps, index))}
                </ul>
            </div>
            <br />
            <div className="row">
                {step > 0 && (
                    <div className="col-md-6 col-sm-6 col-xs-12 col-middle text-center">
                        <AdPreview
                            placementOptions={PREVIEW.PLACEMENT_OPTIONS}
                            cardOptions={assign({}, PREVIEW.CARD_OPTIONS, {
                                description: previewLoaded ? {
                                    show: true,
                                    autoHide: 3,
                                } : {
                                    show: false,
                                },
                            })}
                            productData={this.getProductData()}
                            factory={createInterstitialFactory}
                            showLoadingAnimation={!previewLoaded}
                            loadDelay={previewLoaded ? 0 : PREVIEW.LOAD_DELAY}
                            onLoadComplete={() => previewWasLoaded()}
                        />
                    </div>
                )}
                {(() => {
                    switch (step) {
                    case 0:
                        return (<WizardSearch
                            findProducts={findApps}
                            onProductSelected={this.loadProduct}
                        />);
                    case 1:
                        return (<WizardEditProduct
                            productData={productData}
                            onFinish={() => goToStep(2)}
                        />);
                    case 2:
                    case 4:
                        return (<WizardEditTargeting
                            targeting={targeting}
                            categories={(productData && productData.categories) || []}
                            onFinish={() => onFinish({
                                targeting: this.getTargeting(),
                                productData: this.getProductData(),
                            })}
                        />);
                    default:
                        return undefined;
                    }
                })()}
            </div>
            <WizardPlanInfoModal
                show={step === 3}
                actionPending={checkingIfPaymentRequired}
                onClose={() => goToStep(2)}
                onContinue={selectedPlanId => collectPayment({
                    productData: this.getProductData(),
                    targeting: this.getTargeting(),
                    paymentPlan: find(paymentPlans, { id: selectedPlanId }),
                })}
                trialLength={trialLength}
                freeViews={freeViews}
                plans={paymentPlans}
            />
            {step === 4 && (
                <WizardConfirmationModal
                    freeViews={freeViews}
                    getToken={getClientToken}
                    handleClose={() => goToStep(2)}
                    onSubmit={payment => createCampaign({
                        payment,
                        productData: this.getProductData(),
                        targeting: this.getTargeting(),
                    })}
                />
            )}
        </div>);
    }
}

ProductWizard.propTypes = {
    findApps: PropTypes.func.isRequired,
    productSelected: PropTypes.func.isRequired,
    goToStep: PropTypes.func.isRequired,
    wizardDestroyed: PropTypes.func.isRequired,
    getClientToken: PropTypes.func.isRequired,
    createCampaign: PropTypes.func.isRequired,
    previewLoaded: PropTypes.func.isRequired,
    collectPayment: PropTypes.func.isRequired,

    formValues: PropTypes.object,

    page: PropTypes.shape({
        step: PropTypes.number.isRequired,
        previewLoaded: PropTypes.bool.isRequired,
    }).isRequired,

    loadData: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,

    steps: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    productData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }),
    targeting: PropTypes.shape({
        gender: PropTypes.string,
        age: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }),
    promotions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired),
    paymentPlans: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
    })),
    paymentPlanId: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        formValues: getFormValues(state.form.productWizard),
    };
}

export default connect(mapStateToProps, assign(
    {},
    searchActions,
    productWizardActions,
    paymentActions
))(ProductWizard);
