import { connect } from 'react-redux';
import ProductWizard from './ProductWizard';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { wizardComplete, autofill } from '../../actions/product_wizard';
import { getPromotions } from '../../actions/session';
import { assign } from 'lodash';

function mapStateToProps(state, props) {
    const {
        session: { promotions },
        db
    } = state;

    return {
        steps: [0, 1, 2, 3],

        promotions: promotions && promotions.map(id => db.promotion[id]),

        productData: props.page.productData,
        targeting: props.page.targeting
    };
}

function mapDispatchToProps(dispatch, props) {
    return {
        loadData() {
            return Promise.all([dispatch(getPromotions()), dispatch((autofill()) )]);
        },

        onFinish({ targeting, productData }) {
            return dispatch(wizardComplete({
                targeting,
                productData: assign({}, props.page.productData, productData)
            }));
        }
    };
}

export default compose(
    pageify({
        path: 'dashboard.add_product'
    }),
    connect(mapStateToProps, mapDispatchToProps)
)(ProductWizard);
