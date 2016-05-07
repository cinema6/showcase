'use strict';

import { Component } from 'react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { loadPageData } from '../../actions/stats';

class Statistics extends Component {
    componentWillMount() {
        return this.props.loadPageData(this.props.params.campaignId);
    }

    render() {
        const {
            page,
            params : { campaignId }
        } = this.props;

        var msg = page.analyticsError && page.analyticsError.message;
        return (
            <section>
                <h3>Statistics</h3>
                { page.loading && <p> Loading... </p> }
                { !page.loading && <p> Not Loading... {campaignId}</p> }
            </section>
        );
    }
}

Statistics.propTypes = {
    page: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        analyticsError: PropTypes.object
    }).isRequired,

    loadPageData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {};
}

export default compose(
    pageify({ path: 'dashboard.stats' }),
    connect(mapStateToProps, {
        loadPageData
    })
)(Statistics);
