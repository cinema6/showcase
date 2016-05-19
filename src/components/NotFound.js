import React, { Component } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';

export default class NotFound extends Component {
    componentDidMount() {
        const script = document.createElement('script');
        script.src = 'https://platform.vine.co/static/scripts/embed.js';
        findDOMNode(this).appendChild(script);
    }

    render() {
        return (<div className="container main-section">
            <h1>Well this is awkward...</h1>
            <p>We couldn't find what you were looking for. Sorry about that.</p>
            <p>
                You could try heading back to the <Link to="/dashboard" className="btn btn-primary">
                    Dashboard
                </Link>, or you're welcome to stay here and watch this cat Vine over and over again.
            </p>
            <p>
                <iframe src="https://vine.co/v/hETBPqijwFM/embed/simple"
                    width="600"
                    height="600"
                    frameBorder="0" />
                <script src="https://platform.vine.co/static/scripts/embed.js" />
            </p>
        </div>);
    }
}
