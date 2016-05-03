'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findApps } from '../../actions/search';
import { productSelected } from '../../actions/product_wizard';
import WizardSearch from '../../components/WizardSearch';

class ProductWizard extends Component {
    render() {
        const {
            findApps,
            productSelected,
            page: { step }
        } = this.props;

        return (
            <div>
                <h1>Add Your Product!</h1>
                {(() => {
                    switch (step) {
                    case 0:
                        return <WizardSearch findProducts={findApps}
                            onProductSelected={product => productSelected({ product })}/>;
                    }
                })()}
            </div>
        );
    }
}

ProductWizard.propTypes = {
    findApps: PropTypes.func.isRequired,
    productSelected: PropTypes.func.isRequired,
    page: PropTypes.shape({
        step: PropTypes.number.isRequired
    }).isRequired
};

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps, {
    findApps,
    productSelected
})(ProductWizard);
