'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findApps } from '../../actions/search';
import {
    productSelected,
    goToStep,
    wizardDestroyed,
    createCampaign,
    previewLoaded
} from '../../actions/product_wizard';
import { getClientToken } from'../../actions/payment';
import WizardSearch from '../../components/WizardSearch';
import WizardEditProduct from '../../components/WizardEditProduct';
import WizardEditTargeting from '../../components/WizardEditTargeting';
import WizardPlanInfoModal from '../../components/WizardPlanInfoModal';
import WizardConfirmationModal from '../../components/WizardConfirmationModal';
import AdPreview from '../../components/AdPreview';
import classnames from 'classnames';
import { pick, includes, assign } from 'lodash';
import { getValues as getFormValues } from 'redux-form';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';
import { getPaymentPlanStart } from 'showcase-core/dist/billing';

const PREVIEW = {
    CARD_OPTIONS: {
        cardType: 'showcase-app'
    },
    PLACEMENT_OPTIONS: {
        type: 'mobile-card',
        branding: 'showcase-app--interstitial'
    },
    LOAD_DELAY: 12500
};

class ProductWizard extends Component {
    constructor() {
        super(...arguments);

        this.loadProduct = this.loadProduct.bind(this);
    }

    componentWillMount() {
        return this.props.loadData();
    }

    loadProduct(product) {
        const {
            productSelected,
            goToStep,

            productData
        } = this.props;

        if (product.uri === (productData && productData.uri)) {
            return goToStep(1);
        }

        return productSelected({ product });
    }

    componentWillUnmount() {
        return this.props.wizardDestroyed();
    }

    render() {
        const {
            findApps,
            getClientToken,
            goToStep,
            createCampaign,
            previewLoaded: previewWasLoaded,

            onFinish,

            steps,
            productData,
            targeting,
            formValues,
            promotions,

            page: { step, previewLoaded }
        } = this.props;

        return (<div className="container main-section">
            <div className="row">
                <div className="campaign-progressbar col-md-12 col-sm-12 col-xs-12">
                    <ul className="nav nav-pills nav-justified">
                        {includes(steps, 0) && (<li className={classnames('progressbar-step-1', {
                            active: step >= 0
                        })}>
                            <button onClick={() => goToStep(0)}>
                                <h3>
                                    <i className="fa fa-search" />
                                    <span className="sr-only">Search</span>
                                </h3>
                                Search
                            </button>
                        </li>)}
                        {includes(steps, 1) && (<li className={classnames('progressbar-step-2', {
                            active: step >= 1
                        })}>
                            <button disabled={step < 2}
                                onClick={() => goToStep(1)}>
                                <h3>
                                    <i className="fa fa-pencil-square-o" />
                                    <span className="sr-only">Create</span>
                                </h3>
                                Create
                            </button>
                        </li>)}
                        {includes(steps, 2) && (<li className={classnames('progressbar-step-3', {
                            active: step >= 2
                        })}>
                            <button disabled={step < 3}
                                onClick={() => goToStep(2)}>
                                <h3>
                                    <i className="fa fa-bullseye" />
                                    <span className="sr-only">Target</span>
                                </h3>
                                Target
                            </button>
                        </li>)}
                        {includes(steps, 3) && (<li className={classnames('progressbar-step-4', {
                            active: step >= 3
                        })}>
                            <button disabled={step < 4}
                                onClick={() => goToStep(3)}>
                                <h3>
                                    <i className="fa fa-paper-plane-o" />
                                    <span className="sr-only">Promote</span>
                                </h3>
                                Promote
                            </button>
                        </li>)}
                    </ul>
                </div>
            </div>
            <br />
            <div className="row">
                {step > 0 && (
                    <AdPreview cardOptions={PREVIEW.CARD_OPTIONS}
                        placementOptions={PREVIEW.PLACEMENT_OPTIONS}
                        productData={productData && assign({}, productData, pick(formValues, [
                            'name', 'description'
                        ]))}
                        factory={createInterstitialFactory}
                        showLoadingAnimation={!previewLoaded}
                        loadDelay={previewLoaded ? 0 : PREVIEW.LOAD_DELAY}
                        onLoadComplete={() => previewWasLoaded()} />
                )}
                {(() => {
                    switch (step) {
                    case 0:
                        return <WizardSearch findProducts={findApps}
                            onProductSelected={this.loadProduct}/>;
                    case 1:
                        return <WizardEditProduct productData={productData}
                            onFinish={() => goToStep(2)} />;
                    case 2:
                    case 4:
                        return <WizardEditTargeting targeting={targeting}
                            categories={(productData && productData.categories) || []}
                            onFinish={values => onFinish({
                                targeting: pick(values, ['age', 'gender']),
                                productData: pick(values, ['name', 'description'])
                            })} />;
                    }
                })()}
            </div>
            <WizardPlanInfoModal show={step === 3}
                onClose={() => goToStep(2)}
                onContinue={() => goToStep(4)} />
            {step === 4 && (
                <WizardConfirmationModal startDate={promotions && getPaymentPlanStart(promotions)}
                    getToken={getClientToken}
                    handleClose={() => goToStep(2)}
                    onSubmit={payment => createCampaign({ payment, productData, targeting })} />
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

    formValues: PropTypes.object,

    page: PropTypes.shape({
        step: PropTypes.number.isRequired,
        previewLoaded: PropTypes.bool.isRequired
    }).isRequired,

    loadData: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,

    steps: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    productData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }),
    targeting: PropTypes.shape({
        gender: PropTypes.string,
        age: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    }),
    promotions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired)
};

function mapStateToProps(state) {
    return {
        formValues: getFormValues(state.form.productWizard)
    };
}

export default connect(mapStateToProps, {
    findApps,
    productSelected,
    goToStep,
    wizardDestroyed,
    getClientToken,
    createCampaign,
    previewLoaded
})(ProductWizard);
