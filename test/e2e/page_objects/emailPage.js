module.exports = {
    url: function() {
        return this.api.launchUrl + '#/dashboard/account/email';
    },
    elements: {
        emailInput: 'input[type=email]',
        passwordInput: 'input[type=password]',
        submitButton: 'button[type=submit]',
        alert: 'div[role=alert]'
    }
};
