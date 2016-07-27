var loginCommands = {
    login: function(browser) {
        this
        .navigate()
        .waitForElementVisible('body', 10000)
        .waitForElementVisible('@emailInput', 10000)
        .setValue('@emailInput', browser.globals.email)
        .setValue('@passwordInput', browser.globals.password)
        .click('@submitButton');

        return browser;
    }
};

module.exports = {
    commands: [loginCommands],
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
