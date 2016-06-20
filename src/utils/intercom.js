import { intercomId } from '../../config';

function load() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        const firstScript = document.getElementsByTagName('script')[0];

        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
            resolve(window.Intercom);
        };
        script.src = `https://widget.intercom.io/widget/${intercomId}`;

        firstScript.parentNode.insertBefore(script, firstScript);
    });
}

export default {
    pending: null,
    id: intercomId,
    load() {
        this.pending = this.pending || load();

        return this.pending;
    },
    track(...args) {
        return this.load().then(intercom => {
            intercom(...args);
        });
    },
};
