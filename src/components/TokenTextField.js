import React, { Component, PropTypes } from 'react';
import { throttle, find, findIndex, noop } from 'lodash';
import { findDOMNode } from 'react-dom';

const KEY_CODES = {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    BACKSPACE: 8
};

function queue(fn) {
    let promise = Promise.resolve();

    return function wrapped(...args) {
        return (promise = promise.then(() => fn(...args)));
    };
}

export default class TokenTextField extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            suggestions: [],

            text: '',
            selectedSuggestion: null
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.getSuggestions = queue(this.getSuggestions.bind(this));
        this.throttledGetSuggestions = throttle(this.getSuggestions, 1000);
    }

    handleKeyDown(event) {
        const { target } = event;
        const {
            suggestions,
            selectedSuggestion
        } = this.state;
        const {
            value,
            maxValues
        } = this.props;
        const getSuggestion = delta => {
            const firstIndex = 0;
            const lastIndex = suggestions.length - 1;
            const currentIndex = findIndex(suggestions, { id: selectedSuggestion });

            if (currentIndex < 0) { return null; }

            return suggestions[Math.min(Math.max(currentIndex + delta, firstIndex), lastIndex)].id;
        };
        const respond = keyCode => {
            switch (keyCode) {
            case KEY_CODES.UP:
                this.setState({ selectedSuggestion: getSuggestion(-1) });
                return true;
            case KEY_CODES.DOWN:
                this.setState({ selectedSuggestion: getSuggestion(+1) });
                return true;
            case KEY_CODES.ENTER:
                this.addToken(find(suggestions, { id: selectedSuggestion }));
                return true;
            case KEY_CODES.BACKSPACE:
                if (target.value) { return false; }
                this.popToken();
                return true;
            default:
                return false;
            }
        };

        if (respond(event.keyCode) || value.length >= maxValues) { event.preventDefault(); }
    }

    addToken(item) {
        const {
            value,
            onChange
        } = this.props;

        onChange(value.concat([item]));
        this.setState({ text: '' });
        this.getSuggestions('');
        findDOMNode(this.refs.input).focus();
    }

    popToken() {
        const {
            value,
            onChange
        } = this.props;

        onChange(value.slice(0, -1));
    }

    handleNewText(text) {
        this.setState({ text });
        this.throttledGetSuggestions(text);
    }

    getSuggestions(text) {
        const {
            selectedSuggestion
        } = this.state;

        return this.props.getSuggestions(text).then(suggestions => {
            const includesCurrentSelection = !!find(suggestions, { id: selectedSuggestion });
            const firstSuggestion = suggestions[0] || null;

            this.setState({
                suggestions,
                selectedSuggestion: includesCurrentSelection ?
                    selectedSuggestion : (firstSuggestion && firstSuggestion.id)
            });
        });
    }

    render() {
        const {
            suggestions,
            selectedSuggestion,
            text
        } = this.state;
        const {
            value,

            SuggestionComponent,
            TokenComponent
        } = this.props;

        return <span>
            <ul>
                {value.map(token => <li key={token.id}>
                    <TokenComponent token={token} />
                </li>)}
                <li>
                    <input ref="input"
                        type="text"
                        value={text}
                        onKeyDown={this.handleKeyDown}
                        onChange={({ target }) => this.handleNewText(target.value)} />
                </li>
            </ul>
            <ul>
                {suggestions.map(suggestion => <li key={suggestion.id}
                    onMouseEnter={() => this.setState({ selectedSuggestion: suggestion.id })}
                    onClick={() => this.addToken(suggestion)}>
                    <SuggestionComponent suggestion={suggestion}
                        active={suggestion.id === selectedSuggestion} />
                </li>)}
            </ul>
        </span>;
    }
}

TokenTextField.propTypes = {
    getSuggestions: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,

    value: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired).isRequired,
    maxValues: PropTypes.number.isRequired,

    SuggestionComponent: PropTypes.func.isRequired,
    TokenComponent: PropTypes.func.isRequired
};
TokenTextField.defaultProps = {
    onChange: noop,
    value: [],
    maxValues: Infinity
};
