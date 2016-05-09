'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findApps } from '../../actions/search';
import {
    productSelected,
    productEdited,
    targetingEdited,
    goToStep,
    wizardDestroyed,
    createCampaign
} from '../../actions/product_wizard';
import { getClientToken } from'../../actions/payment';
import WizardSearch from '../../components/WizardSearch';
import WizardEditProduct from '../../components/WizardEditProduct';
import WizardEditTargeting from '../../components/WizardEditTargeting';
import WizardConfirmationModal from '../../components/WizardConfirmationModal';
import classnames from 'classnames';

class ProductWizard extends Component {
    constructor() {
        super(...arguments);

        this.loadProduct = this.loadProduct.bind(this);
    }

    loadProduct(product) {
        const {
            productSelected,
            goToStep,

            page: {
                productData
            }
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
            productEdited,
            targetingEdited,
            getClientToken,
            goToStep,
            createCampaign,

            page: { step, productData, targeting }
        } = this.props;

        return (<div className="container main-section">
            <div className="row">
                <div className="campaign-progressbar col-md-12 col-sm-12 col-xs-12">
                    <ul className="nav nav-pills nav-justified">
                        <li className={classnames('progressbar-step-1', {
                            active: step >= 0
                        })}>
                            <button onClick={() => goToStep(0)}>
                                <h3>
                                    <i className="fa fa-search" />
                                    <span className="sr-only">Search</span>
                                </h3>
                                Search
                            </button>
                        </li>
                        <li className={classnames('progressbar-step-2', {
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
                        </li>
                        <li className={classnames('progressbar-step-3', {
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
                        </li>
                        <li className={classnames('progressbar-step-4', {
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
                        </li>
                    </ul>
                </div>
            </div>
            <br />
            <div className="row">
                {step > 0 && (
                    <div className="create-ad step-2 col-md-6 col-sm-6 col-middle text-center">
                        <img src={'https://placeholdit.imgix.net/~text?txtsize=38&bg=ffffff&' +
                            'txtclr=333333&txt=phone&w=320&h=600&txttrack=0'}
                            style={{borderRadius: 25}} />
                    </div>
                )}
                {(() => {
                    switch (step) {
                    case 0:
                        return <WizardSearch findProducts={findApps}
                            onProductSelected={this.loadProduct}/>;
                    case 1:
                        return <WizardEditProduct productData={productData}
                            onFinish={({ title, description }) => productEdited({
                                data: { name: title, description }
                            })} />;
                    case 2:
                    case 3:
                        return <WizardEditTargeting targeting={targeting}
                            onFinish={targeting => targetingEdited({ data: targeting })} />;
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
    productEdited: PropTypes.func.isRequired,
    targetingEdited: PropTypes.func.isRequired,
    goToStep: PropTypes.func.isRequired,
    wizardDestroyed: PropTypes.func.isRequired,
    getClientToken: PropTypes.func.isRequired,
    createCampaign: PropTypes.func.isRequired,

    page: PropTypes.shape({
        step: PropTypes.number.isRequired,
        productData: PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired
        })
    }).isRequired
};

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps, {
    findApps,
    productSelected,
    productEdited,
    targetingEdited,
    goToStep,
    wizardDestroyed,
    getClientToken,
    createCampaign
})(ProductWizard);
