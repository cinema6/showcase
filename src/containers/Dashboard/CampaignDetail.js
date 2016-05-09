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
        let code;
        const {
            page,
            params      : { campaignId },
            campaigns   : { [campaignId] : campaign },
        } = this.props;

        var msg = page.analyticsError && page.analyticsError.message;
       
        if (page.loading) {
            code = (
                <section>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <h4>CampaignDetail</h4>
                        Loading...
                </section>
            );
        }
        else {
            if (page.analytics === null) {
                code = (
                    <section>
                        <CampaignDetailBar 
                            campaignId={campaignId} 
                            title={campaign.name}
                            views={undefined} 
                            clicks={undefined} 
                            installs={undefined}
                        />
                    </section>
                );
            } else {
                code= (
                    <section>
                        <CampaignDetailBar 
                            campaignId={campaignId} 
                            title={campaign.name}
                            views={page.analytics.summary.views} 
                            clicks={page.analytics.summary.clicks} 
                            installs={page.analytics.summary.installs}
                        />
                    </section>
                );
            }
        }

        return code;
    }
}

CampaignDetail.propTypes = {
    page: PropTypes.shape({
        loading         : PropTypes.bool.isRequired,
        analyticsError  : PropTypes.object,
        analytics       : PropTypes.object
    }).isRequired,

    loadPageData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        campaigns :  state.db.campaign
    };
}

export default compose(
    pageify({ path: 'dashboard.campaign_detail' }),
    connect(mapStateToProps, {
        loadPageData
    })
)(CampaignDetail);
