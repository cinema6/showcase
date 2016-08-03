import { connect } from 'react-redux';
import ProductWizard from './ProductWizard';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { wizardComplete, autofill } from '../../actions/product_wizard';
import { getPromotions, getOrg } from '../../actions/session';
import { assign, get } from 'lodash';
import { getPaymentPlans } from '../../actions/system';
import { getValues } from 'redux-form';

function mapStateToProps(state, props) {
    const {
        session: {
            promotions,
        },
        system: {
            paymentPlans: paymentPlanIds,
        },
        db,
    } = state;
    const paymentPlans = (paymentPlanIds || []).map(id => state.db.paymentPlan[id]);

    return {
        steps: [0, 1, 2, 3],

        promotions: promotions && promotions.map(id => db.promotion[id]),
        paymentPlans: paymentPlans.filter(paymentPlan => paymentPlan.price > 0),

        productData: props.page.productData,
        targeting: props.page.targeting,
        paymentPlanId: (getValues(get(state, 'form.selectPlan.select')) || {}).plan || null,
    };
}

function mapDispatchToProps(dispatch, props) {
    return {
        loadData() {
            return Promise.all([
                dispatch(getPromotions()),
                dispatch(autofill()),
                dispatch(getOrg()),
                dispatch(getPaymentPlans()),
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
