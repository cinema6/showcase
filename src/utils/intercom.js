import { intercomId } from '../../config';

function load() {
    return new Promise(function(resolve, reject) {
        let script = document.createElement('script');
        let firstScript = document.getElementsByTagName('script')[0];

        script.type = 'text/javascript';
        script.async = true;
        script.onload = function() {
            resolve(window.Intercom);
        };
        script.src = 'https://widget.intercom.io/widget/' + intercomId;

        firstScript.parentNode.insertBefore(script, firstScript);
    });
}

export default {
    pending: null,
    id: intercomId,
    load: function() {
        this.pending = this.pending || load();

        return this.pending;
    },
    track: function(...args) {
        return this.load().then(Intercom => {
            Intercom(...args);
        });
    }
};
