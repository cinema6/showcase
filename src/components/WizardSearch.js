'use strict';

import React, { Component, PropTypes } from 'react';
import TokenTextField from './TokenTextField';
import AppSearchItem from './AppSearchItem';
import { assign } from 'lodash';
import { reduxForm } from 'redux-form';

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
            handleSubmit,
            error
        } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <TokenTextField {...search}
                    maxValues={1}
                    TokenComponent={AppSearchItem}
                    SuggestionComponent={AppSearchItem}
                    getSuggestions={text => findProducts(this.props.findProducts, text)}
                    value={search.value || []}/>

                {error && (<div>{error.response}</div>)}
                <button type="submit" disabled={search.value.length < 1}>Proceed</button>
            </form>
        );
    }
}

WizardSearch.propTypes = {
    findProducts: PropTypes.func.isRequired,
    onProductSelected: PropTypes.func.isRequired,

    fields: PropTypes.shape({
        search: PropTypes.object.isRequired
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error)
};

export default reduxForm({
    form: 'wizardSearch',
    fields: ['search']
})(WizardSearch);
