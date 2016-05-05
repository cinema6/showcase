'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findApps } from '../../actions/search';
import { productSelected, productEdited, targetingEdited } from '../../actions/product_wizard';
import WizardSearch from '../../components/WizardSearch';
import WizardEditProduct from '../../components/WizardEditProduct';
import WizardEditTargeting from '../../components/WizardEditTargeting';

class ProductWizard extends Component {
    render() {
        const {
            findApps,
            productSelected,
            productEdited,
            targetingEdited,

            page: { step, productData, targeting }
        } = this.props;

        return (
            <div>
                <h1>Add Your Product!</h1>
                {(() => {
                    switch (step) {
                    case 0:
                        return <WizardSearch findProducts={findApps}
                            onProductSelected={product => productSelected({ product })}/>;
                    case 1:
                        return <WizardEditProduct productData={productData}
                            onFinish={({ title, description }) => productEdited({
                                data: { name: title, description }
                            })} />;
                    case 2:
                        return <WizardEditTargeting targeting={targeting}
                            onFinish={targeting => targetingEdited({ data: targeting })} />;
                    }
                })()}
            </div>
        );
    }
}

ProductWizard.propTypes = {
    findApps: PropTypes.func.isRequired,
    productSelected: PropTypes.func.isRequired,
    productEdited: PropTypes.func.isRequired,
    targetingEdited: PropTypes.func.isRequired,

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
    targetingEdited
})(ProductWizard);
