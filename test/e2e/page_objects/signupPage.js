module.exports = {
    url: function() {
        return this.api.launchUrl + '#/sign-up';
    },
    elements: {
        emailInput: 'input[type=email]',
        passwordInput: 'input[type=password]',
        submitButton: 'button[type=submit]',
        firstNameInput: 'input[name=firstName]',
        lastNameInput: 'input[name=lastName]',
        alert: 'div[role=alert]'
    }
};
