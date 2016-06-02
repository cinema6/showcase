'use strict';

import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import moment from 'moment';
import {
   CHART_TODAY,
   CHART_7DAY,
   CHART_30DAY,

   SERIES_USERS,
//   SERIES_VIEWS,
   SERIES_CLICKS,
   SERIES_INSTALLS

} from './CampaignDetailChart';

export default class CampaignDetailTable extends Component {
    render() {
        const {
            data,
            chart,
            series
        } = this.props;
        let activeSet = [],
            timeFormatter = () => 'unknown',
//            classViews    = `${series === SERIES_VIEWS ? '' : 'hidden-xs'}`,
            classUsers    = `${series === SERIES_USERS ? '' : 'hidden-xs'}`,
            classClicks   = `${series === SERIES_CLICKS ? '' : 'hidden-xs'}`,
            classInstalls = `${series === SERIES_INSTALLS ? '' : 'hidden-xs'}`;

        if (chart === CHART_TODAY) {
            activeSet = data.today;
            timeFormatter = (datum) => moment(datum.hour).utc().format('ha');
        } else
        if (chart === CHART_7DAY) {
            activeSet = data.daily_7;
            timeFormatter = (datum) => {
                return ([
                    <span className="text-block"> {moment(datum.date).format('MMMM D')} </span> ,
                    <span className="small text-block"> {moment(datum.date).format('dddd')} </span>
                ]);
            };
        } else
        if (chart === CHART_30DAY) {
            activeSet = data.daily_30;
            timeFormatter = (datum) => {
                return ([
                    <span className="text-block"> {moment(datum.date).format('MMMM D, YYYY')} 
                    </span> ,
                    <span className="small text-block"> {moment(datum.date).format('dddd')} </span>
                ]);
            };
            {/*timeFormatter = (datum) => moment(datum.date).format('M/D/Y');*/}
        }

        const numsFormatter = (n) => n === 0 ? '-' : numeral(n).format('0,0');
        
        return (
            <div className="container">
                <div className="col-md-12 col-sm-12 col-middle table-responsive animated card-item">
                    <table className="table table-hover stats-list">
                        <thead>
                            <tr>
                                <th> <h4> Timeline </h4> </th>
                                <th className={`text-center ${classUsers}`}> 
                                    <h4> Views </h4> </th>
                                <th className={`text-center ${classClicks}`}> 
                                    <h4> Clicks </h4> </th>
                                <th className={`text-center ${classInstalls}`}> 
                                    <h4> Installs </h4> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeSet.map(function(row,i){
                                return (
                                    <tr key={i}>
                                        <th> 
                                            <h4 className="timeline-stacked">{timeFormatter(row)} 
                                        </h4></th> 
                                        <td className={classUsers}> 
                                            <h4 className="stats-value stats-col-reach">
                                            {numsFormatter(row.users)} </h4>
                                            <span className="small">Views</span>
                                        </td> 
                                        <td className={classClicks}> 
                                            <h4 className="stats-value stats-col-clicks">
                                            {numsFormatter(row.clicks)} </h4>
                                            <span className="small">Clicks</span>
                                        </td> 
                                        <td className={classInstalls}> 
                                            <h4 className="stats-value stats-col-installs">
                                            {numsFormatter(row.installs)} </h4>
                                            <span className="small">Installs</span>
                                        </td> 
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>                
        );
    }
}

CampaignDetailTable.propTypes = {
    data: PropTypes.object.isRequired,
    chart: PropTypes.string.isRequired,
    series: PropTypes.string.isRequired
};
