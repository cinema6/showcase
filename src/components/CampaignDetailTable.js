import React, { PropTypes } from 'react';
import numeral from 'numeral';
import moment from 'moment';

const DASH = '\u2014';

function formatNumber(number) {
    return (number && numeral(number).format('0,0')) || DASH;
}

function formatDate(date) {
    return moment(date).format('MMM D');
}

function formatCTR({ users, clicks }) {
    const percent = Math.round((Math.min(users, clicks) / users) * 100);

    return (percent && `${percent}%`) || DASH;
}

export default function CampaignDetailTable({
    items,
}) {
    return (<table className="table table-hover stats-list">
        <thead>
            <tr>
                <th>
                    <h4>Timeline</h4>
                </th>
                <th className="text-center">
                    <h4>Views</h4>
                </th>
                <th className="text-center">
                    <h4>Clicks</h4>
                </th>
                <th className="text-center">
                    <h4>CTR</h4>
                </th>
            </tr>
        </thead>
        <tbody>
            {items.map(({ date, users, clicks }) => (<tr key={date}>
                <th>
                    <h4>{formatDate(date)}</h4>
                </th>
                <td>
                    <h4 className="stats-col-reach">{formatNumber(users)}</h4>
                </td>
                <td>
                    <h4 className="stats-col-clicks">{formatNumber(clicks)}</h4>
                </td>
                <td>
                    <h4 className="stats-col-ctr">{formatCTR({ users, clicks })}</h4>
                </td>
            </tr>))}
            {/*When there is no data to show, show an empty row with following message
            <tr><td colspan="4">Not enough data to show stats</td></tr>
            */}
        </tbody>
    </table>);
}

CampaignDetailTable.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        users: PropTypes.number.isRequired,
        clicks: PropTypes.number.isRequired,
    }).isRequired).isRequired,
};

CampaignDetailTable.defaultProps = {
    items: [],
};
