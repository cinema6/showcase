'use strict';

import { Component } from 'react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pageify } from '../../utils/page';
import { loadPageData } from '../../actions/campaign_detail';
import CampaignDetailBar from '../../components/CampaignDetailBar';

class CampaignDetail extends Component {
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
                <h3>CampaignDetail</h3>
                { page.loading && <p> Loading... </p> }
                { !page.loading && <p> Not Loading... {campaignId}</p> }

                <CampaignDetailBar campaignId={campaignId} title="Hello"
                    views={100} clicks={50} installs={10}
                />
            </section>
        );
    }
}

CampaignDetail.propTypes = {
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
    pageify({ path: 'dashboard.campaign_detail' }),
    connect(mapStateToProps, {
        loadPageData
    })
)(CampaignDetail);
