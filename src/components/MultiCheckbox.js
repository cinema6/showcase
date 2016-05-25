import React, { Component, PropTypes } from 'react';
import { reject, omit } from 'lodash';

export default class MultiCheckbox extends Component {
    render() {
        const {
            value,
            option,
            onChange
        } = this.props;

        const childProps = omit(this.props, Object.keys(MultiCheckbox.propTypes));

        return <input {...childProps} type="checkbox"
            checked={value.indexOf(option) > -1}
            onChange={({ target }) => {
                if (!target.checked) {
                    onChange(reject(value, value => value === option));
                } else {
                    onChange(value.concat([option]));
                }
            }} />;
    }
}
MultiCheckbox.propTypes = {
    value: PropTypes.array.isRequired,
    option: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
};
MultiCheckbox.defaultProps = {
    value: []
};
