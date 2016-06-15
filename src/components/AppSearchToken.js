import React, { PropTypes } from 'react';

export default function AppSearchToken({
    token: {
        title,
        thumbnail,
    },
}) {
    return (<div className="app-selected">
        <img alt={title} src={thumbnail} />
        <h4 className="app-title">{title}</h4>
    </div>);
}

AppSearchToken.propTypes = {
    token: PropTypes.shape({
        title: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
    }).isRequired,
};
