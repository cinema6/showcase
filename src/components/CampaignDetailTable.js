'use strict';

import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import moment from 'moment';
import {
   CHART_TODAY,
   CHART_7DAY,
   CHART_30DAY
} from './CampaignDetailChart';

export default class CampaignDetailTable extends Component {
    render() {
        const {
            data,
            chart
        } = this.props;
        let activeSet = [],
            timeFormatter = () => 'unknown';

        if (chart === CHART_TODAY) {
            activeSet = data.today;
            timeFormatter = (datum) => moment(datum.hour).utc().format('ha');
        } else
        if (chart === CHART_7DAY) {
            activeSet = data.daily_7;
            timeFormatter = (datum) => moment(datum.date).format('dddd M/D');
        } else
        if (chart === CHART_30DAY) {
            activeSet = data.daily_30;
            timeFormatter = (datum) => moment(datum.date).format('M/D/Y');
        }

        const numsFormatter = (n) => n === 0 ? '-' : numeral(n).format('0,0');
        
        return (
            <div className="col-md-12 col-sm-12 col-middle table-responsive animated card-item">
                <table className="table table-hover stats-list">
                    <thead>
                        <tr>
                            <th> <h4> Timeline </h4> </th>
                            <th className="text-center"> <h4> Reach </h4> </th>
                            <th className="text-center"> <h4> Clicks </h4> </th>
                            <th className="text-center"> <h4> Installs </h4> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeSet.map(function(row,i){
                            return (
                                <tr key={i}>
                                    <th> <h4>{timeFormatter(row)} </h4></th> 
                                    <td> <h4>{numsFormatter(row.users)} </h4></td> 
                                    <td> <h4>{numsFormatter(row.clicks)} </h4></td> 
                                    <td> <h4>{numsFormatter(row.installs)} </h4></td> 
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

CampaignDetailTable.propTypes = {
    data: PropTypes.object.isRequired,
    chart: PropTypes.string.isRequired
};
