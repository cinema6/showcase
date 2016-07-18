import {
    cloneDeep as clone,
    noop,
} from 'lodash';
import { intercomId } from '../../config';

export class Loader {
    constructor(config) {
        this.config = clone(config);

        this.cache = {};
    }

    load(name) {
        const config = this.config[name] || {};
        const {
            src,
        } = config;

        if (!src) {
            return Promise.reject(new Error(`Unknown resource: [${name}].`));
        }

        return this.cache[name] || (this.cache[name] = new Promise((resolve, reject) => {
            const {
                preload = noop,
                postload = () => resolve(window[name]),
            } = config;

            const script = document.createElement('script');

            script.async = true;
            script.src = src;
            script.onerror = () => reject(new Error(`Failed to load [${name}](${src}).`));
            script.onload = () => {
                try { resolve(postload()); } catch (error) { reject(error); }
            };

            preload();

            document.head.appendChild(script);
        }));
    }
}

export default new Loader({
    intercom: {
        src: `https://widget.intercom.io/widget/${intercomId}`,
        postload: () => window.Intercom,
    },
    adwords: {
        src: 'https://www.googleadservices.com/pagead/conversion_async.js',
        postload: () => window.google_trackConversion || noop,
    },
    twitter: {
        src: 'https://platform.twitter.com/oct.js',
        postload: () => window.twttr,
    },
    facebook: {
        src: 'https://connect.facebook.net/en_US/fbevents.js',
        preload: () => {
            /* eslint-disable no-underscore-dangle */
            const fbq = window._fbq = window.fbq = (...args) => (
                fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args)
            );

            fbq.push = fbq;
            fbq.loaded = true;
            fbq.version = '2.0';
            fbq.queue = [];
        },
        postload: () => {
            const { fbq } = window;

            fbq('init', '202344783438882');

            return fbq;
        },
    },
});
