import { connect } from 'react-redux';
import ProductWizard from './ProductWizard';
import { compose } from 'redux';
import { pageify } from '../../utils/page';

function mapStateToProps() {
    return {
        product: null
    };
}

export default compose(
    pageify({
        path: 'dashboard.add_product'
    }),
    connect(mapStateToProps)
)(ProductWizard);
