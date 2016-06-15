import React, { PropTypes } from 'react';
import classnames from 'classnames';
import numeral from 'numeral';

export default function StarRating({
    rating,
    ratingCount,
}) {
    const fullRating = Math.floor(rating);
    const isHalf = (rating !== fullRating);

    return (<div className="app__ratings">
        <ul className="app__ratings--stars">
            {Array.apply([], new Array(5)).map((_, index) => (<li key={index}>
                <i
                    className={classnames('fa', {
                        'fa-star': index < fullRating,
                        'fa-star-half-o': isHalf && fullRating === index,
                        'fa-star-o': index >= rating,
                    })}
                />
            </li>))}
        </ul>
        {ratingCount && <p>{numeral(ratingCount).format('0,0')} Ratings</p>}
    </div>);
}

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    ratingCount: PropTypes.number,
};
