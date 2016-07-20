module.exports = {
    url: function() {
        return this.api.launchUrl + '#/login';
    },
    elements: {
        emailInput: 'input[type=email]',
        passwordInput: 'input[type=password]',
        submitButton: 'button[type=submit]',
        alert: 'div[role=alert]'
    }
};
