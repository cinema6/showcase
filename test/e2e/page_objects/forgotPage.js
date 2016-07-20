module.exports = {
    url: function() {
        return this.api.launchUrl + '#/forgot-password';
    },
    elements: {
        emailInput: 'input[type=email]',
        submitButton: 'button[type=submit]',
        alert: 'div[role=alert]'
    }
};
