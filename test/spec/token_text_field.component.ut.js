import TokenTextField from '../../src/components/TokenTextField';
import {
    renderIntoDocument,
    findRenderedDOMComponentWithTag,
    Simulate,
    scryRenderedDOMComponentsWithTag,
    scryRenderedComponentsWithType
} from 'react-addons-test-utils';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import defer from 'promise-defer';
import { createUuid } from 'rc-uuid';
import { noop } from 'lodash';

const KEY_CODES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    BACKSPACE: 8
};

function wait(ticks) {
    return Array.apply([], new Array(ticks))
        .reduce(promise => promise.then(() => {}), Promise.resolve());
}

describe('TokenTextField', function() {
    beforeEach(function() {
        jasmine.clock().install();
        jasmine.clock().mockDate();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('should have default props', function() {
        expect(TokenTextField.defaultProps).toEqual({
            onChange: noop,
            value: [],
            maxValues: Infinity
        });
    });

    describe('when rendered', function() {
        let props;
        let component;

        class TestSuggestion extends Component {
            render() {
                return <div>I am a suggestion!</div>;
            }
        }

        class TestToken extends Component {
            render() {
                return <div>I am a token!</div>;
            }
        }

        beforeEach(function() {
            props = {
                getSuggestions: jasmine.createSpy('getSuggestions()').and.returnValue(Promise.resolve([])),
                onChange: jasmine.createSpy('onChange()'),

                SuggestionComponent: TestSuggestion,
                TokenComponent: TestToken,
                value: Array.apply([], new Array(2)).map(() => ({
                    id: createUuid()
                })),
                maxValues: 20
            };

            component = renderIntoDocument(
                <TokenTextField {...props} />
            );

            spyOn(component, 'setState').and.callThrough();
        });

        it('should exist', function() {
            expect(component).toEqual(jasmine.any(Object));
        });

        it('should have some state', function() {
            expect(component.state).toEqual({
                suggestions: [],

                text: '',
                selectedSuggestion: null
            });
        });

        describe('its dom node', function() {
            let node;

            beforeEach(function() {
                node = findDOMNode(component);
            });

            it('should be a <span>', function() {
                expect(node.tagName).toBe('SPAN');
            });
        });

        describe('when text is input', function() {
            let input;

            beforeEach(function() {
                input = findRenderedDOMComponentWithTag(component, 'input');
                spyOn(component, 'handleNewText').and.callThrough();

                input.value = 'term';
                Simulate.change(input);
            });

            it('should call handleNewText()', function() {
                expect(component.handleNewText).toHaveBeenCalledWith(input.value);
            });
        });

        it('should render an <li> for each suggestion', function() {
            component.setState({ suggestions: [{ id: createUuid() }, { id: createUuid() }, { id: createUuid() }] });
            component.setState({ selectedSuggestion: component.state.suggestions[1].id });
            let list = scryRenderedDOMComponentsWithTag(component, 'ul')[1];
            let suggestions = scryRenderedComponentsWithType(component, TestSuggestion);

            expect(list.querySelectorAll('li').length).toBe(3);
            expect(suggestions.length).toBe(3);
            suggestions.forEach((suggestion, index) => {
                expect(suggestion.props.suggestion).toEqual(component.state.suggestions[index]);
                expect(suggestion.props.active).toBe(index === 1);
            });
        });

        it('should render an <li> for each token', function() {
            let list = scryRenderedDOMComponentsWithTag(component, 'ul')[0];
            let tokens = scryRenderedComponentsWithType(component, TestToken);

            expect(list.querySelectorAll('li').length).toBe(3);
            expect(tokens.length).toBe(2);
            tokens.forEach((token, index) => {
                expect(token.props.token).toEqual(component.props.value[index]);
            });
        });

        describe('typing', function() {
            let input, event;

            function keyDown() {
                const event = { preventDefault: jasmine.createSpy('preventDefault()') };

                Simulate.keyDown(input, event);

                return event;
            }

            beforeEach(function() {
                input = findRenderedDOMComponentWithTag(component, 'input');

                props.value.length = 0;
            });

            describe('before the maxValues is reached', function() {
                beforeEach(function() {
                    props.value.push.apply(props.value, Array.apply([], new Array(props.maxValues - 1)).map(() => ({
                        id: createUuid()
                    })));

                    event = keyDown();
                });

                it('should not prevent the press', function() {
                    expect(event.preventDefault).not.toHaveBeenCalled();
                });
            });

            describe('after the maxValues is reached', function() {
                beforeEach(function() {
                    props.value.push.apply(props.value, Array.apply([], new Array(props.maxValues)).map(() => ({
                        id: createUuid()
                    })));

                    event = keyDown();
                });

                it('should prevent the press', function() {
                    expect(event.preventDefault).toHaveBeenCalledWith();
                });

                describe('if backspace is pressed', function() {
                    beforeEach(function() {
                        Simulate.keyDown(input, { keyCode: KEY_CODES.BACKSPACE });
                    });

                    it('should call onChange', function() {
                        expect(props.onChange).toHaveBeenCalledWith(props.value.slice(0, -1));
                    });
                });
            });
        });

        describe('confirming a suggestion', function() {
            let input;
            let suggestions, tokens;

            beforeEach(function() {
                input = findRenderedDOMComponentWithTag(component, 'input');

                spyOn(component, 'getSuggestions').and.returnValue(Promise.resolve([]));

                suggestions = Array.apply([], new Array(5)).map(() => ({
                    id: createUuid()
                }));
                tokens = Array.apply([], new Array(2)).map(() => ({
                    id: createUuid()
                }));
                props.value.length = 0;
                props.value.push.apply(props.value, tokens);

                component.setState({ suggestions, selectedSuggestion: suggestions[2].id, text: 'My Search' });
                component.setState.calls.reset();
            });

            describe('when the user presses the enter key', function() {
                beforeEach(function() {
                    Simulate.keyDown(input, { keyCode: KEY_CODES.ENTER });
                });

                it('should call onChange', function() {
                    expect(props.onChange).toHaveBeenCalledWith(tokens.concat([suggestions[2]]));
                    expect(component.setState).toHaveBeenCalledWith({ text: '' });
                    expect(component.getSuggestions).toHaveBeenCalledWith('');
                });
            });

            describe('when the user clicks on a suggestion', function() {
                let items, input;

                beforeEach(function() {
                    items = scryRenderedDOMComponentsWithTag(component, 'ul')[1].querySelectorAll('li');
                    input = findRenderedDOMComponentWithTag(component, 'input');

                    spyOn(findDOMNode(input), 'focus').and.callThrough();

                    Simulate.click(items[3]);
                });

                it('should call onChange', function() {
                    expect(props.onChange).toHaveBeenCalledWith(tokens.concat([suggestions[3]]));
                    expect(component.setState).toHaveBeenCalledWith({ text: '' });
                    expect(component.getSuggestions).toHaveBeenCalledWith('');
                });

                it('should focus the input', function() {
                    expect(findDOMNode(input).focus).toHaveBeenCalledWith();
                });
            });
        });

        describe('deleting a token', function() {
            let input;
            let tokens;

            beforeEach(function() {
                input = findRenderedDOMComponentWithTag(component, 'input');

                tokens = Array.apply([], new Array(3)).map(() => ({
                    id: createUuid()
                }));
                props.value.length = 0;
                props.value.push.apply(props.value, tokens);

                component.setState.calls.reset();
            });

            describe('when the user presses backspace/delete', function() {
                describe('if the input has a value', function() {
                    beforeEach(function() {
                        input.value = 'Foo';

                        Simulate.keyDown(input, { keyCode: KEY_CODES.BACKSPACE });
                    });

                    it('should do nothing', function() {
                        expect(component.setState).not.toHaveBeenCalled();
                    });
                });

                describe('if the input has no value', function() {
                    beforeEach(function() {
                        input.value = '';

                        Simulate.keyDown(input, { keyCode: KEY_CODES.BACKSPACE });
                    });

                    it('should call onChange', function() {
                        expect(props.onChange).toHaveBeenCalledWith(tokens.slice(0, -1));
                    });
                });
            });
        });

        describe('navigating suggestions', function() {
            let input;
            let suggestions;
            let suggestionViews;

            beforeEach(function() {
                input = findRenderedDOMComponentWithTag(component, 'input');

                suggestions = Array.apply([], new Array(5)).map(() => ({
                    id: createUuid()
                }));
                component.setState({ suggestions, selectedSuggestion: suggestions[2].id });
                suggestionViews = scryRenderedComponentsWithType(component, TestSuggestion);

                component.setState.calls.reset();
            });

            describe('when the user moves their mouse over a suggestion', function() {
                let items;

                beforeEach(function() {
                    items = scryRenderedDOMComponentsWithTag(component, 'ul')[1].querySelectorAll('li');

                    Simulate.mouseEnter(items[3]);
                });

                it('should set the selectedSuggestion', function() {
                    expect(component.setState).toHaveBeenCalledWith({ selectedSuggestion: suggestions[3].id });
                });
            });

            describe('when the user presses the up arrow', function() {
                beforeEach(function() {
                    Simulate.keyDown(input, { keyCode: KEY_CODES.UP });
                });

                it('should move up one selection', function() {
                    expect(component.setState).toHaveBeenCalledWith({ selectedSuggestion: suggestions[1].id });
                    expect(suggestionViews[1].props.active).toBe(true);
                });

                describe('and the first suggestion is selected', function() {
                    beforeEach(function() {
                        component.setState({ selectedSuggestion: suggestions[0].id });
                        component.setState.calls.reset();

                        Simulate.keyDown(input, { keyCode: KEY_CODES.UP });
                    });

                    it('should not change the selection', function() {
                        expect(component.setState).toHaveBeenCalledWith({ selectedSuggestion: suggestions[0].id });
                    });
                });

                describe('and there are no suggestions', function() {
                    beforeEach(function() {
                        component.setState({ suggestions: [] });
                        component.setState.calls.reset();

                        Simulate.keyDown(input, { keyCode: KEY_CODES.UP });
                    });

                    it('should select nothing', function() {
                        expect(component.setState).toHaveBeenCalledWith({ selectedSuggestion: null });
                    });
                });
            });

            describe('when the user presses the down arrow', function() {
                beforeEach(function() {
                    Simulate.keyDown(input, { keyCode: KEY_CODES.DOWN });
                });

                it('should move down one selection', function() {
                    expect(component.setState).toHaveBeenCalledWith({ selectedSuggestion: suggestions[3].id });
                    expect(suggestionViews[3].props.active).toBe(true);
                });

                describe('and the last suggestion is selected', function() {
                    beforeEach(function() {
                        component.setState({ selectedSuggestion: suggestions[4].id });
                        component.setState.calls.reset();

                        Simulate.keyDown(input, { keyCode: KEY_CODES.DOWN });
                    });

                    it('should not change the selection', function() {
                        expect(component.setState).toHaveBeenCalledWith({ selectedSuggestion: suggestions[4].id });
                    });
                });

                describe('and there are no suggestions', function() {
                    beforeEach(function() {
                        component.setState({ suggestions: [] });
                        component.setState.calls.reset();

                        Simulate.keyDown(input, { keyCode: KEY_CODES.DOWN });
                    });

                    it('should select nothing', function() {
                        expect(component.setState).toHaveBeenCalledWith({ selectedSuggestion: null });
                    });
                });
            });
        });

        describe('methods', function() {
            describe('handleNewText(text)', function() {
                let text;

                beforeEach(function() {
                    text = 'hello!';

                    spyOn(component, 'throttledGetSuggestions').and.returnValue(Promise.resolve([]));

                    component.handleNewText(text);
                });

                it('should udpate the state', function() {
                    expect(component.setState).toHaveBeenCalledWith({ text });
                });

                it('should get some suggestions', function() {
                    expect(component.throttledGetSuggestions).toHaveBeenCalledWith(text);
                });
            });

            describe('getSuggestions(text)', function() {
                let getSuggestions;
                let text;
                let getSuggestionsDeferred;
                let suggestions;

                beforeEach(function(done) {
                    getSuggestions = component.getSuggestions;
                    text = 'hello!';

                    suggestions = [
                        { id: createUuid(), text: 'foo' },
                        { id: createUuid(), text: 'bar' }
                    ];
                    component.setState({ selectedSuggestion: suggestions[1].id });
                    component.setState.calls.reset();

                    props.getSuggestions.and.returnValue((getSuggestionsDeferred = defer()).promise);

                    getSuggestions(text);
                    wait(5).then(done);
                });

                it('should get some suggestions', function() {
                    expect(props.getSuggestions).toHaveBeenCalledWith(text);
                });

                describe('when suggestions are fetched', function() {
                    beforeEach(function(done) {
                        getSuggestionsDeferred.resolve(suggestions);
                        wait(5).then(done);
                    });

                    it('should set the suggestions', function() {
                        expect(component.setState).toHaveBeenCalledWith({ suggestions, selectedSuggestion: suggestions[1].id });
                    });
                });

                describe('if the new suggestions do not contain the selectedSuggestion', function() {
                    beforeEach(function(done) {
                        suggestions[1].id = createUuid();

                        getSuggestionsDeferred.resolve(suggestions);
                        wait(5).then(done);
                    });

                    it('should set selectedSuggestion to the first suggestion', function() {
                        expect(component.setState).toHaveBeenCalledWith({
                            suggestions, selectedSuggestion: suggestions[0].id
                        });
                    });
                });

                describe('if no selections are fetched', function() {
                    beforeEach(function(done) {
                        getSuggestionsDeferred.resolve([]);
                        wait(5).then(done);
                    });

                    it('should set selectedSuggestion to null', function() {
                        expect(component.setState).toHaveBeenCalledWith({
                            suggestions: [], selectedSuggestion: null
                        });
                    });
                });

                describe('if more suggestions are requested', function() {
                    let moreSuggestionsDeferred;
                    let moreSuggestions;

                    beforeEach(function(done) {
                        moreSuggestions = [
                            { id: createUuid(), text: 'hello' },
                            { id: createUuid(), text: 'world' }
                        ];

                        component.setState.calls.reset();

                        props.getSuggestions.and.returnValue((moreSuggestionsDeferred = defer()).promise);
                        props.getSuggestions.calls.reset();

                        getSuggestions('hello world!');
                        moreSuggestionsDeferred.resolve(moreSuggestions);
                        getSuggestionsDeferred.resolve(suggestions);
                        wait(5).then(done);
                    });

                    it('should set the state in the original call order', function() {
                        expect(component.setState.calls.count()).toBe(2);
                        expect(component.setState.calls.mostRecent().args[0]).toEqual({ suggestions: moreSuggestions, selectedSuggestion: moreSuggestions[0].id });
                    });
                });
            });
        });
    });
});
