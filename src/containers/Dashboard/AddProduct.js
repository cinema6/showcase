import { connect } from 'react-redux';
import ProductWizard from './ProductWizard';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { wizardComplete } from '../../actions/product_wizard';

function mapStateToProps(state, props) {
    return {
        steps: [0, 1, 2, 3],

        productData: props.page.productData,
        targeting: props.page.targeting
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadData() {
            return Promise.resolve(undefined);
        },

        onFinish({ targeting, productData }) {
            return dispatch(wizardComplete({ targeting, productData }));
        }
    };
}

export default compose(
    pageify({
        path: 'dashboard.add_product'
    }),
    connect(mapStateToProps, mapDispatchToProps)
)(ProductWizard);
