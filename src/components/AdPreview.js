import React, { Component, PropTypes } from 'react';
import { Player } from 'c6embed';
import { defaults, debounce, isEqual, noop } from 'lodash';
import classnames from 'classnames';
import { resolve as resolveURL } from 'url';

const PLAYER_STYLES = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    zIndex: 'auto',
};

function delay(time) {
    if (!time) { return Promise.resolve(); }

    return new Promise(resolve => setTimeout(resolve, time));
}

export default class AdPreview extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            loading: false,
        };

        this.createPlayerDebounced = debounce(this.createPlayer.bind(this), 250);
    }

    componentDidMount() {
        this.createPlayer();
    }

    componentWillReceiveProps(nextProps) {
        if (isEqual(nextProps.productData, this.props.productData)) { return; }

        this.createPlayerDebounced(nextProps);
    }

    componentWillUnmount() {
        this.createPlayerDebounced.cancel();
        this.player = null;
    }

    createPlayer(props = this.props) {
        const {
            refs: { root },
            player: currentPlayer,
        } = this;
        const {
            apiRoot,
            cardOptions,
            placementOptions,
            productData,
            factory,
        } = props;
        const { type } = placementOptions;

        if (currentPlayer) {
            root.removeChild(currentPlayer.frame);
        }

        if (!productData) { return (this.player = null); }

        this.player = new Player(resolveURL(apiRoot, `/api/public/players/${type}`), defaults({
            mobileType: type,
            preview: true,
            container: 'showcase',
            context: 'showcase',
            autoLaunch: false,
        }, placementOptions), {
            experience: {
                id: 'e-showcase_preview',
                data: {
                    campaign: {},
                    collateral: {},
                    params: {},
                    links: {},
                    deck: [factory(cardOptions)(productData)],
                },
            },
        });

        this.setState({ loading: true });

        return Promise.all([
            this.player.bootstrap(root, PLAYER_STYLES),
            delay(this.props.loadDelay),
        ]).then(([player]) => player.show())
            .then(() => this.setState({ loading: false }))
            .then(() => this.props.onLoadComplete());
    }

    render() {
        const {
            showLoadingAnimation,
        } = this.props;
        const {
            loading,
        } = this.state;

        return (<div
            className="create-ad step-2 col-md-6 col-sm-6 col-xs-12 col-middle text-center"
        >
            <div className="phone-wrap">
                <div ref="root" className="phone-frame">
                    {showLoadingAnimation && (
                        <div
                            data-test="animation"
                            className={classnames('text-animation-wrap', {
                                hidden: !loading,
                            })}
                        >
                            <h3 className="light-text">Generating preview...</h3>
                            <div className="animation-container">
                                <div className="animate-content">
                                    <p className="frame-1">Importing from app store</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <p>This is how your ad will appear</p>
            </div>
        </div>);
    }
}

AdPreview.propTypes = {
    cardOptions: PropTypes.object.isRequired,
    placementOptions: PropTypes.shape({
        type: PropTypes.string.isRequired,
    }).isRequired,
    productData: PropTypes.object,
    factory: PropTypes.func.isRequired,

    apiRoot: PropTypes.string.isRequired,
    loadDelay: PropTypes.number.isRequired,
    showLoadingAnimation: PropTypes.bool.isRequired,
    onLoadComplete: PropTypes.func.isRequired,
};
AdPreview.defaultProps = {
    apiRoot: '/',
    showLoadingAnimation: false,
    onLoadComplete: noop,
    loadDelay: 0,
};
