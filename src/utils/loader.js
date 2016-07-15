import {
    cloneDeep as clone,
    noop,
} from 'lodash';

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

export default new Loader({});
