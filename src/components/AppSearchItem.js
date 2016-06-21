import React, { PropTypes } from 'react';
import StarRating from './StarRating';

export default function AppSearchItem({
    suggestion: {
        title,
        developer,
        thumbnail,
        price,
        rating,
    },
}) {
    return (<span>
        <div className="app-icon">
            <img alt={title} src={thumbnail} />
        </div>
        <div className="app-info">
            <h4 className="app-title">{title}</h4>
            <span className="app-author"> By {developer} </span>
            {rating && (<StarRating rating={rating} />)}
            <span className="app-cost"> {price} </span>
        </div>
    </span>);
}

AppSearchItem.propTypes = {
    suggestion: PropTypes.object,
    active: PropTypes.bool,
};
