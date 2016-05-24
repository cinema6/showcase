'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findApps } from '../../actions/search';
import {
    productSelected,
    goToStep,
    wizardDestroyed,
    createCampaign
} from '../../actions/product_wizard';
import { getClientToken } from'../../actions/payment';
import WizardSearch from '../../components/WizardSearch';
import WizardEditProduct from '../../components/WizardEditProduct';
import WizardEditTargeting from '../../components/WizardEditTargeting';
import WizardConfirmationModal from '../../components/WizardConfirmationModal';
import AdPreview from '../../components/AdPreview';
import classnames from 'classnames';
import { pick, includes, assign } from 'lodash';
import { getValues as getFormValues } from 'redux-form';
import { createInterstitialFactory } from 'showcase-core/dist/factories/app';

const PREVIEW = {
    CARD_OPTIONS: {
        cardType: 'showcase-app'
    },
    PLACEMENT_OPTIONS: {
        type: 'mobile-card',
        branding: 'showcase-app--interstitial'
    }
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

            onFinish,

            steps,
            productData,
            targeting,
            formValues,

            page: { step }
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
                        factory={createInterstitialFactory}/>
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
                    case 3:
                        return <WizardEditTargeting targeting={targeting}
                            onFinish={values => onFinish({
                                targeting: pick(values, ['age', 'gender']),
                                productData: pick(values, ['name', 'description'])
                            })} />;
                    }
                })()}
            </div>
            {step === 3 && (
                <WizardConfirmationModal getToken={getClientToken}
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

    formValues: PropTypes.object,

    page: PropTypes.shape({
        step: PropTypes.number.isRequired
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
    })
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
    createCampaign
})(ProductWizard);
{/* trial offer modal to show before payment screen
        <div class="modal trial-modal fade" id="trialModal" tabindex="-1" role="dialog" 
            aria-labelledby="mytrialModal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h1 class="modal-title" id="myPaymentModal">Get 2 Weeks FREE Trial</h1>
                        <p>and reach 1,000 people at no cost</p>
                    </div>
                    <div class="modal-body text-center">
                        <div class="row">
                            <div class="trail-wrap">
                                <div class="col-sm-12 col-xs-12 col-middle">
                                    <div class="plan-info-box">
                                        <div class="plan-box-header">
                                            <h3>Start now</h3>
                                        </div>
                                        <div class="plan-box-content">
                                            <div class="plan-box-item stacked-item">
                                                <span>Reach</span>
                                                <h2>2,000</h2>
                                                <span>people each month</span>
                                            </div>
                                            <hr>
                                            <div class="plan-box-item stacked-item">
                                                <span>Only</span>
                                                <h2>$49.99</h2>
                                                <span>per month</span>
                                            </div>
                                        </div>
                                    </div>
                                </div><!--
                             --><div class="col-sm-12 col-middle text-left">
                                    <h3>We Give Your App The Royal Treatment With:</h4>
                                    <ul class="checked-feature-list">
                                        <li>
                                            <h4>Stunning ad formats</h4>
                                        </li>
                                        <li>
                                            <h4>Intelligent self-optimizing ads</h4>
                                        </li>
                                        <li>
                                            <h4>Weekly performance reports</h4>
                                        </li>
                                        <li>
                                            <h4>Insights into views, clicks, installs &amp; more
                                            </h4>
                                        </li>
                                    </ul>
                                </div>
                                <div class="clearfix">
                                </div>
                                <div class="col-md-12 text-center">
                                    <br>
                                    <button type="submit" class="col-xs-12 btn btn-danger btn-lg">
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
*/}
