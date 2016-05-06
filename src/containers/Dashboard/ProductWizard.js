'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findApps } from '../../actions/search';
import {
    productSelected,
    productEdited,
    targetingEdited,
    goToStep,
    wizardDestroyed
} from '../../actions/product_wizard';
import WizardSearch from '../../components/WizardSearch';
import WizardEditProduct from '../../components/WizardEditProduct';
import WizardEditTargeting from '../../components/WizardEditTargeting';
import classnames from 'classnames';

class ProductWizard extends Component {
    constructor() {
        super(...arguments);

        this.loadProduct = this.loadProduct.bind(this);
    }

    goToStep(step, event) {
        const {
            goToStep
        } = this.props;

        event.preventDefault();

        if (event.currentTarget.getAttribute('data-disabled') !== 'true') {
            return goToStep(step);
        }
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

            page: { step, productData, targeting }
        } = this.props;

        return (<div className="container main-section">
            <div className="row">
                <div className="campaign-progressbar col-md-12 col-sm-12 col-xs-12">
                    <ul className="nav nav-pills nav-justified">
                        <li className={classnames('progressbar-step-1', {
                            active: step >= 0
                        })}>
                            <a href="#" onClick={event => this.goToStep(0, event)}>
                                <h3>
                                    <i className="fa fa-search" />
                                    <span className="sr-only">Search</span>
                                </h3>
                                Search
                            </a>
                        </li>
                        <li className={classnames('progressbar-step-2', {
                            active: step >= 1
                        })}>
                            <a href="#"
                                data-disabled={!productData}
                                onClick={event => this.goToStep(1, event)}>
                                <h3>
                                    <i className="fa fa-pencil-square-o" />
                                    <span className="sr-only">Create</span>
                                </h3>
                                Create
                            </a>
                        </li>
                        <li className={classnames('progressbar-step-3', {
                            active: step >= 2
                        })}>
                            <a href="#"
                                data-disabled={!productData}
                                onClick={event => this.goToStep(2, event)}>
                                <h3>
                                    <i className="fa fa-bullseye" />
                                    <span className="sr-only">Target</span>
                                </h3>
                                Target
                            </a>
                        </li>
                        <li className={classnames('progressbar-step-4', {
                            active: step >= 3
                        })}>
                            <a href="#"
                                data-disabled={!productData}
                                onClick={event => this.goToStep(3, event)}>
                                <h3>
                                    <i className="fa fa-paper-plane-o" />
                                    <span className="sr-only">Promote</span>
                                </h3>
                                Promote
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <br />
            <div className="row">{(() => {
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
                    return <WizardEditTargeting targeting={targeting}
                        onFinish={targeting => targetingEdited({ data: targeting })} />;
                }
            })()}</div>
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
    wizardDestroyed
})(ProductWizard);
