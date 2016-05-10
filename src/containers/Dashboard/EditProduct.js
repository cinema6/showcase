'use strict';

import { connect } from 'react-redux';
import ProductWizard from './ProductWizard';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { loadCampaign, updateCampaign } from '../../actions/product_wizard';
import { PropTypes } from 'react';
import {
    productDataFromCampaign,
    targetingFromCampaign
} from '../../utils/campaign';

function mapStateToProps(state, props) {
    const campaign = state.db.campaign[props.params.campaignId];

    return {
        steps: [1, 2],
        productData: productDataFromCampaign(campaign),
        targeting: targetingFromCampaign(campaign)
    };
}

function mapDispatchToProps(dispatch, props) {
    return {
        loadData() {
            return dispatch(loadCampaign({ id: props.params.campaignId }));
        },

        onFinish({ productData, targeting }) {
            return dispatch(updateCampaign({
                id: props.params.campaignId,
                productData,
                targeting
            }));
        }
    };
}

const EditProduct = compose(
    pageify({ path: 'dashboard.edit_product' }),
    connect(mapStateToProps, mapDispatchToProps)
)(ProductWizard);

EditProduct.propTypes = {
    params: PropTypes.shape({
        campaignId: PropTypes.string.isRequired
    }).isRequired
};

export default EditProduct;
