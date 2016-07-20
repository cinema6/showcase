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
import _, { pick, includes, assign } from 'lodash';
import { getValues as getFormValues } from 'redux-form';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import { getPaymentPlanStart } from 'showcase-core/dist/billing';
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
            paymentPlanId,

            page: { step, previewLoaded, checkingIfPaymentRequired },
        } = this.props;

        const promotionConfigs = _(promotions).map(`data[${paymentPlanId}]`);

        return (<div className="container main-section">
            <DocumentTitle
                title={`Reelcontent Apps: ${
                    productData ? `Edit "${productData.name}"` : 'Add'
                }`}
            />
            {/*<div className="row">
                <div className="campaign-progressbar col-md-12 col-sm-12 col-xs-12">
                    <ul className="nav nav-pills nav-justified">
                        {includes(steps, 0) && (<li
                            className={classnames('progressbar-step-1', {
                                active: step >= 0,
                            })}
                        >
                            <button onClick={() => goToStep(0)}>
                                <h3>
                                    <i className="fa fa-search" />
                                    <span className="sr-only">Search</span>
                                </h3>
                                Search
                            </button>
                        </li>)}
                        {includes(steps, 1) && (<li
                            className={classnames('progressbar-step-2', {
                                active: step >= 1,
                            })}
                        >
                            <button
                                disabled={step < 2}
                                onClick={() => goToStep(1)}
                            >
                                <h3>
                                    <i className="fa fa-pencil-square-o" />
                                    <span className="sr-only">Create</span>
                                </h3>
                                Create
                            </button>
                        </li>)}
                        {includes(steps, 2) && (<li
                            className={classnames('progressbar-step-3', {
                                active: step >= 2,
                            })}
                        >
                            <button
                                disabled={step < 3}
                                onClick={() => goToStep(2)}
                            >
                                <h3>
                                    <i className="fa fa-bullseye" />
                                    <span className="sr-only">Target</span>
                                </h3>
                                Target
                            </button>
                        </li>)}
                        {includes(steps, 3) && (<li
                            className={classnames('progressbar-step-4', {
                                active: step >= 3,
                            })}
                        >
                            <button
                                disabled={step < 4}
                                onClick={() => goToStep(3)}
                            >
                                <h3>
                                    <i className="fa fa-paper-plane-o" />
                                    <span className="sr-only">Promote</span>
                                </h3>
                                Promote
                            </button>
                        </li>)}
                    </ul>
                </div>
            </div>*/}
            <div className="row">
                <ul className="nav nav-pills nav-justified campaign-progressbar">
                    <li className="progressbar-step completed">{/*Add "completed" class for the 
                    completed steps*/}
                        <div className="text-center progressbar-step-stepnum">Search</div>
                        <div className="progress-wrapper">
                        <div className="progress-bar" /></div>
                        <a href="#" className="progressbar-step-dot search-icon" />              
                    </li>
                    <li className="progressbar-step active disabled">{/*Add "active" and "disabled"
                    class for the current progress step*/}
                        <div className="text-center progressbar-step-stepnum">Create</div>
                        <div className="progress-wrapper">
                        <div className="progress-bar" /></div>
                        <a href="#" className="progressbar-step-dot create-icon" /> 
                    </li>
                    <li className="progressbar-step disabled">{/*Add "disabled" class when 
                    progress step hasn't been filled*/}
                        <div className="text-center progressbar-step-stepnum">Target</div>
                        <div className="progress-wrapper">
                        <div className="progress-bar" /></div>
                        <a href="#" className="progressbar-step-dot target-icon" />
                    </li>
                    <li className="progressbar-step disabled">
                        <div className="text-center progressbar-step-stepnum">Promote</div>
                        <div className="progress-wrapper">
                        <div className="progress-bar" /></div>
                        <a href="#" className="progressbar-step-dot promote-icon" />
                    </li>
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
                onContinue={() => collectPayment({
                    productData: this.getProductData(),
                    targeting: this.getTargeting(),
                })}
                trialLength={promotionConfigs.map('trialLength').sum()}
                freeViews={promotionConfigs.map('targetUsers').sum()}
            />
            {step === 4 && (
                <WizardConfirmationModal
                    startDate={promotions && getPaymentPlanStart(promotions)}
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
