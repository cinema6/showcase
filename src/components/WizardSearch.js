'use strict';

import React, { Component, PropTypes } from 'react';
import TokenTextField from './TokenTextField';
import AppSearchItem from './AppSearchItem';
import AppSearchToken from './AppSearchToken';
import { assign } from 'lodash';
import { reduxForm } from 'redux-form';
import classnames from 'classnames';

function findProducts(find, query) {
    if (!query) { return Promise.resolve([]); }

    return find({ query, limit: 10 })
        .then(products => products.map(product => assign({}, product, {
            id: product.uri // Key products by their URI as it will be unique
        })))
        .catch(() => []);
}

class WizardSearch extends Component {
    constructor() {
        super(...arguments);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit({ search: [product] }) {
        return this.props.onProductSelected(product).catch(reason => Promise.reject({
            _error: reason
        }));
    }

    render() {
        const {
            fields: { search },
            submitting,
            pristine,
            handleSubmit,
            error
        } = this.props;

        return (<div className="create-ad step-1 col-md-6 col-md-offset-3 col-xs-12 text-center
            animated fadeIn">
            <h1 className="text-center">Find Your App on iTunes</h1>
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <div className="app-search form-group text-center">
                    <TokenTextField {...search}
                        maxValues={1}
                        TokenComponent={AppSearchToken}
                        SuggestionComponent={AppSearchItem}
                        getSuggestions={text => findProducts(this.props.findProducts, text)}
                        value={search.value || []}/>
                    <span id="helpBlock" className="help-block">We’ll import your app details from 
                        the store</span>
                    <br />
                    {error && !submitting && (<div className="alert alert-danger" role="alert">
                        <strong>Yikes...</strong> {error.response || error.message}.
                    </div>)}
                    <button type="submit"
                        disabled={submitting || pristine || search.value.length < 1}
                        className={classnames(
                            'col-sm-6 col-sm-offset-3 col-xs-12 btn btn-danger btn-lg', {
                                'btn-waiting': submitting
                            }
                        )}>
                        Next
                    </button>
                </div>
            </form>
        </div>);
    }
}

WizardSearch.propTypes = {
    findProducts: PropTypes.func.isRequired,
    onProductSelected: PropTypes.func.isRequired,

    fields: PropTypes.shape({
        search: PropTypes.object.isRequired
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired
};

export default reduxForm({
    form: 'productWizard',
    fields: ['search'],
    destroyOnUnmount: false
})(WizardSearch);
