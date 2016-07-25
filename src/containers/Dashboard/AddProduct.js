import { connect } from 'react-redux';
import ProductWizard from './ProductWizard';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { wizardComplete, autofill } from '../../actions/product_wizard';
import { getPromotions, getOrg } from '../../actions/session';
import { assign } from 'lodash';

function mapStateToProps(state, props) {
    const {
        session: {
            promotions,
            org: orgId,
        },
        db,
    } = state;
    const org = db.org[orgId] || null;

    return {
        steps: [0, 1, 2, 3],

        promotions: promotions && promotions.map(id => db.promotion[id]),

        productData: props.page.productData,
        targeting: props.page.targeting,
        paymentPlanId: org && org.paymentPlanId,
    };
}

function mapDispatchToProps(dispatch, props) {
    return {
        loadData() {
            return Promise.all([
                dispatch(getPromotions()),
                dispatch(autofill()),
                dispatch(getOrg()),
            ]);
        },

        onFinish({ targeting, productData }) {
            return dispatch(wizardComplete({
                targeting,
                productData: assign({}, props.page.productData, productData),
            }));
        },
    };
}

export default compose(
    pageify({
        path: 'dashboard.add_product',
    }),
    connect(mapStateToProps, mapDispatchToProps)
)(ProductWizard);
