import React, { PropTypes } from 'react';
import { reject, omit } from 'lodash';

export default function MultiCheckbox(props) {
    const {
        value,
        option,
        onChange,
    } = props;
    const childProps = omit(props, Object.keys(MultiCheckbox.propTypes));

    return (<input
        {...childProps}
        type="checkbox"
        checked={value.indexOf(option) > -1}
        onChange={({ target }) => {
            if (!target.checked) {
                onChange(reject(value, val => val === option));
            } else {
                onChange(value.concat([option]));
            }
        }}
    />);
}
MultiCheckbox.propTypes = {
    value: PropTypes.array.isRequired,
    option: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
};
MultiCheckbox.defaultProps = {
    value: [],
};
